'use client';

import { useState } from 'react';
import DomainSearch from '@/components/DomainSearch';
import PriceTable from '@/components/PriceTable';

interface PriceData {
  registrar: string;
  registrationPrice: number;
  renewalPrice: number;
  transferPrice?: number;
  currency: string;
  logo?: string;
}

export default function Home() {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchDomain, setSearchDomain] = useState('');
  const [searchExtension, setSearchExtension] = useState('');

  const handleSearch = async (domain: string, extension: string) => {
    setLoading(true);
    setSearchDomain(domain);
    setSearchExtension(extension);
    
    try {
      const response = await fetch(`/api/prices?domain=${domain}&extension=${extension}`);
      const data = await response.json();
      setPrices(data.prices || []);
    } catch (error) {
      console.error('Error fetching prices:', error);
      setPrices([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Find the Best Domain Prices
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Compare domain registration prices across multiple registrars to find the best deal for your domain.
          </p>
        </div>

        <DomainSearch onSearch={handleSearch} loading={loading} />

        <PriceTable 
          prices={prices} 
          domain={searchDomain} 
          extension={searchExtension} 
          loading={loading} 
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Comprehensive Comparison
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We compare prices from top domain registrars to help you find the best deals.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Real-time Updates
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Our prices are updated regularly to ensure you get the most current information.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Easy to Use
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Simply enter your desired domain name and extension to see instant price comparisons.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
