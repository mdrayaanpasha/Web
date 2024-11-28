export default function Button({ label, onClick }) {
    return (
      <button
        onClick={onClick}
        className="bg-white border border-gray-300 text-gray-700 rounded px-4 py-2 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-200 transition"
      >
        {label}
      </button>
    );
  }
  