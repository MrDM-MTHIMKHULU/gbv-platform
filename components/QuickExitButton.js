export default function QuickExitButton() {
  const handleExit = () => {
    window.location.replace('https://www.google.com');
  };

  return (
    <>
      <button onClick={handleExit} aria-label="Quick exit - leave this site immediately">
        Quick Exit
      </button>
      <style jsx>{`
        button {
          position: fixed;
          top: 16px;
          right: 16px;
          z-index: 9999;
          background: #c41e3a;
          color: white;
          border: none;
          padding: 10px 20px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 4px;
          box-shadow: 0 4px 20px rgba(196, 30, 58, 0.4);
        }
        button:hover {
          background: #9c1530;
        }
      `}</style>
    </>
  );
}
