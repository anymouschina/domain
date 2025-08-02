'use client';

import CheapestTLDTable from '@/components/CheapestTLDTable';

export default function CheapestTLDsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Cheapest Registrars for Domain Extensions
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            View the cheapest registrar for each domain extension to quickly find the most affordable registration option
          </p>
        </div>

        <CheapestTLDTable />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Smart Comparison
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Automatically compare quotes from all registrars for each domain extension
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Real-time Updates
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Data updates in real-time to ensure accurate pricing information
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Comprehensive Coverage
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Complete pricing information covering mainstream and emerging domain extensions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}