import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-yellow-100 to-white px-2 sm:px-0">
      <div className="text-center">
        <h1 className="text-5xl sm:text-7xl font-extrabold text-yellow-400 mb-4">404</h1>
        <h2 className="text-xl sm:text-3xl font-bold mb-2 text-gray-800">Page Not Found</h2>
        <p className="text-base sm:text-lg text-gray-600 mb-8 text-center">Sorry, the page you are looking for does not exist.</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
