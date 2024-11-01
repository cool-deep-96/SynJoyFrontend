import Link from 'next/link';
import React from 'react';

const page = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-semibold mb-4">
          You have been removed by the room owner
        </h2>
        <div className="mt-6">
          <Link
            href={'/room'}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mr-4 focus:outline-none"
          >
            Create New Room
          </Link>
          <button
            className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg focus:outline-none"
            
          >
            Request to Rejoin
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
