import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // adjust path to your firebase setup
import { Link } from "react-router-dom";
import { MagicCard } from "../components/magicui/magic-card";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ShinyButton from "../components/magicui/shiny-button";

interface ProductItem {
  id: string;
  name: string;
  imageUrl: string;
  actualPrice: number;
  discountedPrice: number | null;
  finalPrice: number;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsArray: ProductItem[] = [];
        querySnapshot.forEach((doc) => {
          const productData = doc.data() as ProductItem & { status: string };
          if (productData.status === "active") {
            const { id, ...restProductData } = productData;
            productsArray.push({ id: doc.id, ...restProductData });
          }
        });
        setProducts(productsArray);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const ProductSkeleton = () => (
    <div className="animate-pulse flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl">
      <div className="bg-gray-300 h-40 w-full rounded mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
      <div className="h-8 bg-gray-300 rounded w-1/2"></div>
    </div>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section
      id="products"
      className="py-16 text-center relative bg-white dark:bg-black-2"
    >
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          Our Products
        </h2>
        <div className="relative">
          <Slider {...settings}>
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="p-2">
                    <ProductSkeleton />
                  </div>
                ))
              : products.map((product) => (
                  <div key={product.id} className="p-2">
                    <MagicCard
                      className="transition min-h-115 duration-700 ease-in-out cursor-pointer flex-col items-center justify-center text-center p-2 border border-white/30 hover:border-white/50 rounded-xl"
                      gradientColor="#FF5733"
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-40 object-cover rounded"
                      />
                      <hr className="my-4 border-gray-300 dark:border-gray-600" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {product.name}
                      </h3>
                      {product.discountedPrice ? (
                        <div className="flex items-center justify-center">
                          <p className="text-red-500 dark:text-red-400 line-through mr-2">
                            ₹{product.actualPrice}
                          </p>
                          <p className="text-green-600 dark:text-green-400 font-bold">
                            ₹{product.finalPrice}
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-900 dark:text-white font-bold">
                          ₹{product.actualPrice}
                        </p>
                      )}

                      {/* <a href={"/products"}>
                        <ShinyButton
                          text="Show More"
                          className="mt-4 px-4 py-2"
                        />
                      </a> */}
                      <Link to={"/products"}>
                        <ShinyButton
                          text="Show More"
                          className="mt-4 px-4 py-2"
                        />
                      </Link>
                    </MagicCard>
                  </div>
                ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Products;
