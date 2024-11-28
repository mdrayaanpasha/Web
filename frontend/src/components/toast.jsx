import { useState, useEffect } from 'react';

const Toast = ({ message }) => {
  const [showToast, setShowToast] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 3000); // Hide after 3 seconds

    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, []);

  return (
    showToast && (
      <div className="fixed top-10 right-4 bg-black text-white p-4 rounded-lg shadow-lg max-w-xs">
        <p className="text-md font-bold">{message}</p>
      </div>
    )
  );
};

export default Toast;
