import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo / Home */}
        <Link to="/" className="text-xl font-bold text-gray-800">
          Home
        </Link>

        {/* Logout */}
        <button
          onClick={() => {
            // logika logout di sini
            console.log("Logged out");
          }}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
