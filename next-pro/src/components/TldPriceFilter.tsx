'use client';

import { useState, useEffect } from 'react';

interface PriceData {
  registrar: string;
  extension: string;
  registrationPrice: number;
  renewalPrice: number;
  transferPrice: number;
  currency: string;
  logo?: string;
}

interface TldPriceFilterProps {
  onFilter: (registrar: string, extension: string) => void;
  loading?: boolean;
}

export default function TldPriceFilter({ onFilter, loading }: TldPriceFilterProps) {
  const [registrar, setRegistrar] = useState('');
  const [extension, setExtension] = useState('');

  const popularRegistrars = ['GoDaddy', 'Namecheap', 'Cloudflare', 'Google Domains', 'Name.com'];
  const popularExtensions = ['.com', '.net', '.org', '.io', '.co', '.ai', '.dev', '.app'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(registrar, extension);
  };

  const handleClear = () => {
    setRegistrar('');
    setExtension('');
    onFilter('', '');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="registrar" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              注册商 (可选)
            </label>
            <select
              id="registrar"
              value={registrar}
              onChange={(e) => setRegistrar(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">所有注册商</option>
              {popularRegistrars.map((reg) => (
                <option key={reg} value={reg}>
                  {reg}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="extension" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              域名后缀 (可选)
            </label>
            <select
              id="extension"
              value={extension}
              onChange={(e) => setExtension(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">所有后缀</option>
              {popularExtensions.map((ext) => (
                <option key={ext} value={ext}>
                  {ext}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '查询中...' : '查询价格'}
          </button>
          
          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className="px-6 py-3 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            清空
          </button>
        </div>
      </form>
    </div>
  );
}