import axios from "axios";
import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addCarBg } from "../ui";

const EditCar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { carData } = location?.state;

  const [formData, setFormData] = useState({
    name: carData.name || "",
    model: carData.model || "",
    manufactureYear: carData.manufactureYear || "",
    price: carData.price || "",
    description: carData.description || "",
    images: [],
    tags: {},
    ownerId: carData.ownerId || "",
  });

  const carCompanies = [
    "Toyota",
    "Honda",
    "Ford",
    "BMW",
    "Mercedes-Benz",
    "Audi",
    "Volkswagen",
    "Hyundai",
    "Kia",
    "Nissan",
  ];

  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["company", "color", "dealerName"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        tags: {
          ...prev.tags,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + previews.length > 10) {
      alert("Maximum 10 images allowed");
      return;
    }

    const newPreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    setPreviews((prev) => [...prev, ...newPreviews]);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const removeImage = (index) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    data.append("name", formData.name);
    data.append("model", formData.model);
    data.append("manufactureYear", formData.manufactureYear);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("ownerId", formData.ownerId);
    data.append("carId", carData._id);
    data.append("tags", JSON.stringify(formData.tags));

    formData.images.forEach((image) => {
      data.append("image", image);
    });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_BACKEND_URL}/api/v1/car/edit`,
        data
      );
      alert("Car edited to your collection successfully");
      setFormData({
        name: "",
        model: "",
        manufactureYear: "",
        price: "",
        description: "",
        images: [],
        tags: {},
      });
      setPreviews([]);
      navigate(-1);
    } catch (error) {
      alert(
        "Error adding car: " +
          (error.response?.data?.message || "Unknown error")
      );
      console.error("Error details:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <div className="fixed inset-0 z-0">
        <img
          src={addCarBg}
          alt="Background"
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <div className="backdrop-blur-sm bg-black/40 p-8 rounded-lg clip-corner">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Edit Car
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                name="name"
                placeholder="Car Name"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/70"
                onChange={handleChange}
                value={formData.name}
                required
              />

              <select
                name="company"
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                required
              >
                <option value="">Select Company</option>
                {carCompanies.map((company) => (
                  <option key={company} value={company} className="text-black">
                    {company}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="model"
                placeholder="Model"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/70"
                onChange={handleChange}
                value={formData.model}
                required
              />

              <textarea
                name="description"
                placeholder="Car Description"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/70"
                onChange={handleChange}
                value={formData.description}
                required
                rows="4"
              />

              <input
                type="number"
                name="manufactureYear"
                placeholder="Manufacture Year"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/70"
                onChange={handleChange}
                value={formData.manufactureYear}
                required
              />

              <input
                type="text"
                name="color"
                placeholder="Car Color"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/70"
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="dealerName"
                placeholder="Dealer Name"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/70"
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="price"
                placeholder="Price"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/70"
                onChange={handleChange}
                value={formData.price}
                required
              />

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 px-4 border-2 border-dashed border-white/30 rounded-lg text-white hover:border-purple-500 transition-colors"
                >
                  Add Images (Maximum 10)
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview.url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Edit Car
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCar;
