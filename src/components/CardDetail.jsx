import { useLocation, useParams } from "react-router-dom";

export default function CardDetail({ darkMode }) {
  const { id } = useParams();
  const location = useLocation();
  const card = location.state;

  if (!card)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-red-500 font-semibold">Card not found</p>
      </div>
    );

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"} p-8 transition-colors duration-300 `}>
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-[200px] mt-[200px]">
        
        <div className="lg:w-1/2 flex justify-center">
          <img
            src={card.image}
            alt={card.title}
            className="w-[500px] h-[350px] object-cover rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
          />
        </div>

        <div className="lg:w-1/2 flex flex-col justify-center gap-6">
          <h1 className="text-4xl font-extrabold">{card.title}</h1>

          <div className="space-y-3">
            <p className="text-lg font-medium">
              <span className="font-bold">ფასი:</span> {card.price}
            </p>
            <p className="text-lg font-medium">
              <span className="font-bold">სტეიკი:</span> {card.stack}
            </p>
            <p className="text-lg font-medium">
              <span className="font-bold">ავტორი:</span> {card.author}
            </p>
          </div>

          <p className="mt-4 leading-relaxed">{card.description}</p>
        </div>
      </div>
    </div>
  );
}
