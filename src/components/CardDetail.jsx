import { useLocation, useParams } from "react-router-dom";
import { useState } from "react";

export default function CardDetail({ darkMode }) {
  const { id } = useParams();
  const location = useLocation();
  const card = location.state;

  const [isZoomed, setIsZoomed] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState("center");

  if (!card)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-red-500 font-semibold">Card not found</p>
      </div>
    );

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setBackgroundPosition(`${x}% ${y}%`);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 px-4 py-12 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
        
        {/* Image Section */}
        <div
          className="relative w-full lg:w-[500px] h-[350px] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden cursor-zoom-in"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-full object-cover transition-transform duration-500 transform hover:scale-105"
          />

          {isZoomed && (
            <div
              className="absolute inset-0 hidden lg:block rounded-2xl bg-no-repeat bg-cover shadow-2xl border border-gray-300 dark:border-gray-700"
              style={{
                backgroundImage: `url(${card.image})`,
                backgroundPosition,
                backgroundSize: "200%",
                transition: "background-position 0.1s",
              }}
            />
          )}
        </div>

        {/* Details Section */}
        <div className="flex-1 flex flex-col justify-start gap-6">
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">
            {card.title}
          </h1>

          <div className="flex flex-col gap-2 text-lg font-medium">
            <p>
              <span className="font-bold">ფასი:</span> {card.price}
            </p>
            <p>
              <span className="font-bold">სტეკი:</span> {card.stack}
            </p>
            <p>
              <span className="font-bold">ავტორი:</span> {card.author}
            </p>
          </div>

          <p className="mt-4 text-base leading-relaxed text-gray-700 dark:text-gray-300">
            {card.description}
          </p>
        </div>
      </div>
    </div>
  );
}
