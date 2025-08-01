'use client';

import { useState, useEffect } from 'react';
import TldPriceFilter from '@/components/TldPriceFilter';
import TldPriceTable from '@/components/TldPriceTable';

interface PriceData {
  registrar: string;
  extension: string;
  registrationPrice: number;
  renewalPrice: number;
  transferPrice: number;
  currency: string;
  logo?: string;
}

export default function Home() {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [registrarFilter, setRegistrarFilter] = useState('');
  const [extensionFilter, setExtensionFilter] = useState('');

  // Load all prices on initial load
  useEffect(() => {
    handleFilter('', '');
  }, []);

  const handleFilter = async (registrar: string, extension: string) => {
    setLoading(true);
    setRegistrarFilter(registrar);
    setExtensionFilter(extension);
    
    try {
      const params = new URLSearchParams();
      if (registrar) params.append('registrar', registrar);
      if (extension) params.append('extension', extension);
      
      const response = await fetch(`/api/prices?${params.toString()}`);
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
            域名注册价格对比
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            比较各大注册商提供的域名后缀价格，找到最优惠的注册方案
          </p>
        </div>

        <TldPriceFilter onFilter={handleFilter} loading={loading} />

        <TldPriceTable 
          prices={prices} 
          loading={loading}
          registrarFilter={registrarFilter}
          extensionFilter={extensionFilter}
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              全面覆盖
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              涵盖主流注册商和热门域名后缀的价格对比
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              实时更新
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              价格数据定期更新，确保信息准确及时
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              灵活筛选
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              可按注册商或域名后缀进行精确筛选
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
