'use client';

interface PriceData {
  registrar: string;
  extension: string;
  registrationPrice: number;
  renewalPrice: number;
  transferPrice: number;
  currency: string;
  logo?: string;
}

interface TldPriceTableProps {
  prices: PriceData[];
  loading: boolean;
  registrarFilter?: string;
  extensionFilter?: string;
}

export default function TldPriceTable({ prices, loading, registrarFilter, extensionFilter }: TldPriceTableProps) {
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">正在加载价格数据...</p>
        </div>
      </div>
    );
  }

  if (prices.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border">
          <div className="text-gray-500 dark:text-gray-400 text-lg">
            没有找到符合条件的价格数据
          </div>
          <p className="text-gray-400 dark:text-gray-500 mt-2">
            请尝试调整筛选条件
          </p>
        </div>
      </div>
    );
  }

  // Group by registrar for better display
  const groupedByRegistrar = prices.reduce((acc, price) => {
    if (!acc[price.registrar]) {
      acc[price.registrar] = [];
    }
    acc[price.registrar].push(price);
    return acc;
  }, {} as Record<string, PriceData[]>);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            注册商价格对比
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            共找到 {prices.length} 条价格记录
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  注册商
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  域名后缀
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  注册价格
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
              {prices.map((price, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {price.logo && (
                        <img 
                          src={price.logo} 
                          alt={price.registrar}
                          className="h-8 w-8 rounded mr-3"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {price.registrar}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {price.extension}
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
      </div>
    </div>
  );
}