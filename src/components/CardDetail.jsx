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
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setBackgroundPosition(`${x}% ${y}%`);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      } p-8`}
    >
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start gap-16 mt-32">
        <div
          className="relative w-[500px] h-[350px] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden cursor-zoom-in"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-full object-cover"
          />
        </div>

        {isZoomed ? (
          <div
            className="hidden lg:block w-[500px] h-[350px] rounded-2xl shadow-2xl border border-gray-300 dark:border-gray-700 bg-no-repeat bg-cover transition-all duration-150"
            style={{
              backgroundImage: `url(${card.image})`,
              backgroundPosition,
              backgroundSize: "200%",
            }}
          ></div>
        ) : (
          <div className="lg:w-1/2 flex flex-col justify-center gap-6 transition-opacity duration-300">
            <h1 className="text-4xl font-extrabold">{card.title}</h1>

            <div className="space-y-3">
              <p className="text-lg font-medium">
                <span className="font-bold">ფასი:</span> {card.price}
              </p>
              <p className="text-lg font-medium">
                <span className="font-bold">სტეკი:</span> {card.stack}
              </p>
              <p className="text-lg font-medium">
                <span className="font-bold">ავტორი:</span> {card.author}
              </p>
            </div>

            <p className="mt-4 leading-relaxed">{card.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
