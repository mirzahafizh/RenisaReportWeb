import axios from "axios";
import React, { useEffect, useState } from "react";
import SuccessModal from "../components/SuccessModal"; // Import the SuccessModal component

const AddLaporan = () => {
  const [formData, setFormData] = useState({
    vendor: "",
    date: "",
    delivered_by: "",
    no_resi: "",
    username: "",
  });

  const [items, setItems] = useState([
    { nama_barang: "", part_number: "", qty: "" },
  ]);
  const [fileUpload, setFileUpload] = useState([]);
  const [message, setMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State for modal visibility
  const [showFailureModal, setShowFailureModal] = useState(false); // State for failure modal visibility

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setFormData((prevData) => ({
        ...prevData,
        username: storedUsername,
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleItemChange = (index, e) => {
    const updatedItems = [...items];
    updatedItems[index][e.target.name] = e.target.value;
    setItems(updatedItems);
  };

  const handleFileChange = (e) => {
    setFileUpload(e.target.files);
  };

  const addItemRow = () => {
    setItems([...items, { nama_barang: "", part_number: "", qty: "" }]);
  };

  const removeItemRow = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      items.forEach((item) => {
        data.append("nama_barang[]", item.nama_barang);
        data.append("part_number[]", item.part_number);
        data.append("qty[]", item.qty);
      });
      for (let i = 0; i < fileUpload.length; i++) {
        data.append("files", fileUpload[i]);
      }

      const response = await axios.post(
        "https://backend-laporan.vercel.app/api/laporan",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("Laporan created successfully!");
      setShowSuccessModal(true); // Show success modal on successful submission
      setFormData({
        vendor: "",
        date: "",
        delivered_by: "",
        no_resi: "",
        username: localStorage.getItem("username") || "",
      });
      setItems([{ nama_barang: "", part_number: "", qty: "" }]);
      setFileUpload([]);
    } catch (error) {
      setMessage(
        "Error creating laporan: " + error.response?.data?.message ||
          error.message
      );
      setShowFailureModal(true); // Show failure modal on error
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Add Report</h2>

      {message && <div className="alert">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Vendor</label>
          <input
            type="text"
            name="vendor"
            value={formData.vendor}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Delivered By</label>
          <input
            type="text"
            name="delivered_by"
            value={formData.delivered_by}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">No Resi</label>
          <input
            type="text"
            name="no_resi"
            value={formData.no_resi}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">Items</h3>
          {items.map((item, index) => (
            <div key={index} className="mb-4 flex space-x-4">
              <div className="w-1/3">
                <label className="block mb-2">Nama Barang</label>
                <input
                  type="text"
                  name="nama_barang"
                  value={item.nama_barang}
                  onChange={(e) => handleItemChange(index, e)}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div className="w-1/3">
                <label className="block mb-2">Part Number</label>
                <input
                  type="text"
                  name="part_number"
                  value={item.part_number}
                  onChange={(e) => handleItemChange(index, e)}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div className="w-1/4">
                <label className="block mb-2">Quantity</label>
                <input
                  type="number"
                  name="qty"
                  value={item.qty}
                  onChange={(e) => handleItemChange(index, e)}
                  className="border p-2 w-full"
                  required
                />
              </div>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeItemRow(index)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addItemRow}
            className="bg-green-500 text-white p-2 rounded"
          >
            Add Item
          </button>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Upload Files</label>
          <input
            type="file"
            name="files"
            multiple
            onChange={handleFileChange}
            className="border p-2 w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-purple-600 text-white p-2 rounded hover:bg-purple-700 transition"
        >
          Submit Laporan
        </button>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          message={message}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
      {showFailureModal && (
        <FailureModal
          message={message}
          onClose={() => setShowFailureModal(false)}
        />
      )}
    </div>
  );
};

export default AddLaporan;
