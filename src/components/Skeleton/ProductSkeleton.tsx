import React from "react";

const ProductSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse flex flex-col items-center justify-between p-4 border border-gray-200 rounded-xl">
      <div className="bg-gray-300 h-40 w-full rounded mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
      <div className="h-8 bg-gray-300 rounded w-1/2"></div>
    </div>
  );
};

export default ProductSkeleton;
