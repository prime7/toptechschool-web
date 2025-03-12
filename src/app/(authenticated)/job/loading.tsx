import React from 'react';

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen flex-col gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="text-xl text-gray-600 font-medium">Loading your job data...</p>
      <p className="text-sm text-gray-400">Please wait while we prepare your information</p>
    </div>
  );
}
