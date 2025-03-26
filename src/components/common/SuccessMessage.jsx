import React from "react";
import successImage from "../../assets/success.png";
import { X } from "lucide-react"; // TriangleAlert was unused, so removed

const SuccessMessage = ({ showMsg, onClose,content }) => {
  if (!showMsg) return null; // Prevent rendering if showMsg is false

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-96 max-w-3xl h-64 rounded-lg shadow-lg p-6 space-y-4 relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        {/* Success Image */}
        <div className="flex flex-col items-center justify-center">
          <img src={successImage} alt="Success" className="w-20 h-20" />
        </div>

        {/* Success Text */}
        <div className="flex flex-col items-center text-center">
          <span className="text-black text-3xl font-bold">Success!</span>
        </div>

        {/* Success Message */}
        <div className="flex flex-col items-center text-center px-6">
          <p className="text-gray-500 text-base font-medium leading-6">
          {content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;
