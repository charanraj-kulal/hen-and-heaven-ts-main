import Nav from "../components/Nav";
import Footer from "../components/Footer";

const Sales = () => {
  return (
    <>
      <Nav />
      <div className="px-8 py-16 bg-gray-50 dark:bg-black-2">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mt-30 text-gray-800 dark:text-gray-200">
            Hen and Heaven Sales
          </h1>
          <p className="text-lg mt-4 text-gray-600 dark:text-gray-400">
            Discover what we offer at Hen and Heaven. From high-quality poultry
            to fresh eggs, our products meet the highest standards in the
            industry.
          </p>
        </div>

        {/* Sales Information */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* What We Sell */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              What We Sell
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
              <li className="mb-2">
                <span className="font-semibold">Fresh Poultry:</span> We provide
                premium-quality, antibiotic-free poultry that is raised in a
                healthy environment.
              </li>
              <li className="mb-2">
                <span className="font-semibold">Farm Fresh Eggs:</span> Our hens
                produce nutrient-rich eggs that are carefully collected and
                inspected for quality.
              </li>
              <li className="mb-2">
                <span className="font-semibold">Organic Feeds:</span> We sell
                organic poultry feed that enhances the growth and health of
                hens.
              </li>
              <li className="mb-2">
                <span className="font-semibold">Poultry Equipment:</span> We
                supply equipment needed for poultry maintenance and care.
              </li>
            </ul>
          </div>

          {/* Maintenance and Support */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Maintenance and Support
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
              <li className="mb-2">
                <span className="font-semibold">Regular Inspections:</span> We
                provide regular farm inspections to ensure health standards are
                maintained.
              </li>
              <li className="mb-2">
                <span className="font-semibold">Health Support:</span> Our
                experts offer health support for your hens, ensuring high
                productivity and quality.
              </li>
              <li className="mb-2">
                <span className="font-semibold">Equipment Maintenance:</span> We
                offer maintenance and servicing of poultry equipment to
                franchisees.
              </li>
              <li className="mb-2">
                <span className="font-semibold">Training Programs:</span> We
                conduct training on how to handle and maintain the hens for
                optimal productivity.
              </li>
            </ul>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Terms and Conditions
          </h2>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
            <li className="mb-2">
              Sales of poultry and eggs are subject to availability and quality
              checks at all times.
            </li>
            <li className="mb-2">
              Hen and Heaven reserves the right to adjust prices based on market
              conditions and supply chain factors.
            </li>
            <li className="mb-2">
              All franchisees must adhere to health and safety standards when
              selling products.
            </li>
            <li className="mb-2">
              Returns or refunds are processed only under specific circumstances
              as outlined in our policy.
            </li>
            <li className="mb-2">
              Franchisees are expected to maintain clean, hygienic storage
              facilities for all products.
            </li>
          </ul>
        </div>

        {/* Outlets Information */}
        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Our Outlets
          </h2>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
            <li className="mb-2">
              <span className="font-semibold">Bangalore Outlet:</span> Located
              in the heart of Bangalore, offering fresh poultry and eggs.
            </li>
            <li className="mb-2">
              <span className="font-semibold">Mangalore Outlet:</span> Our
              Mangalore outlet serves local customers with a wide variety of
              poultry products.
            </li>
            <li className="mb-2">
              <span className="font-semibold">Mysore Outlet:</span> Known for
              its premium quality eggs and organic poultry feed.
            </li>
            <li className="mb-2">
              <span className="font-semibold">Chennai Outlet:</span> Recently
              opened, catering to the growing demand for healthy poultry in
              Chennai.
            </li>
          </ul>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Sales;
