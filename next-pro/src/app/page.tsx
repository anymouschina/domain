'use client';

import RealTimePriceTable from '@/components/RealTimePriceTable';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Domain Registration Price Comparison
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Compare domain extension prices from major registrars in real-time to find the cheapest registrar
          </p>
        </div>

        <RealTimePriceTable />

        {/* Navigation to cheapest registrars page */}
        <div className="mt-8 text-center">
          <a 
            href="/cheapest-tlds"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            View Cheapest Registrars for Each Domain Extension →
          </a>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Real-time Filtering
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Enter registrar name or select domain extension, data updates in real-time
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Smart Sorting
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Support sorting by registrar first letter and registration price in ascending/descending order
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Comprehensive Data
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Complete pricing information covering major registrars and popular domain extensions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
