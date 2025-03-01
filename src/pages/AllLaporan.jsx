import axios from "axios";
import React, { useEffect, useState } from "react";
import SpinnerModal from "../components/SpinnerModal"; // Adjust the import path as needed

const AllLaporan = () => {
  const [laporan, setLaporan] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        const response = await axios.get("https://backend-laporan.vercel.app/api/laporan");
        setLaporan(response.data.data);
      } catch (error) {
        console.error("Error fetching laporan:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchLaporan();

    // Add scroll event listener to toggle "Go to Top" button visibility
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredLaporan = laporan.filter((lap) => {
    return (
      lap.part_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lap.no_resi.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const sortedLaporan = [...filteredLaporan].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const formatFileLinks = (fileUpload) => {
    let files;

    try {
      files = JSON.parse(fileUpload);
    } catch (error) {
      files = fileUpload.split(",").map((file) => file.trim());
    }

    const baseUrl = "https://ik.imagekit.io/renisa/laporan/";

    return files.map((file, index) => {
      const fileUrl = file.startsWith(baseUrl) ? file : baseUrl + file;
      return (
        <div key={index}>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            Berkas {index + 1}
          </a>
        </div>
      );
    });
  };

  // Scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {loading && <SpinnerModal />} {/* Show spinner while loading */}

      <h1 className="text-2xl font-bold mb-4">All Reports</h1>

      <input
        type="text"
        placeholder="Search by Part Number or No Resi"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border rounded p-2 mb-4 w-full"
      />

      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className="border rounded p-2 mb-4"
      >
        <option value="desc">Sort by Created At: Newest First</option>
        <option value="asc">Sort by Created At: Oldest First</option>
      </select>

      {Array.isArray(sortedLaporan) && sortedLaporan.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-white rounded-lg shadow-lg border border-gray-300">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="border-b border-gray-300 px-4 py-2">Vendor</th>
                <th className="border-b border-gray-300 px-4 py-2">Nama Barang</th>
                <th className="border-b border-gray-300 px-4 py-2">Part Number</th>
                <th className="border-b border-gray-300 px-4 py-2">Quantity</th>
                <th className="border-b border-gray-300 px-4 py-2">Tanggal</th>
                <th className="border-b border-gray-300 px-4 py-2">No Resi</th>
                <th className="border-b border-gray-300 px-4 py-2">Berkas</th>
              </tr>
            </thead>
            <tbody>
              {sortedLaporan.map((lap) => (
                <tr key={lap.id} className="hover:bg-gray-100 transition duration-200">
                  <td className="border-b border-l border-r border-gray-300 px-4 py-2">{lap.vendor}</td>
                  <td className="border-b border-l border-r border-gray-300 px-4 py-2">
                    <ul className="list-disc list-inside">
                      {(() => {
                        try {
                          return JSON.parse(lap.nama_barang).map((item, index) => (
                            <li key={index}>{item}</li>
                          ));
                        } catch (error) {
                          return <li>{lap.nama_barang}</li>;
                        }
                      })()}
                    </ul>
                  </td>
                  <td className="border-b border-l border-r border-gray-300 px-4 py-2">
                    <ul className="list-disc list-inside">
                      {(() => {
                        try {
                          return JSON.parse(lap.part_number).map((item, index) => (
                            <li key={index}>{item}</li>
                          ));
                        } catch (error) {
                          return <li>{lap.part_number}</li>;
                        }
                      })()}
                    </ul>
                  </td>
                  <td className="border-b border-l border-r border-gray-300 px-4 py-2">
                    <ul className="list-disc list-inside">
                      {(() => {
                        try {
                          return JSON.parse(lap.qty).map((item, index) => (
                            <li key={index}>{item}</li>
                          ));
                        } catch (error) {
                          return <li>{lap.qty}</li>;
                        }
                      })()}
                    </ul>
                  </td>
                  <td className="border-b border-l border-r border-gray-300 px-4 py-2">{lap.date}</td>
                  <td className="border-b border-l border-r border-gray-300 px-4 py-2">{lap.no_resi}</td>
                  <td className="border-b border-l border-r border-gray-300 px-4 py-2 text-blue-500 underline">
                    {formatFileLinks(lap.fileUpload)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No laporan found.</p>
      )}

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition"
        >
          &#8679; {/* Up arrow symbol */}
        </button>
      )}
    </div>
  );
};

export default AllLaporan;
