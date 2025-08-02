'use client';

import RealTimePriceTable from '@/components/RealTimePriceTable';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            域名注册价格对比
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            实时比较各大注册商提供的 .net、.org、.info、.co、.io、.xyz 等域名后缀价格，找到最便宜的注册商
          </p>
        </div>

        <RealTimePriceTable />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              实时筛选
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              输入注册商名称或选择域名后缀，数据实时更新
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              智能排序
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              支持按注册商首字母和注册价格正序/倒序排序
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              数据全面
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              涵盖主流注册商和热门域名后缀的完整价格信息
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
