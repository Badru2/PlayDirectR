import axios from "axios";
import { useEffect, useState } from "react";
import Toast from "../../components/themes/alert";

const AppLogPage = () => {
  const [applogs, setApplogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // State to track current page
  const [totalPages, setTotalPages] = useState(1); // State to track total pages

  const fetchAppLogs = async (currentPage) => {
    try {
      const response = await axios.get(`/api/applog/show`, {
        params: { page: currentPage, limit: 10 }, // Send page and limit as query params
      });
      setApplogs(response.data.logs); // Logs for the current page
      setTotalPages(response.data.totalPages); // Total number of pages
      setPage(response.data.currentPage); // Update current page
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Failed to fetch app logs",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppLogs(page); // Fetch logs for the initial page
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setLoading(true);
      setPage(newPage); // Update the page state to fetch the corresponding logs
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading logs...</p>
      ) : applogs.length === 0 ? (
        <p>No logs found.</p>
      ) : (
        <div>
          <table className="table">
            <thead>
              <tr className="text-2xl font-bold">
                <td>User</td>
                <td>Error</td>
                <td>Route</td>
              </tr>
            </thead>

            <tbody>
              {applogs.map((applog) => (
                <tr key={applog._id}>
                  <td>{applog.User?.username || "N/A"}</td>
                  <td>{applog.message}</td>
                  <td>{applog.route}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`bg-blue-500 text-white px-4 py-2 rounded-md ${
                  page === i + 1 ? "bg-blue-700" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppLogPage;
