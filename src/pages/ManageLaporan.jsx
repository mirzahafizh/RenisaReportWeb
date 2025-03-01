import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import EditModal from "../components/EditModal"; // Import the EditModal component
import Spinner from "../components/SpinnerModal";
import SuccessModal from "../components/SuccessModal";

const ManageLaporan = () => {
  const [laporan, setLaporan] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [editData, setEditData] = useState(null); // Store the current edit data
  const [sortOrder, setSortOrder] = useState("desc"); // State for sorting order (desc or asc)
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error handling
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success modal visibility
  const [failureMessage, setFailureMessage] = useState(""); // State for failure message
  const [showFailureModal, setShowFailureModal] = useState(false); // State for failure modal visibility

  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        const username = localStorage.getItem("username");
        const response = await axios.get(
          `https://backend-laporan.vercel.app/api/laporan/username/${username}`
        );
        setLaporan(response.data.data);
      } catch (error) {
        console.error("Error fetching laporan:", error);
        setError("Failed to load laporan."); // Set error message
        setFailureMessage("Failed to load laporan."); // Set failure message for modal
        setShowFailureModal(true); // Show failure modal
      } finally {
        setLoading(false); // Loading complete
      }
    };

    fetchLaporan();
  }, []);

  if (loading) return <Spinner />; // Show spinner while loading
  if (error) return <p>{error}</p>; // Error state

  const filteredLaporan = laporan.filter((lap) => {
    const partNumbers =
      typeof lap.part_number === "string" ? lap.part_number.split(",") : [];
    const partNumberMatches = partNumbers.some((part) =>
      part.trim().toLowerCase().includes(searchQuery.toLowerCase())
    );

    const noResiMatches = lap.no_resi
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return partNumberMatches || noResiMatches;
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

  const handleEdit = (lap) => {
    setEditData(lap); // Set the edit data
    setIsModalOpen(true); // Open the modal
  };

  const handleDelete = async (id) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this laporan?"
      );
      if (confirmed) {
        await axios.delete(
          `https://backend-laporan.vercel.app/api/laporan/${id}`
        );
        setLaporan(laporan.filter((lap) => lap.id !== id));
        setSuccessMessage("Laporan deleted successfully!");
        setShowSuccessModal(true); // Show success modal after deletion
      }
    } catch (error) {
      console.error("Error deleting laporan:", error);
      setFailureMessage("Failed to delete laporan."); // Set failure message for modal
      setShowFailureModal(true); // Show failure modal
    }
  };

  const updateLaporan = async (id, updatedData) => {
    try {
      await axios.put(
        `https://backend-laporan.vercel.app/api/laporan/${id}`,
        updatedData
      );
      setLaporan(
        laporan.map((lap) => (lap.id === id ? { ...lap, ...updatedData } : lap))
      );
      setSuccessMessage("Laporan updated successfully!");
      setShowSuccessModal(true); // Show success modal after update
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating laporan:", error);
      setError("Failed to update laporan.");
      setFailureMessage("Failed to update laporan."); // Set failure message for modal
      setShowFailureModal(true); // Show failure modal
    }
  };
  if (loading) return <p>Loading...</p>; // Loading state
  if (error) return <p>{error}</p>; // Error state

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Reports</h1>

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
        <option value="desc">Sort by Date (Descending)</option>
        <option value="asc">Sort by Date (Ascending)</option>
      </select>

      {Array.isArray(sortedLaporan) && sortedLaporan.length > 0 ? (
        <div className="w-full overflow-x-auto">
          <table className="table-auto w-full bg-white rounded-lg shadow-lg border border-gray-300">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="border-b border-gray-300 px-4 py-2 text-left">
                  Vendor
                </th>
                <th className="border-b border-gray-300 px-4 py-2 text-left">
                  Nama Barang
                </th>
                <th className="border-b border-gray-300 px-4 py-2 text-left">
                  Part Number
                </th>
                <th className="border-b border-gray-300 px-4 py-2 text-left">
                  Quantity
                </th>
                <th className="border-b border-gray-300 px-4 py-2 text-left">
                  Tanggal
                </th>
                <th className="border-b border-gray-300 px-4 py-2 text-left">
                  No Resi
                </th>
                <th className="border-b border-gray-300 px-4 py-2 text-left">
                  Berkas
                </th>
                <th className="border-b border-gray-300 px-4 py-2 text-left">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedLaporan.map((lap) => (
                <tr
                  key={lap.id}
                  className="hover:bg-gray-100 transition duration-200"
                >
                  <td className="border-b border-l border-r border-gray-300 px-4 py-2">
                    {lap.vendor}
                  </td>
                  <td className="border-b border-l border-r border-gray-300 px-4 py-2">
                    <ul className="list-disc list-inside">
                      {(() => {
                        try {
                          return JSON.parse(lap.nama_barang).map(
                            (item, index) => <li key={index}>{item}</li>
                          );
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
                          return JSON.parse(lap.part_number).map(
                            (item, index) => <li key={index}>{item}</li>
                          );
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
                  <td className="border-b border-l border-r border-gray-300 px-4 py-2">
                    {new Date(lap.created_at).toLocaleDateString("id-ID")}
                  </td>
                  <td className="border-b border-l border-r border-gray-300 px-4 py-2">
                    {lap.no_resi}
                  </td>
                  <td className="border-b border-l border-r border-gray-300 px-4 py-2 text-blue-500 underline">
                    {formatFileLinks(lap.fileUpload)}
                  </td>
                  <td className="border-b border-l border-r border-gray-300 px-4 py-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(lap)}
                        className="text-blue-500 hover:underline"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => handleDelete(lap.id)}
                        className="text-red-500 hover:underline"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No reports found.</p>
      )}

      {isModalOpen && editData && (
        <EditModal
          lap={editData}
          onClose={() => setIsModalOpen(false)}
          onUpdate={updateLaporan}
        />
      )}

            {/* Success Modal */}
            {showSuccessModal && (
        <SuccessModal
          message={successMessage}
          onClose={() => setShowSuccessModal(false)}
        />
      )}

            {/* Failure Modal */}
            {showFailureModal && (
        <FailureModal
          message={failureMessage}
          onClose={() => setShowFailureModal(false)}
        />
      )}
    </div>
  );
};

export default ManageLaporan;
