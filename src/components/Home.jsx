import { useNavigate } from "react-router-dom";
import data from "./data";
import { Globe, Database, Smartphone, CheckCircle } from "lucide-react";

export default function Home({ darkMode }) {
  const navigate = useNavigate();

  const services = [
    {
      icon: <Globe className="w-10 h-10 text-blue-600" />,
      title: "Web Development",
      description:
        "თანამედროვე, რესპონსიული ვებსაიტები და ვებ აპლიკაციები, რომლებიც შექმნილია უახლესი ტექნოლოგიებით.",
      technologies: ["React", "Next.js", "Vue.js", "Node.js"],
    },
    {
      icon: <Database className="w-10 h-10 text-blue-600" />,
      title: "Backend Development",
      description:
        "მასშტაბირებადი სერვერული გადაწყვეტილებები და API-ები, რომლებიც თქვენს აპლიკაციებს აძლიერებს.",
      technologies: ["Python", "Java", "C#", "PostgreSQL"],
    },
    {
      icon: <Smartphone className="w-10 h-10 text-blue-600 " />,
      title: "Mobile Development",
      description:
        "Native and cross-platform mobile apps that deliver exceptional user experiences.",
      technologies: ["React Native", "Flutter", "iOS", "Android"],
    },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      }`}
    >
      <p
        className={`text-[40px] sm:text-[50px] md:text-[30px] font-bold text-center px-2 transition-colors duration-300 ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        ჩვენი სერვისები
      </p>

      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 p-8">
        {services.map((service, index) => (
          <div
            key={index}
            className={`w-full p-6 rounded-2xl shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
          >
            <div className="mb-4">{service.icon}</div>
            <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {service.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {service.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    darkMode
                      ? "bg-blue-900 text-blue-200"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-16">
        <p
          className={`text-[40px] sm:text-[50px] md:text-[30px] font-bold text-center px-2 transition-colors duration-300 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          აწყობილი პროექტები
        </p>
      </div>

      <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-10 p-8">
        {data.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/card/${item.id}`, { state: item })}
            className={`cursor-pointer w-full shadow-md rounded-2xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl min-w-[320px] ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              {item.steak && (
                <p
                  className={`mt-2 text-[20px] ${
                    darkMode ? "text-gray-300" : "text-black-700"
                  }`}
                >
                  {item.steak}
                </p>
              )}
              <p
                className={`mt-2 font-semibold ${
                  darkMode ? "text-yellow-400" : "text-green-600"
                }`}
              >
                ფასი: {item.price}
              </p>
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p className="text-base mt-3">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <section
        id="about"
        className={`py-20 transition-colors duration-300 ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className={`text-4xl font-bold mb-6 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                რატომ KODERS4HIRE?
              </h2>
              <p
                className={`text-lg mb-8 leading-relaxed ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                ჩვენ უბრალოდ დეველოპერები არ ვართ – ჩვენ ვართ თქვენი ტექნოლოგიური
                პარტნიორები. გამოცდილებით და ინოვაციის várekით, ვქმნით
                გადაწყვეტილებებს, რომლებიც რეალურ ბიზნეს შედეგებს მოაქვს.
              </p>

              <div className="space-y-4">
                {[
                  "ექსპერტი დეველოპერები გამოცდილებით",
                  "Agile დეველოპმენტის მეთოდოლოგია",
                  "24/7 მხარდაჭერა და მომსახურება",
                  "მასშტაბირებადი და უსაფრთხო გადაწყვეტილებები",
                  "დროულად მიწოდების გარანტია",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                    <span
                      className={`font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div
                className={`p-6 rounded-xl shadow-lg text-center ${
                  darkMode
                    ? "bg-gray-800 text-gray-300"
                    : "bg-white text-gray-600"
                }`}
              >
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  100+
                </div>
                <div>დასრულებული პროექტი</div>
              </div>
              <div
                className={`p-6 rounded-xl shadow-lg text-center ${
                  darkMode
                    ? "bg-gray-800 text-gray-300"
                    : "bg-white text-gray-600"
                }`}
              >
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  50+
                </div>
                <div>კმაყოფილი კლიენტი</div>
              </div>
              <div
                className={`p-6 rounded-xl shadow-lg text-center ${
                  darkMode
                    ? "bg-gray-800 text-gray-300"
                    : "bg-white text-gray-600"
                }`}
              >
                <div className="text-3xl font-bold text-blue-600 mb-2">5+</div>
                <div>წლის გამოცდილება</div>
              </div>
              <div
                className={`p-6 rounded-xl shadow-lg text-center ${
                  darkMode
                    ? "bg-gray-800 text-gray-300"
                    : "bg-white text-gray-600"
                }`}
              >
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  24/7
                </div>
                <div>მხარდაჭერა</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
