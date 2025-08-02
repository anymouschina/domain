'use client';

import { useState, useEffect, useCallback } from 'react';

// 定义促销信息的数据结构
interface PromoData {
  id: number;
  code: string;
  price: number;
  type: number;
  isLimited: boolean;
  isOnlyForNewUser: boolean;
  createdAt: Date | null;
}

// 更新价格数据接口，添加促销字段
interface PriceData {
  id: number;
  registrar: string;
  extension: string;
  registrationPrice: number;
  renewalPrice: number;
  transferPrice: number;
  currency: string;
  logo?: string;
  promos?: PromoData[]; // 新增促销信息字段
}

interface TldData {
  name: string;
}

export default function RealTimePriceTable() {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [registrarFilter, setRegistrarFilter] = useState('');
  const [extensionFilter, setExtensionFilter] = useState('com');
  // 增加按促销价格排序的选项
  const [sortBy, setSortBy] = useState<'registrar' | 'extension' | 'price' | 'promo'>('registrar');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentExtension, setCurrentExtension] = useState('com');
  const [expanded, setExpanded] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  // 用于控制哪个促销提示被点击显示
  const [activePromoId, setActivePromoId] = useState<number | null>(null);

  // 每次加载的数量
  const PAGE_SIZE = 20;

  // Debounce filter condition changes
  const [debouncedRegistrarFilter, setDebouncedRegistrarFilter] = useState(registrarFilter);
  const [debouncedExtensionFilter, setDebouncedExtensionFilter] = useState(extensionFilter);

  // Debounce registrar filter
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedRegistrarFilter(registrarFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [registrarFilter]);

  // Debounce domain extension filter
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedExtensionFilter(extensionFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [extensionFilter]);

  // 当筛选条件或排序方式改变时，重置展开状态和数据
  useEffect(() => {
    setExpanded(false);
    setPrices([]);
  }, [debouncedRegistrarFilter, debouncedExtensionFilter, sortBy, sortOrder]);

  // Read parameters from URL and set filter conditions
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlExtension = urlParams.get('extension');
    const urlRegistrar = urlParams.get('registrar');
    const urlSortBy = urlParams.get('sortBy');
    const urlSortOrder = urlParams.get('sortOrder');

    if (urlExtension) {
      setExtensionFilter(urlExtension);
      setCurrentExtension(urlExtension);
    } else {
      setExtensionFilter('com');
      setCurrentExtension('com');
    }

    if (urlRegistrar) {
      setRegistrarFilter(urlRegistrar);
    }

    if (urlSortBy) {
      // 支持按促销价格排序
      if (['registrar', 'extension', 'price', 'promo'].includes(urlSortBy)) {
        setSortBy(urlSortBy as 'registrar' | 'extension' | 'price' | 'promo');
      }
    }

    if (urlSortOrder) {
      if (urlSortOrder === 'asc' || urlSortOrder === 'desc') {
        setSortOrder(urlSortOrder as 'asc' | 'desc');
      }
    }
  }, []);

  // Update URL when filter conditions change
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (extensionFilter && extensionFilter !== 'com') {
      urlParams.set('extension', extensionFilter);
    } else {
      urlParams.delete('extension');
    }

    if (registrarFilter) {
      urlParams.set('registrar', registrarFilter);
    } else {
      urlParams.delete('registrar');
    }

    if (sortBy !== 'registrar') {
      urlParams.set('sortBy', sortBy);
    } else {
      urlParams.delete('sortBy');
    }

    if (sortOrder !== 'asc') {
      urlParams.set('sortOrder', sortOrder);
    } else {
      urlParams.delete('sortOrder');
    }

    const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
    window.history.replaceState(null, '', newUrl);
  }, [extensionFilter, registrarFilter, sortBy, sortOrder]);

  // Load data - initial load or expand all
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedRegistrarFilter) params.append('registrar', debouncedRegistrarFilter);
      if (debouncedExtensionFilter) params.append('extension', debouncedExtensionFilter);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      
      // 如果展开全部，则不限制数量，否则只加载一页
      if (!expanded) {
        params.append('limit', PAGE_SIZE.toString());
        params.append('page', '1');
      } else {
        // 可以根据实际API情况调整，这里假设使用很大的数字来获取全部
        params.append('limit', '10000');
        params.append('page', '1');
      }
      
      const response = await fetch(`/api/prices?${params.toString()}`);
      const data = await response.json();
      
      // 更新总数和是否有更多数据
      setTotalCount(data.pagination?.totalCount || 0);
      setHasMore(data.pagination?.totalCount > PAGE_SIZE);
      
      // 如果是展开全部，直接替换数据，否则初始加载
      setPrices(data.prices || []);
    } catch (error) {
      console.error('Error fetching prices:', error);
      setPrices([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedRegistrarFilter, debouncedExtensionFilter, sortBy, sortOrder, expanded]);

  // 初始加载数据
  useEffect(() => {
    loadData();
  }, [loadData]);
  
  const handleSort = (newSortBy: 'registrar' | 'extension' | 'price' | 'promo') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const handleExpand = () => {
    setExpanded(true);
  };

  const handleClear = () => {
    setRegistrarFilter('');
    setExtensionFilter('');
  };

  const getSortIcon = (column: 'registrar' | 'extension' | 'price' | 'promo') => {
    if (sortBy !== column) return '⇅';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  // 处理促销提示的点击事件
  const togglePromoDetails = (promoId: number) => {
    setActivePromoId(activePromoId === promoId ? null : promoId);
  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Current query extension display */}
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Current Query Extension: <span className="text-blue-600">{currentExtension === '' ? 'All Extensions' : currentExtension}</span>
        </h2>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Registrar Filter
              </label>
              <input
                type="text"
                placeholder="Enter registrar name"
                value={registrarFilter}
                onChange={(e) => setRegistrarFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Total Records: {totalCount}
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleClear}
                  className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price table */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => handleSort('registrar')}
                >
                  Registrar {getSortIcon('registrar')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => handleSort('price')}
                >
                  Registration Price {getSortIcon('price')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Renewal Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Transfer Price
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {prices.map((price) => (
                <tr key={`${price.registrar}-${price.extension}-${price.id}`} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <a href={`https://${price.registrar}`} target='_blank' rel="noopener noreferrer" className="text-sm font-medium text-blue-900 dark:text-white">
                        {price.registrar}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white flex ">
                      ${price.registrationPrice.toFixed(2)}
                      {price.promos && price.promos.length > 0 ? price.promos.filter(promo => promo.type === 0).map((promo,index) => {
                        return (
                          <div key={index}>
                      <div className="relative group">
                              <button 
                                onClick={() => togglePromoDetails(promo.id)}
                                className="text-sm font-medium text-green-600 flex items-center focus:outline-none"
                              >
                                <span className="ml-1 bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                                  Promo
                                </span>
                              </button>
                              
                            </div>
                          {
                            activePromoId === promo.id ? (
                              <div className="absolute z-10 bg-gray-900 text-white text-xs rounded p-2 mt-1 w-64 shadow-lg">
                              <p className="mb-1">${promo.price.toFixed(2)} applies in cart</p>
                              <p className="mb-1">${price.registrationPrice.toFixed(2)} usual price</p>
                              {promo.isLimited && (
                                <p className="text-red-300 text-xs">Limited time offer</p>
                              )}
                              {promo.isOnlyForNewUser && (
                                <p className="text-yellow-300 text-xs">New users only</p>
                              )}
                              {promo.code && (
                                <p className="text-blue-300 text-xs mt-1">Promo code: {promo.code}</p>
                              )}
                            </div>
                            ):''
                          }
                            
                          </div>
                        )
                      }):''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white flex">
                      ${price.renewalPrice.toFixed(2)}
                      {price.promos && price.promos.length > 0 ? price.promos.filter(promo => promo.type === 1).map((promo,index) => {
                        return (
                          <div key={index}>
                      <div className="relative group">
                              <button 
                                onClick={() => togglePromoDetails(promo.id)}
                                className="text-sm font-medium text-green-600 flex items-center focus:outline-none"
                              >
                                <span className="ml-1 bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                                  Promo
                                </span>
                              </button>
                              
                            </div>
                          {
                            activePromoId === promo.id ? (
                              <div className="absolute z-10 bg-gray-900 text-white text-xs rounded p-2 mt-1 w-64 shadow-lg">
                              <p className="mb-1">${promo.price.toFixed(2)} applies in cart</p>
                              <p className="mb-1">${price.renewalPrice.toFixed(2)} usual price</p>
                              {promo.isLimited && (
                                <p className="text-red-300 text-xs">Limited time offer</p>
                              )}
                              {promo.isOnlyForNewUser && (
                                <p className="text-yellow-300 text-xs">New users only</p>
                              )}
                              {promo.code && (
                                <p className="text-blue-300 text-xs mt-1">Promo code: {promo.code}</p>
                              )}
                            </div>
                            ):''
                          }
                            
                          </div>
                        )
                      }):''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white flex">
                      ${price.transferPrice.toFixed(2)}
                      {price.promos && price.promos.length > 0 ? price.promos.filter(promo => promo.type === 2).map((promo,index) => {
                        return (
                          <div key={index}>
                      <div className="relative group">
                              <button 
                                onClick={() => togglePromoDetails(promo.id)}
                                className="text-sm font-medium text-green-600 flex items-center focus:outline-none"
                              >
                                <span className="ml-1 bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                                  Promo
                                </span>
                              </button>
                              
                            </div>
                          {
                            activePromoId === promo.id ? (
                              <div className="absolute z-10 bg-gray-900 text-white text-xs rounded p-2 mt-1 w-64 shadow-lg">
                              <p className="mb-1">${promo.price.toFixed(2)} applies in cart</p>
                              <p className="mb-1">${price.transferPrice.toFixed(2)} usual price</p>
                              {promo.isLimited && (
                                <p className="text-red-300 text-xs">Limited time offer</p>
                              )}
                              {promo.isOnlyForNewUser && (
                                <p className="text-yellow-300 text-xs">New users only</p>
                              )}
                              {promo.code && (
                                <p className="text-blue-300 text-xs mt-1">Promo code: {promo.code}</p>
                              )}
                            </div>
                            ):''
                          }
                            
                          </div>
                        )
                      }):''}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Expand all button */}
        {hasMore && !expanded && (
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex items-center justify-center border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <button
              onClick={handleExpand}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : `Show All ${totalCount} Results`}
            </button>
          </div>
        )}
        
        {prices.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No price data found matching the criteria</p>
          </div>
        )}
        
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Loading data...</p>
          </div>
        )}
      </div>
    </div>
  );
}
