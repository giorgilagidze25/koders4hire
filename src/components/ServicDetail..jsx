import { useLocation, useParams } from "react-router-dom";

export default function ServiceDetail({ darkMode }) {
  const { id } = useParams();
  const location = useLocation();
  const service = location.state;

  if (!service)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-500 font-semibold">Service not found</p>
      </div>
    );

  const isOffering = service.type === "offering";

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      } p-10 transition-colors duration-300`}
    >
      <div className="max-w-5xl mx-auto mt-20 flex flex-col lg:flex-row gap-10">
        <div className="lg:w-1/2 flex flex-col gap-4">
          <h1 className="text-4xl font-extrabold">{service.title}</h1>
          <p className="text-lg">{service.description}</p>

          {isOffering && (
            <p
              className={`text-2xl font-semibold ${
                darkMode ? "text-yellow-400" : "text-green-600"
              }`}
            >
              ფასი: {service.price}{" "}
              {service.currency === "USD"
                ? "$"
                : service.currency === "EUR"
                ? "€"
                : service.currency}
            </p>
          )}

          <p className="text-lg">
            კატეგორია: <span className="font-semibold">{service.category}</span>
          </p>

          {service.owner && (
            <div className="flex items-center gap-3 mt-2">
              <img
                src={service.owner.profile_image}
                alt={service.owner.real_name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{service.owner.real_name}</p>
                <p className="text-sm text-gray-500">@{service.owner.username}</p>
              </div>
            </div>
          )}

          {service.tags && service.tags.length > 0 && (
            <div className="mt-4">
              <span className="font-semibold">Tags: </span>
              {service.tags.join(", ")}
            </div>
          )}

          {service.createdAt && (
            <p className="mt-2 text-sm text-gray-400">
              შექმნილია: {new Date(service.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
