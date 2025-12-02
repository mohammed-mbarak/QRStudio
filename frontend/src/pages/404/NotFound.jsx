import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <XCircle className="w-20 h-20 text-red-500 mb-6" />

      <h1 className="text-4xl font-bold text-white mb-2">Page Not Found</h1>
      <p className="text-gray-400 mb-8 max-w-md">
        The page you’re looking for doesn’t exist or may have been moved.
      </p>

      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white transition"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
