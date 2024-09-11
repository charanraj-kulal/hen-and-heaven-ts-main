import React from "react";
import { Facebook, Instagram, Twitter, ChevronRight } from "lucide-react";
import Image from "next/image";
const Footer = () => {
  return (
    <footer className="py-8 bg-white border-t-2 border-black-2/60 dark:border-white/60 dark:bg-black text-gray-800 dark:text-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-center md:text-left">
          <div className="flex-row ">
            <h3 className="text-xl font-semibold mb-4">
              HEN AND <span className="text-red-600">HEAVEN</span>
            </h3>
            <Image
              src="/images/logo/logo-text-white.png"
              alt="Logo"
              width={800}
              height={800}
              className="h-44 w-44 aspect-square object-cover hidden dark:inline-flex justify-center md:justify-start object-left-top rounded-sm"
            />
            <Image
              src="/images/logo/logo-text-black.png"
              alt="Logo"
              width={800}
              height={800}
              className="dark:hidden h-44 w-44 aspect-square object-cover inline-flex justify-center md:justify-start object-left-top rounded-sm"
            />
          </div>
          {/* Column 1 */}
          <div>
            <h3 className="text-xl font-semibold mb-4">About Us</h3>
            <p className="text-sm">
              We provide top-quality services for all your needs. Our focus is
              on customer satisfaction and premium support.
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <div className="flex justify-center md:justify-start">
              <ul className="space-y-2 flex flex-col justify-center text-center">
                <li className="inline-flex">
                  <ChevronRight />
                  <a
                    href="#home"
                    className=" hover:text-red-600 hover:tracking-wider transition-all"
                  >
                    Home
                  </a>
                </li>
                <li className="inline-flex">
                  {" "}
                  <ChevronRight />
                  <a
                    href="#products"
                    className=" hover:text-red-600 hover:tracking-wider transition-all"
                  >
                    Products
                  </a>
                </li>
                <li className="inline-flex">
                  <ChevronRight />
                  <a
                    href="#about"
                    className=" hover:text-red-600 hover:tracking-wider transition-all"
                  >
                    About Us
                  </a>
                </li>
                <li className="inline-flex">
                  <ChevronRight />
                  <a
                    href="#contact"
                    className=" hover:text-red-600 hover:tracking-wider transition-all"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us On</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              {/* Replace with your icons */}
              <a href="#" aria-label="Facebook">
                <Facebook className="hover:text-red-600 transition-all" />
              </a>
              <a href="#" aria-label="Twitter">
                <Twitter className="hover:text-red-600 transition-all" />
              </a>
              <a href="#" aria-label="Instagram">
                <Instagram className="hover:text-red-600 transition-all" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="mt-8 text-sm text-center border-t border-gray-300 dark:border-gray-700 pt-4">
          &copy; {new Date().getFullYear()} Hen and{" "}
          <span className="text-red-500">Heaven</span>. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
