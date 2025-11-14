import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { CheckCircle } from "lucide-react";
import data from "./data";
import { useCart } from "../context/CartContext"; 
import { useNavigate } from "react-router-dom";
import Servis from "./Servis";

export default function Home({ darkMode }) {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const token = Cookies.get("token");
  


  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUser(payload.user || payload);
      } catch (err) {
        console.error("Token parse error:", err);
      }
    }
  }, [token]);

  

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"}`}>
     

    <Servis/>



      <div className="flex justify-center mt-16">
        <p
          className={`text-[40px] sm:text-[50px] md:text-[30px] mt-[100px] font-bold text-center px-2 transition-colors duration-300 ${
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
            onClick={() => navigate(`/project/${item.id}`, { state: item })}
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
              {item.stack && (
                <p
                  className={`mt-2 text-[20px] ${
                    darkMode ? "text-gray-300" : "text-black-700"
                  }`}
                >
                  {item.stack}
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
                ჩვენ უბრალოდ დეველოპერები არ ვართ – ჩვენ ვართ თქვენი
                ტექნოლოგიური პარტნიორები. გამოცდილებით და ინოვაციით ვქმნით
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
              {[
                { value: "100+", label: "დასრულებული პროექტი" },
                { value: "50+", label: "კმაყოფილი კლიენტი" },
                { value: "5+", label: "წლის გამოცდილება" },
                { value: "24/7", label: "მხარდაჭერა" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`p-6 rounded-xl shadow-lg text-center ${
                    darkMode
                      ? "bg-gray-800 text-gray-300"
                      : "bg-white text-gray-600"
                  }`}
                >
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {stat.value}
                  </div>
                  <div>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
