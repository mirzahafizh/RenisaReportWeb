import axios from "axios";
import React, { useEffect, useState } from "react";

const EditModal = ({ isOpen, onClose, lap, onUpdate }) => {
  const [formData, setFormData] = useState({
    vendor: '',
    date: '',
    delivered_by: '',
    no_resi: '',
  });

  const [items, setItems] = useState([{ nama_barang: '', part_number: '', qty: '' }]);
  const [fileUpload, setFileUpload] = useState([]);

  useEffect(() => {
    if (lap) {
      setFormData({
        vendor: lap.vendor,
        date: lap.date,
        delivered_by: lap.delivered_by,
        no_resi: lap.no_resi,
      });

      const nama_barangArray = JSON.parse(lap.nama_barang);
      const part_numberArray = JSON.parse(lap.part_number);
      const qtyArray = JSON.parse(lap.qty);

      const itemsArray = nama_barangArray.map((item, index) => ({
        nama_barang: item,
        part_number: part_numberArray[index] || '',
        qty: qtyArray[index] || '',
      }));

      setItems(itemsArray);

      const fileUploadArray = JSON.parse(lap.fileUpload);
      setFileUpload(fileUploadArray);
    }
  }, [lap]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleItemChange = (index, e) => {
    const updatedItems = [...items];
    updatedItems[index][e.target.name] = e.target.value;
    setItems(updatedItems);
  };

  const handleFileChange = async (e) => {
    const selectedFiles = e.target.files;
    const uploadedFiles = [];

    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append('files', file);

      try {
        const response = await axios.post(`https://backend-laporan.vercel.app/api/laporan/${lap.id}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.fileUrl) {
          uploadedFiles.push(response.data.fileUrl);
        }
      } catch (error) {
        console.error("Error uploading file:", error.response?.data || error.message);
        alert("An error occurred while uploading the file. Please check the console for more details.");
      }
    }

    setFileUpload([...fileUpload, ...uploadedFiles]);
  };

  const addItemRow = () => {
    setItems([...items, { nama_barang: '', part_number: '', qty: '' }]);
  };

  const removeItemRow = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const removeFile = async (index) => {
    const fileToDelete = fileUpload[index];
    try {
      const response = await axios.delete(`https://backend-laporan.vercel.app/api/laporan/${lap.id}/delete`, {
        data: { deleteFiles: [fileToDelete] },
      });

      if (response.data.message === 'Files deleted successfully!') {
        const updatedFiles = fileUpload.filter((_, i) => i !== index);
        setFileUpload(updatedFiles);
      } else {
        alert("Failed to delete the file: " + response.data.message);
      }
    } catch (error) {
      console.error("Error deleting file:", error.response?.data || error.message);
      alert("An error occurred while deleting the file. Please check the console for more details.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const selectedFiles = document.querySelector('input[type="file"]').files;
      const uploadedFiles = [];

      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('files', file);

        try {
          const response = await axios.post(`https://backend-laporan.vercel.app/api/laporan/${lap.id}/upload`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          if (response.data.fileUrl) {
            uploadedFiles.push(response.data.fileUrl);
          }
        } catch (error) {
          console.error("Error uploading file:", error.response?.data || error.message);
          alert("An error occurred while uploading a file. Please check the console for more details.");
          return; // Exit if any file fails to upload
        }
      }

      setFileUpload([...fileUpload, ...uploadedFiles]);

      const formDataToSubmit = new FormData();
      formDataToSubmit.append('vendor', formData.vendor);
      formDataToSubmit.append('date', formData.date);
      formDataToSubmit.append('delivered_by', formData.delivered_by);
      formDataToSubmit.append('no_resi', formData.no_resi);
      formDataToSubmit.append('username', localStorage.getItem('username'));

      items.forEach(item => {
        formDataToSubmit.append('nama_barang[]', item.nama_barang);
        formDataToSubmit.append('part_number[]', item.part_number);
        formDataToSubmit.append('qty[]', item.qty);
      });

      console.log("Payload before submission:", Array.from(formDataToSubmit.entries()));

      const response = await axios.put(`https://backend-laporan.vercel.app/api/laporan/${lap.id}`, formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Update response:", response.data);

      if (response.data.message === "Laporan updated successfully!") {
        onUpdate(lap.id, { ...formData });
        alert("Laporan updated successfully!");
        window.location.reload();
      } else {
        alert("Update failed: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating laporan:", error.response?.data || error.message);
      alert("An error occurred while updating the laporan. Please check the console for more details.");
    }
  };
  

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2 max-h-[90vh] overflow-y-auto"> {/* Adjusted here */}
          <h2 className="text-2xl font-bold mb-4">Edit Laporan</h2>
          <form onSubmit={handleSubmit}>
            {/* Vendor, Date, Delivered By, No Resi */}
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

            {/* Multiple Nama Barang, Part Number, Qty */}
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
                  <div className="w-1/3">
                    <label className="block mb-2">Qty</label>
                    <input
                      type="number"
                      name="qty"
                      value={item.qty}
                      onChange={(e) => handleItemChange(index, e)}
                      className="border p-2 w-full"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItemRow(index)}
                    className="self-center text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addItemRow}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Add Item
              </button>
            </div>

            {/* File Upload Section */}
{/* File Upload Section */}
<div className="mb-4">
  <label className="block mb-2">Upload Files</label>
  <input
    type="file"
    multiple
    onChange={handleFileChange}
    className="border p-2 w-full"
  />
  <div className="mt-2">
    {fileUpload.map((file, index) => (
      <div key={index} className="flex justify-between items-center">
        <a href={file} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          {file.split('/').pop()} {/* Show only the file name */}
        </a>
        <button
          type="button"
          onClick={() => removeFile(index)}
          className="text-red-500 hover:text-red-700"
        >
          Remove
        </button>
      </div>
    ))}
  </div>
</div>


            <div className="flex justify-between">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 text-gray-700 p-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default EditModal;
