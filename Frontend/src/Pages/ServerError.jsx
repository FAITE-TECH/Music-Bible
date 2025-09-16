import React from "react";

export default function ServerError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        500 - Server Error
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Sorry, something went wrong on our end.
      </p>
      <a href="/" className="text-blue-500 underline">
        Go to Home
      </a>
    </div>
  );
}
