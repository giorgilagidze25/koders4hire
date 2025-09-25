import { useLocation, useParams } from "react-router-dom";

export default function CardDetail() {
  const { id } = useParams();
  const location = useLocation();
  const card = location.state;

  if (!card)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-500 font-semibold">Card not found</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2">
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-full object-cover rounded-2xl shadow-lg"
          />
        </div>
        <div className="lg:w-1/2 flex flex-col justify-center gap-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{card.title}</h1>
          <h1 className="text-[20px] font-bold text-gray-900 dark:text-white">{card.price}</h1>
          <h1 className="text-[20px] font-bold text-gray-900 dark:text-white">{card.steak}</h1>

         

          <p className="mt-4 text-gray-700 dark:text-gray-300">{card.description}</p>
        </div>

      </div>
    </div>
  );
}
