import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function EmergencyAlert({ initialContacts, onSaved }) {
  const [contactName, setContactName] = useState(initialContacts?.name || '');
  const [contactPhone, setContactPhone] = useState(initialContacts?.phone || '');
  const [contactEmail, setContactEmail] = useState(initialContacts?.email || '');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [locating, setLocating] = useState(false);

  const handleSaveContact = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus('');

    const { error } = await supabase.auth.updateUser({
      data: {
        emergency_contact_name: contactName,
        emergency_contact_phone: contactPhone,
        emergency_contact_email: contactEmail,
      },
    });

    setSaving(false);

    if (error) {
      setStatus('Could not save contact. Please try again.');
      return;
    }

    setStatus('Trusted contact saved.');
    if (onSaved) onSaved();
  };

  const sendAlert = (method) => {
    if (!contactPhone && method === 'sms') {
      setStatus('Add a trusted contact\u2019s phone number first.');
      return;
    }
    if (!contactEmail && method === 'email') {
      setStatus('Add a trusted contact\u2019s email first.');
      return;
    }

    setLocating(true);
    setStatus('');

    const composeMessage = (locationText) =>
      `I need help. This isn\u2019t a test.${locationText}`;

    const openWithLocation = (locationText) => {
      const message = composeMessage(locationText);
      if (method === 'sms') {
        window.location.href = `sms:${contactPhone}?body=${encodeURIComponent(message)}`;
      } else {
        window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(
          'I need help'
        )}&body=${encodeURIComponent(message)}`;
      }
      setLocating(false);
    };

    if (!navigator.geolocation) {
      openWithLocation('');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapLink = `https://maps.google.com/?q=${latitude},${longitude}`;
        openWithLocation(` My location: ${mapLink}`);
      },
      () => {
        openWithLocation(' (I couldn\u2019t share my location \u2014 please try calling me.)');
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="alert-card">
      <p className="eyebrow">Emergency alert</p>
      <h2>Trusted contact</h2>
      <p className="note">
        Save someone you trust below. If you ever need to, the button will
        open a pre-filled message with your location for you to send \u2014
        nothing is sent automatically or without you tapping send yourself.
      </p>

      <form onSubmit={handleSaveContact}>
        <label className="field-label" htmlFor="contactName">Contact name</label>
        <input
          id="contactName"
          type="text"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
        />

        <label className="field-label" htmlFor="contactPhone">Contact phone</label>
        <input
          id="contactPhone"
          type="tel"
          placeholder="For SMS alert"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
        />

        <label className="field-label" htmlFor="contactEmail">Contact email</label>
        <input
          id="contactEmail"
          type="email"
          placeholder="For email alert"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
        />

        <button type="submit" className="save-btn" disabled={saving}>
          {saving ? 'Saving\u2026' : 'Save trusted contact'}
        </button>
      </form>

      {status && <p className="status">{status}</p>}

      <div className="alert-actions">
        <button
          type="button"
          className="alert-btn sms"
          onClick={() => sendAlert('sms')}
          disabled={locating}
        >
          {locating ? 'Getting location\u2026' : 'Text my location'}
        </button>
        <button
          type="button"
          className="alert-btn email"
          onClick={() => sendAlert('email')}
          disabled={locating}
        >
          {locating ? 'Getting location\u2026' : 'Email my location'}
        </button>
      </div>

      <style jsx>{`
        .alert-card {
          background: var(--warm);
          border-radius: 16px;
          padding: 30px 26px;
          margin-top: 30px;
        }
        .eyebrow {
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--rose);
          margin-bottom: 8px;
        }
        h2 {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--ink);
          margin-bottom: 10px;
        }
        .note {
          font-size: 0.85rem;
          color: var(--muted);
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .field-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 6px;
          margin-top: 14px;
        }
        input {
          width: 100%;
          border: 1px solid var(--sand);
          border-radius: 8px;
          padding: 11px 14px;
          font-size: 0.9rem;
          font-family: inherit;
          background: white;
          color: var(--ink);
        }
        .save-btn {
          background: white;
          border: 1px solid var(--sand);
          color: var(--ink);
          padding: 10px 18px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.85rem;
          margin-top: 16px;
          cursor: pointer;
        }
        .save-btn:disabled {
          opacity: 0.6;
        }
        .status {
          font-size: 0.83rem;
          color: var(--rose-deep);
          margin-top: 12px;
          font-weight: 600;
        }
        .alert-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid var(--sand);
        }
        .alert-btn {
          padding: 13px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          border: none;
        }
        .alert-btn.sms {
          background: var(--rose);
          color: white;
        }
        .alert-btn.email {
          background: var(--rose-deep);
          color: white;
        }
        .alert-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
