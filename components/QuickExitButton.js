export default function QuickExitButton() {
  const handleExit = () => {
    // Replaces history so back button doesn't return here, then redirects
    window.location.replace('https://www.google.com');
  };

  return (
    <button
      onClick={handleExit}
      aria-label="Quick exit - leave this site immediately"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        float: 'right',
        background: '#c2185b',
        color: '#ffffff',
        border: 'none',
        borderRadius: '6px',
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      Quick Exit
    </button>
  );
}
