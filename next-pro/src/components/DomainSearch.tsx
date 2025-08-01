'use client';

import { useState } from 'react';

interface DomainSearchProps {
  onSearch: (domain: string, extension: string) => void;
  loading?: boolean;
}

export default function DomainSearch({ onSearch, loading }: DomainSearchProps) {
  const [domain, setDomain] = useState('');
  const [extension, setExtension] = useState('.com');

  const popularExtensions = ['.com', '.net', '.org', '.io', '.co', '.ai', '.dev', '.app'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain.trim()) {
      onSearch(domain.trim(), extension);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="domain" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Domain Name
            </label>
            <input
              type="text"
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="w-full sm:w-32">
            <label htmlFor="extension" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Extension
            </label>
            <select
              id="extension"
              value={extension}
              onChange={(e) => setExtension(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {popularExtensions.map((ext) => (
                <option key={ext} value={ext}>
                  {ext}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !domain.trim()}
          className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Searching...' : 'Check Prices'}
        </button>
      </form>
    </div>
  );
}