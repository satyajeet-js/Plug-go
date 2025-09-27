import React, { useState } from "react";

const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "1. How do I search for charging stations on your website?",
      answer:
       "The website uses GPS-based location detection to automatically find your current location and display nearby charging stations on an interactive map. You can also manually enter a specific address, city, or destination to search for stations in that area. The search function includes route planning capabilities, allowing you to find stations along your planned journey."
    },

    {
question:"2. Does your website work on mobile devices and offer an app ?",
answer:"Yes, modern EV charging locator websites are designed with responsive interfaces that work seamlessly on smartphones, tablets, and desktop computers. Many also offer dedicated mobile apps with features like push notifications for charging completion, offline map access, and integration with vehicle charging management systems."
    },
    {
      question:"3. Does your website show real-time availability of charging stations ?",
      answer:" Yes, the website displays real-time availability status showing which charging ports are currently occupied, available, or out of service. This feature prevents users from arriving at occupied stations and includes live updates on charger operational status. Some websites also provide predictive availability based on usage patterns."
    },
    {
      question:"4. What information does your website provide about each charging station ?",
      answer:"Each charging station listing includes comprehensive details such as Station specifications: Connector types, charging speeds, and power levels.Operational information: Hours of operation, accessibility, and current status.Location details:Exact address, nearby amenities (restaurants, shopping), and parking availability.Pricing structure: Cost per kWh, session fees, and payment methods accepted. User feedback: Ratings, reviews, and photos from previous users.Navigation support:Turn-by-turn directions and traffic information"
    },

  ];

  return (
    <section className="max-w-4xl mt-25 mb-10 mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        FAQ - EV Charging Stations
      </h2>

      <div>
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-200 mb-2 rounded-lg">
            <button
              onClick={() => toggleAccordion(index)}
              className="flex items-center justify-between w-full p-4 font-medium text-left text-gray-800 hover:bg-gray-100"
            >
              {faq.question}
              <svg
                className={`w-4 h-4 shrink-0 transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {openIndex === index && (
              <div className="p-4 border-t border-gray-200">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FaqAccordion;
