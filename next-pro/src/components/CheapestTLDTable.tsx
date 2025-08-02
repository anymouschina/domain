'use client';

import { useState, useEffect, useCallback } from 'react';

interface CheapestTLDData {
  id: number;
  registrar: string;
  tld: string;
  registrationPrice: number;
  renewalPrice: number;
  transferPrice: number;
  currency: string;
}

interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function CheapestTLDTable() {
  const [prices, setPrices] = useState<CheapestTLDData[]>([]);
  const [loading, setLoading] = useState(false);
  const [tldNameFilter, setTldNameFilter] = useState('');
  const [sortBy, setSortBy] = useState<'tld' | 'registrar' | 'price'>('tld');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    totalCount: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  });

  // 防抖处理筛选条件变化
  const [debouncedTldNameFilter, setDebouncedTldNameFilter] = useState(tldNameFilter);

  // 防抖TLD名称筛选
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTldNameFilter(tldNameFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [tldNameFilter]);

  // 从URL读取参数
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlPage = urlParams.get('page');
    const urlSortBy = urlParams.get('sortBy');
    const urlSortOrder = urlParams.get('sortOrder');
    const urlTldName = urlParams.get('tldName');

    if (urlPage) {
      const pageNum = parseInt(urlPage);
      if (!isNaN(pageNum) && pageNum > 0) {
        setPage(pageNum);
      }
    }

    if (urlSortBy) {
      if (urlSortBy === 'tld' || urlSortBy === 'registrar' || urlSortBy === 'price') {
        setSortBy(urlSortBy);
      }
    }

    if (urlSortOrder) {
      if (urlSortOrder === 'asc' || urlSortOrder === 'desc') {
        setSortOrder(urlSortOrder);
      }
    }

    if (urlTldName) {
      setTldNameFilter(urlTldName);
    }
  }, []);

  // 当筛选条件变化时更新URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (page > 1) {
      urlParams.set('page', page.toString());
    } else {
      urlParams.delete('page');
    }

    if (sortBy !== 'tld') {
      urlParams.set('sortBy', sortBy);
    } else {
      urlParams.delete('sortBy');
    }

    if (sortOrder !== 'asc') {
      urlParams.set('sortOrder', sortOrder);
    } else {
      urlParams.delete('sortOrder');
    }

    if (debouncedTldNameFilter) {
      urlParams.set('tldName', debouncedTldNameFilter);
    } else {
      urlParams.delete('tldName');
    }

    const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
    window.history.replaceState(null, '', newUrl);
  }, [page, sortBy, sortOrder, debouncedTldNameFilter]);

  // 实时加载数据
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append('sortBy', sortBy);
        params.append('sortOrder', sortOrder);
        params.append('page', page.toString());
        params.append('limit', '20');
        
        if (debouncedTldNameFilter) {
          params.append('tldName', debouncedTldNameFilter);
        }
        
        const response = await fetch(`/api/cheapest-tlds?${params.toString()}`);
    
        const data = await response.json();
        setPrices(data.prices || []);
        setPagination(data.pagination || {
          page: 1,
          limit: 20,
          totalCount: 0,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        });
      } catch (error) {
        console.error('Error fetching cheapest TLDs:', error);
        setPrices([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [sortBy, sortOrder, page, debouncedTldNameFilter]);

  const handleSort = (newSortBy: 'tld' | 'registrar' | 'price') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSortIcon = (column: 'tld' | 'registrar' | 'price') => {
    if (sortBy !== column) return '⇅';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const handleClear = () => {
    setTldNameFilter('');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 筛选器 */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                域名后缀筛选
              </label>
              <input
                type="text"
                placeholder="输入域名后缀，如.com、.net等"
                value={tldNameFilter}
                onChange={(e) => setTldNameFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                分页: {pagination.totalCount} 条记录
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleClear}
                  className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  清空
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 价格表格 */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => handleSort('tld')}
                >
                  域名后缀 {getSortIcon('tld')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => handleSort('registrar')}
                >
                  最便宜的注册商 {getSortIcon('registrar')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => handleSort('price')}
                >
                  注册价格 {getSortIcon('price')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  续费价格
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  转移价格
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {prices.map((price) => (
                <tr key={`${price.tld}-${price.registrar}-${price.id}`} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {price.tld}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {price.registrar}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white font-medium text-green-600">
                      ${price.registrationPrice}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      ${price.renewalPrice}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      ${price.transferPrice}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* 分页控件 */}
        {pagination.totalPages > 1 && (
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  显示第 <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> 到 
                  <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.totalCount)}</span> 条，
                  共 <span className="font-medium">{pagination.totalCount}</span> 条记录
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrev}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    上一页
                  </button>
                  
                  {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pageNum === pagination.page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNext}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    下一页
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
        
        {prices.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">没有找到价格数据</p>
          </div>
        )}
      </div>
    </div>
  );
}