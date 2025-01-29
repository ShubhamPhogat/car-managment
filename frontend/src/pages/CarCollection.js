import React, { useEffect, useState } from "react";
import { HomeBg2 } from "../ui";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { Trash2, Edit } from "lucide-react";

const CarCollection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const { userdata } = location?.state;
  const navigate = useNavigate();

  // Initial data fetch
  useEffect(() => {
    if (!userdata) {
      navigate("/login");
      return;
    }
    fetchCars();
  }, []);

  // Debounced search effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm) {
        searchCars(searchTerm);
      } else {
        fetchCars();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const vaigateToDetails = async (carId) => {
    navigate("/carDetails", { state: { carId: carId } });
  };

  const fetchCars = async () => {
    try {
      setIsLoading(true);
      console.log(userdata);
      const userId = userdata.data.validateUser._id;
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_BACKEND_URL}/api/v1/info/carList/${userId}`
      );
      console.log(response.data);
      setCars(response.data.data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchCars = async (query) => {
    try {
      setIsLoading(true);
      const userId = userdata.data.validateUser._id;
      // Assuming your backend has a search endpoint that accepts a query parameter
      const data = { userId, query };
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_BACKEND_URL}/api/v1/info/searchCar`,
        data
      );
      console.log("searched query", response.data.data);
      setCars(response.data.data);
    } catch (error) {
      console.error("Error searching cars:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (carId) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BASE_BACKEND_URL}/api/v1/car/delete/${carId}`
        );
        setCars((prevCars) => prevCars.filter((car) => car._id !== carId));
        alert("Car deleted successfully");
      } catch (error) {
        console.error("Error deleting car:", error);
        alert("Failed to delete car");
      }
    }
  };

  const handleEdit = async (car) => {
    navigate("/editCar", { state: { carData: car, userdata } });
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <img
          src={HomeBg2}
          alt="Background"
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Header */}
        <h1 className="text-4xl text-white mb-8 font-['Montserrat'] font-bold">
          Your Car Collection
        </h1>

        {/* Search Bar */}
        <div className="relative max-w-2xl mb-12">
          <input
            type="text"
            placeholder="Search your cars..."
            className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/20 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <svg
              className="w-6 h-6 text-white/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Car List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-white text-xl">Loading...</div>
          ) : cars.length === 0 ? (
            <div className="text-white text-xl">
              {searchTerm
                ? "No cars found matching your search"
                : "No cars in your collection"}
            </div>
          ) : (
            cars.map((car) => (
              <div
                key={car._id}
                className="relative group transform transition-all duration-300 hover:scale-105"
              >
                <div className="bg-white/5 backdrop-blur-md rounded-lg overflow-hidden border border-white/10 hover:bg-white/10 transition-colors">
                  {/* Content */}
                  <div className="p-6 flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-48 h-48 md:h-32 overflow-hidden rounded-lg flex-shrink-0">
                      <img
                        src={car.images[0]}
                        alt={car.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Car Details */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div onClick={() => vaigateToDetails(car._id)}>
                          <h2 className="text-2xl font-bold text-white mb-2">
                            {car.name}
                          </h2>
                          <div className="flex flex-wrap gap-4 mb-2">
                            <span className="text-gray-300">
                              Model: {car.model}
                            </span>
                            <span className="text-gray-300">
                              Year: {car.manufactureYear}
                            </span>
                            <span className="text-gray-300">
                              Price: ${car.price}
                            </span>
                          </div>
                          <p className="text-gray-300">{car.description}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleEdit(car)}
                            className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <Edit size={20} />
                          </button>
                          <button
                            onClick={() => handleDelete(car._id)}
                            className="p-2 text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CarCollection;
