import Nav from "../components/Nav";
import Footer from "../components/Footer";

const Franchise = () => {
  return (
    <>
      <Nav />
      <div className="px-8 py-16 bg-gray-50 dark:bg-black-2">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mt-30 text-gray-800 dark:text-gray-200">
            Hen and Heaven Franchise
          </h1>
          <p className="text-lg mt-4 text-gray-600 dark:text-gray-400">
            Join our family by becoming a franchise owner of Hen and Heaven.
            Invest in a booming poultry business with a franchise fee of
            ₹6,00,000.
          </p>
        </div>

        {/* Pricing and Quotas */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Pricing Table */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Franchise Pricing
            </h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b-2 p-4 text-gray-600 dark:text-gray-400">
                    Item
                  </th>
                  <th className="border-b-2 p-4 text-gray-600 dark:text-gray-400">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b p-4 text-gray-700 dark:text-gray-300">
                    Franchise Fee
                  </td>
                  <td className="border-b p-4 text-gray-700 dark:text-gray-300">
                    ₹4,00,000
                  </td>
                </tr>
                <tr>
                  <td className="border-b p-4 text-gray-700 dark:text-gray-300">
                    Setup & Equipment
                  </td>
                  <td className="border-b p-4 text-gray-700 dark:text-gray-300">
                    ₹1,50,000
                  </td>
                </tr>
                <tr>
                  <td className="border-b p-4 text-gray-700 dark:text-gray-300">
                    Marketing & Training
                  </td>
                  <td className="border-b p-4 text-gray-700 dark:text-gray-300">
                    ₹50,000
                  </td>
                </tr>
                <tr>
                  <td className="border-b p-4 font-bold text-gray-800 dark:text-gray-200">
                    Total Investment
                  </td>
                  <td className="border-b p-4 font-bold text-gray-800 dark:text-gray-200">
                    ₹6,00,000
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Franchise Quotas */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Franchise Quotas & Terms
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
              <li className="mb-2">
                <span className="font-semibold">Minimum Monthly Sales:</span>{" "}
                ₹1,00,000
              </li>
              <li className="mb-2">
                <span className="font-semibold">Profit-Sharing:</span> 10% of
                sales will be returned to the franchisor.
              </li>
              <li className="mb-2">
                <span className="font-semibold">Territorial Rights:</span>{" "}
                Exclusive rights within a 10 km radius.
              </li>
              <li className="mb-2">
                <span className="font-semibold">Franchise Tenure:</span> 5 years
                with renewal options.
              </li>
              <li className="mb-2">
                <span className="font-semibold">Annual Franchise Fee:</span>{" "}
                ₹30,000 per year starting from the second year.
              </li>
            </ul>
          </div>
        </div>

        {/* Conditions Section */}
        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Franchise Conditions
          </h2>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
            <li className="mb-2">
              Franchisees must maintain quality and operational standards as
              outlined by Hen and Heaven.
            </li>
            <li className="mb-2">
              Initial training for all franchise staff is mandatory, and a
              periodic inspection will be conducted.
            </li>
            <li className="mb-2">
              Franchisees are responsible for the cost of utilities, rent, and
              employee wages.
            </li>
            <li className="mb-2">
              Hen and Heaven reserves the right to terminate the franchise
              agreement if terms are violated.
            </li>
            <li className="mb-2">
              A minimum store size of 1000 sq ft is required for the franchise
              location.
            </li>
          </ul>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Franchise;
