'use client';

import CheapestTLDTable from '@/components/CheapestTLDTable';

export default function CheapestTLDsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            域名后缀最便宜注册商
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            查看每个域名后缀价格最低的注册商，快速找到最便宜的注册选择
          </p>
        </div>

        <CheapestTLDTable />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              智能比较
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              自动比较所有注册商对每个域名后缀的报价
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              实时更新
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              数据实时更新，确保价格信息准确无误
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              全面覆盖
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              涵盖主流和新兴域名后缀的完整价格信息
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}