import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

const Rating = ({ value }: { value: number }) => {
  const renderStar = (starValue: number) => {
    if (starValue - 0.5 < value) return <FaStar className="text-yellow-500" />;

    return <FaRegStar className="text-gray-400" />;
  };

  return (
    <div className="flex items-center">
      {Array(5)
        .fill(5)
        .map((_, index) => {
          const starValue = index + 1;

          return (
            <div key={index} className="cursor-pointer">
              {renderStar(starValue)}
            </div>
          );
        })}
    </div>
  );
};

export default Rating;
