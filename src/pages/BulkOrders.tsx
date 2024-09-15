import Nav from "../components/Nav";
import Footer from "../components/Footer";

const BulkOrders = () => {
  return (
    <>
      <Nav />
      <div className="px-8 py-16 bg-gray-50 dark:bg-black-2">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mt-30 text-gray-800 dark:text-gray-200">
            Hen and Heaven Bulk Orders
          </h1>
          <p className="text-lg mt-4 text-gray-600 dark:text-gray-400">
            We offer convenient bulk ordering options for poultry and related
            products, ensuring quality and timely delivery for your business
            needs.
          </p>
        </div>

        {/* Bulk Order Information */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Bulk Order Pricing */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Bulk Order Pricing
            </h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b-2 p-4 text-gray-600 dark:text-gray-400">
                    Product
                  </th>
                  <th className="border-b-2 p-4 text-gray-600 dark:text-gray-400">
                    Price per Unit
                  </th>
                  <th className="border-b-2 p-4 text-gray-600 dark:text-gray-400">
                    Bulk Discount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b p-4">Poultry (per kg)</td>
                  <td className="border-b p-4">₹250</td>
                  <td className="border-b p-4">5% off for 100+ kg</td>
                </tr>
                <tr>
                  <td className="border-b p-4">Eggs (per 100)</td>
                  <td className="border-b p-4">₹800</td>
                  <td className="border-b p-4">10% off for 1000+ eggs</td>
                </tr>
                <tr>
                  <td className="border-b p-4">Poultry Feed (per bag)</td>
                  <td className="border-b p-4">₹1,200</td>
                  <td className="border-b p-4">8% off for 50+ bags</td>
                </tr>
                <tr>
                  <td className="border-b p-4">Organic Feeds (per bag)</td>
                  <td className="border-b p-4">₹1,800</td>
                  <td className="border-b p-4">12% off for 30+ bags</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bulk Order Details */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Bulk Order Details
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
              <li className="mb-2">
                <span className="font-semibold">Minimum Order Quantity:</span>{" "}
                50 kg for poultry, 500 eggs, or 10 bags of feed.
              </li>
              <li className="mb-2">
                <span className="font-semibold">Lead Time:</span> Orders
                typically require 3-5 business days for processing and delivery.
              </li>
              <li className="mb-2">
                <span className="font-semibold">Custom Orders:</span> We provide
                custom orders based on your specific business needs. Contact us
                for large-scale bulk requirements.
              </li>
              <li className="mb-2">
                <span className="font-semibold">Quality Assurance:</span> All
                bulk orders undergo strict quality control before delivery.
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
              All bulk orders are subject to product availability. We will
              notify you of any delays or changes.
            </li>
            <li className="mb-2">
              Payments must be completed before dispatch for all bulk orders
              unless otherwise agreed upon.
            </li>
            <li className="mb-2">
              We offer free delivery for orders above ₹50,000. Delivery charges
              apply to smaller orders based on location.
            </li>
            <li className="mb-2">
              Any cancellations must be made within 24 hours of placing the
              order. Refunds for bulk orders will be issued after quality checks
              on returns.
            </li>
            <li className="mb-2">
              Orders once dispatched cannot be modified, so please ensure all
              order details are correct before confirmation.
            </li>
          </ul>
        </div>

        {/* Outlets for Bulk Orders */}
        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Outlets for Bulk Orders
          </h2>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
            <li className="mb-2">
              <span className="font-semibold">Bangalore Outlet:</span> Our main
              hub for bulk orders, serving businesses in and around Bangalore.
            </li>
            <li className="mb-2">
              <span className="font-semibold">Hyderabad Outlet:</span> Our
              Hyderabad outlet processes bulk orders quickly with efficient
              delivery options.
            </li>
            <li className="mb-2">
              <span className="font-semibold">Kochi Outlet:</span> We provide
              specialized bulk orders from this location for Kerala and nearby
              regions.
            </li>
            <li className="mb-2">
              <span className="font-semibold">Delhi Outlet:</span> Serving the
              North Indian region with bulk orders and dedicated delivery
              services.
            </li>
          </ul>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BulkOrders;
