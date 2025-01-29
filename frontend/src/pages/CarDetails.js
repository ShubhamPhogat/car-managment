import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { carDetailsBg1 } from "../ui";
import axios from "axios";

const CarDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { carId } = location?.state;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setloading] = useState(true);

  const [car, setCar] = useState(null);
  const fetchCar = async () => {
    console.log(carId);
    const res = await axios.get(
      `${process.env.REACT_APP_BASE_BACKEND_URL}/api/v1/info/car/${carId}`
    );
    console.log(res.data.data.images);
    setCar(res.data.data);
    setloading(false);
  };

  useEffect(() => {
    if (!carId) {
      navigate("/main");
    }
    fetchCar();
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === car.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? car.images.length - 1 : prev - 1
    );
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <img
          src={carDetailsBg1}
          alt="Background"
          className="w-full h-full object-cover opacity-70"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-white mb-8 hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="mr-2" />
          Back to Collection
        </button>

        {loading ? (
          <>
            <p>loading....</p>
          </>
        ) : (
          <>
            <div className="bg-black/40 backdrop-blur-md rounded-xl overflow-hidden border border-white/10">
              {/* Image Carousel */}
              <div className="relative h-[300px] md:h-[400px] lg:h-[500px]">
                {car.images && car.images.length > 0 ? (
                  <>
                    {console.log("inhtml", car.images[0])}
                    <img
                      src={car.images[currentImageIndex]}
                      alt={`${car.name} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Carousel Controls */}
                    <div className="absolute inset-0 flex items-center justify-between p-4">
                      <button
                        onClick={prevImage}
                        className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </div>

                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {car.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToImage(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex
                              ? "bg-white"
                              : "bg-white/50 hover:bg-white/75"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/70">
                    No images available
                  </div>
                )}
              </div>

              {/* Car Information */}
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                      {car._doc.name}
                    </h1>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-white/10 py-2">
                        <span className="text-gray-400">Model</span>
                        <span className="text-white">{car._doc.model}</span>
                      </div>

                      <div className="flex items-center justify-between border-b border-white/10 py-2">
                        <span className="text-gray-400">Year</span>
                        <span className="text-white">
                          {car._doc.yearOfManufacture}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-b border-white/10 py-2">
                        <span className="text-gray-400">Price</span>
                        <span className="text-white font-bold">
                          ${car._doc.price?.toLocaleString()}
                        </span>
                      </div>

                      {car._doc.tags &&
                        Object.entries(car._doc.tags).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between border-b border-white/10 py-2"
                          >
                            <span className="text-gray-400 capitalize">
                              {key}
                            </span>
                            <span className="text-white">{value}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-4">
                      Description
                    </h2>
                    <p className="text-gray-300 leading-relaxed">
                      {car._doc.description || "No description available"}
                    </p>
                  </div>
                </div>

                {/* Additional Features or Specifications could be added here */}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CarDetails;
