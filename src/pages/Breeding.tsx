import Nav from "../components/Nav";
import Footer from "../components/Footer";

const Breeding = () => {
  return (
    <>
      <Nav />
      <div className="px-8 py-16 bg-gray-50 dark:bg-black-2">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mt-30 text-gray-800 dark:text-gray-200">
            Hen and Heaven Breeding Program
          </h1>
          <p className="text-lg mt-4 text-gray-600 dark:text-gray-400">
            Our breeding program ensures the highest quality poultry, focusing
            on healthy, productive hens for our franchisees.
          </p>
        </div>

        {/* Breeding Information */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Breeding Process */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Breeding Process
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
              <li className="mb-2">
                <span className="font-semibold">Selective Breeding:</span> We
                ensure high productivity and disease-resistant breeds.
              </li>
              <li className="mb-2">
                <span className="font-semibold">Sustainable Practices:</span>{" "}
                Our breeding practices focus on sustainability and ethical
                treatment.
              </li>
              <li className="mb-2">
                <span className="font-semibold">Expert Care:</span> Our hens are
                nurtured by professionals with extensive experience in poultry
                care.
              </li>
              <li className="mb-2">
                <span className="font-semibold">Regular Health Checks:</span>{" "}
                All hens are monitored for health and productivity.
              </li>
            </ul>
          </div>

          {/* Breeding Benefits */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Benefits of Our Breeding Program
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
              <li className="mb-2">
                <span className="font-semibold">High Egg Production:</span> Our
                hens have high egg-laying capabilities, ensuring steady revenue.
              </li>
              <li className="mb-2">
                <span className="font-semibold">Disease Resistance:</span> We
                breed hens that are resistant to common poultry diseases.
              </li>
              <li className="mb-2">
                <span className="font-semibold">Improved Longevity:</span> Our
                hens live longer, healthier lives due to careful breeding.
              </li>
              <li className="mb-2">
                <span className="font-semibold">Quality Assurance:</span> All
                hens meet strict quality standards before being distributed to
                franchisees.
              </li>
            </ul>
          </div>
        </div>

        {/* Conditions Section */}
        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Breeding Program Conditions
          </h2>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
            <li className="mb-2">
              Franchisees must adhere to Hen and Heaven's breeding guidelines to
              maintain quality and consistency.
            </li>
            <li className="mb-2">
              Periodic health inspections will be conducted to ensure the
              well-being of the hens.
            </li>
            <li className="mb-2">
              Breeding supplies and instructions will be provided by Hen and
              Heaven to all franchisees.
            </li>
            <li className="mb-2">
              Hens must be housed in clean, spacious environments as per Hen and
              Heaven's standards.
            </li>
          </ul>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Breeding;
