import { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';

const FILE_TYPE_OPTIONS = [
  { value: 'photo', label: 'Photo' },
  { value: 'video', label: 'Video' },
  { value: 'audio', label: 'Audio' },
  { value: 'document', label: 'Document' },
];

function guessFileType(file) {
  if (file.type.startsWith('image/')) return 'photo';
  if (file.type.startsWith('video/')) return 'video';
  if (file.type.startsWith('audio/')) return 'audio';
  return 'document';
}

export default function VaultPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState('photo');
  const [note, setNote] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [verifyingId, setVerifyingId] = useState(null);

  const loadItems = useCallback(async () => {
    setLoadingItems(true);
    const { data, error: fetchError } = await supabase
      .from('evidence_items')
      .select('*')
      .order('created_at', { ascending: false });
    if (!fetchError) setItems(data || []);
    setLoadingItems(false);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login');
        return;
      }
      setCheckingAuth(false);
      loadItems();
    });
  }, [router, loadItems]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setFileType(guessFileType(f));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!file) {
      setError('Choose a file first.');
      return;
    }

    setUploading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setError('Your session expired. Please log in again.');
        setUploading(false);
        return;
      }

      const userId = session.user.id;
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `${userId}/${crypto.randomUUID()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from('evidence')
        .upload(filePath, file, { upsert: false });

      if (uploadError) {
        setError(`Upload failed: ${uploadError.message}`);
        setUploading(false);
        return;
      }

      const res = await fetch('/api/evidence/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          filePath,
          fileType,
          originalFilename: file.name,
          fileSizeBytes: file.size,
          note: note.trim() || null,
        }),
      });

      const body = await res.json();
      if (!res.ok) {
        setError(body.error || 'Could not register the file after upload.');
        setUploading(false);
        return;
      }

      setMessage('File uploaded and secured.');
      setFile(null);
      setNote('');
      await loadItems();
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    }
    setUploading(false);
  };

  const handleVerify = async (itemId) => {
    setVerifyingId(itemId);
    setError('');
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const res = await fetch('/api/evidence/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ itemId }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error || 'Verification failed.');
      } else {
        await loadItems();
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    }
    setVerifyingId(null);
  };

  if (checkingAuth) return null;

  return (
    <Layout>
      <Head>
        <title>Evidence Vault</title>
      </Head>

      <div className="wrap">
        <h1>Evidence Vault</h1>
        <p className="sub">
          A private, secure place to store photos, video, audio, or documents. Only you can see
          what's in here. Each file is fingerprinted when it's uploaded, so you can check later
          whether it's still exactly as it was, unedited, since the day you added it.
        </p>

        <form className="upload-card" onSubmit={handleUpload}>
          <label className="field">
            <span>File</span>
            <input type="file" onChange={handleFileChange} />
          </label>

          <label className="field">
            <span>Type</span>
            <select value={fileType} onChange={(e) => setFileType(e.target.value)}>
              {FILE_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Note (optional)</span>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Screenshot from 14 March"
            />
          </label>

          <button type="submit" disabled={uploading}>
            {uploading ? 'Uploading…' : 'Add to vault'}
          </button>

          {message && <p className="msg-ok">{message}</p>}
          {error && <p className="msg-err">{error}</p>}
        </form>

        <h2>Your files</h2>
        {loadingItems ? (
          <p>Loading…</p>
        ) : items.length === 0 ? (
          <p className="empty">Nothing in your vault yet.</p>
        ) : (
          <div className="item-list">
            {items.map((item) => (
              <div className="item" key={item.id}>
                <div className="item-main">
                  <p className="item-name">{item.original_filename || item.file_path}</p>
                  <p className="item-meta">
                    {item.file_type} · added {new Date(item.created_at).toLocaleString()}
                  </p>
                  {item.note && <p className="item-note">{item.note}</p>}
                  {item.last_verified_at && (
                    <p className={item.last_verified_match ? 'verify-ok' : 'verify-bad'}>
                      {item.last_verified_match
                        ? `Verified unchanged — last checked ${new Date(
                            item.last_verified_at
                          ).toLocaleString()}`
                        : `Warning: this file no longer matches its original fingerprint (checked ${new Date(
                            item.last_verified_at
                          ).toLocaleString()})`}
                    </p>
                  )}
                </div>
                <button
                  className="verify-btn"
                  onClick={() => handleVerify(item.id)}
                  disabled={verifyingId === item.id}
                >
                  {verifyingId === item.id ? 'Checking…' : 'Verify integrity'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .wrap {
          max-width: 720px;
          margin: 0 auto;
          padding: 40px 20px 80px;
        }
        h1 {
          font-weight: 800;
          margin-bottom: 8px;
        }
        .sub {
          color: var(--muted);
          margin-bottom: 28px;
          line-height: 1.5;
        }
        .upload-card {
          background: var(--warm);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 36px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 700;
        }
        .field input,
        .field select {
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid var(--sand);
          font-size: 0.9rem;
        }
        button {
          background: var(--rose);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          width: fit-content;
        }
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .msg-ok {
          color: #1a7a3a;
          font-weight: 600;
        }
        .msg-err {
          color: #b91c1c;
          font-weight: 600;
        }
        .empty {
          color: var(--muted);
        }
        .item-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .item {
          border: 1px solid var(--sand);
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
        }
        .item-name {
          font-weight: 700;
        }
        .item-meta {
          color: var(--muted);
          font-size: 0.82rem;
        }
        .item-note {
          font-size: 0.85rem;
          margin-top: 4px;
        }
        .verify-ok {
          color: #1a7a3a;
          font-size: 0.8rem;
          margin-top: 6px;
        }
        .verify-bad {
          color: #b91c1c;
          font-size: 0.8rem;
          margin-top: 6px;
          font-weight: 700;
        }
        .verify-btn {
          background: white;
          color: var(--rose);
          border: 1px solid var(--rose);
          padding: 8px 14px;
          font-size: 0.8rem;
          white-space: nowrap;
        }
      `}</style>
    </Layout>
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
