import React, { useState, useMemo } from 'react';

// یک نوع داده فرضی برای تراکنش
interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  currency: string;
  status: 'success' | 'pending' | 'failed';
  date: string; // ISO Date String
  description?: string;
}

// داده‌های فرضی برای نمایش
const mockTransactions: Transaction[] = [
  { id: '1', type: 'deposit', amount: 1200000, currency: 'IRT', status: 'success', date: '2023-10-26T10:30:00Z', description: 'واریز از طریق درگاه پرداخت' },
  { id: '2', type: 'withdrawal', amount: 500000, currency: 'IRT', status: 'pending', date: '2023-10-25T14:15:00Z', description: 'برداشت به حساب بانکی' },
  { id: '3', type: 'deposit', amount: 3000000, currency: 'IRT', status: 'success', date: '2023-10-24T09:00:00Z', description: 'واریز از فلان شخص' },
  { id: '4', type: 'withdrawal', amount: 200000, currency: 'IRT', status: 'failed', date: '2023-10-23T18:45:00Z', description: 'برداشت ناموفق' },
  { id: '5', type: 'deposit', amount: 750000, currency: 'IRT', status: 'success', date: '2023-10-22T11:20:00Z', description: 'واریز وجه' },
  { id: '6', type: 'withdrawal', amount: 1000000, currency: 'IRT', status: 'success', date: '2023-10-21T16:00:00Z', description: 'خرید از فروشگاه ایکس' },
  { id: '7', type: 'deposit', amount: 1500000, currency: 'IRT', status: 'pending', date: '2023-10-20T08:00:00Z', description: 'واریز وجه' },
  { id: '8', type: 'withdrawal', amount: 300000, currency: 'IRT', status: 'success', date: '2023-10-19T13:00:00Z', description: 'انتقال وجه' },
  { id: '9', type: 'deposit', amount: 800000, currency: 'IRT', status: 'success', date: '2023-10-18T10:00:00Z', description: 'دریافت وام' },
  { id: '10', type: 'withdrawal', amount: 400000, currency: 'IRT', status: 'failed', date: '2023-10-17T17:00:00Z', description: 'تلاش برای برداشت' },
];

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [filterType, setFilterType] = useState<'' | 'deposit' | 'withdrawal'>('');
  const [filterStatus, setFilterStatus] = useState<'' | 'success' | 'pending' | 'failed'>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Transaction; direction: 'ascending' | 'descending' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // فیلتر و جستجو
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    if (filterType) {
      filtered = filtered.filter(t => t.type === filterType);
    }

    if (filterStatus) {
      filtered = filtered.filter(t => t.status === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [transactions, filterType, filterStatus, searchTerm]);

  // مرتب‌سازی
  const sortedTransactions = useMemo(() => {
    let sortableItems = [...filteredTransactions];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue == null || bValue == null) return 0;

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredTransactions, sortConfig]);

  // صفحه‌بندی
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const currentTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedTransactions, currentPage, itemsPerPage]);

  const requestSort = (key: keyof Transaction) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getClassNamesFor = (name: keyof Transaction) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  // خلاصه وضعیت
  const totalDeposits = useMemo(() =>
    transactions.filter(t => t.type === 'deposit' && t.status === 'success').reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );
  const totalWithdrawals = useMemo(() =>
    transactions.filter(t => t.type === 'withdrawal' && t.status === 'success').reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );
  const totalPending = useMemo(() =>
    transactions.filter(t => t.status === 'pending').length,
    [transactions]
  );

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fa-IR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fa-IR', options);
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-6 py-4 bg-gray-100 min-h-screen">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 text-right">
          تراکنش‌ها <span className="text-indigo-600">📊</span>
        </h1>

        {/* بخش خلاصه وضعیت */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-4 rounded-xl shadow-md flex flex-col justify-between">
            <p className="text-xs sm:text-sm opacity-90 mb-2">مجموع واریزی‌های موفق</p>
            <p className="text-lg sm:text-2xl font-bold">{formatCurrency(totalDeposits, 'IRT')}</p>
          </div>
          <div className="bg-gradient-to-r from-red-400 to-red-600 text-white p-4 rounded-xl shadow-md flex flex-col justify-between">
            <p className="text-xs sm:text-sm opacity-90 mb-2">مجموع برداشتی‌های موفق</p>
            <p className="text-lg sm:text-2xl font-bold">{formatCurrency(totalWithdrawals, 'IRT')}</p>
          </div>
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-4 rounded-xl shadow-md flex flex-col justify-between col-span-1 sm:col-span-2 lg:col-span-1">
            <p className="text-xs sm:text-sm opacity-90 mb-2">تراکنش‌های در انتظار</p>
            <p className="text-lg sm:text-2xl font-bold">{totalPending}</p>
          </div>
        </div>

        {/* محتوای اصلی */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          {/* فیلتر و جستجو */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4 items-end justify-end">
            <div className="w-full sm:w-auto flex-grow">
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">جستجو</label>
              <input
                type="text"
                placeholder="جستجو در تراکنش‌ها..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-right"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">نوع تراکنش</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-right"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as '' | 'deposit' | 'withdrawal')}
              >
                <option value="">همه انواع</option>
                <option value="deposit">واریز</option>
                <option value="withdrawal">برداشت</option>
              </select>
            </div>

            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">وضعیت</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-right"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as '' | 'success' | 'pending' | 'failed')}
              >
                <option value="">همه وضعیت‌ها</option>
                <option value="success">موفق</option>
                <option value="pending">در انتظار</option>
                <option value="failed">ناموفق</option>
              </select>
            </div>

            <button
              className="w-full sm:w-auto p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
              onClick={() => {
                setFilterType('');
                setFilterStatus('');
                setSearchTerm('');
                setSortConfig(null);
              }}
            >
              پاک کردن فیلترها
            </button>
          </div>

          {/* لیست تراکنش‌ها برای موبایل */}
          <div className="block sm:hidden space-y-4">
            {currentTransactions.length > 0 ? (
              currentTransactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm">شناسه: {transaction.id}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      transaction.type === 'deposit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type === 'deposit' ? 'واریز' : 'برداشت'}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">مبلغ:</span>
                      <span className="font-medium">{formatCurrency(transaction.amount, transaction.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">وضعیت:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        transaction.status === 'success' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status === 'success' && 'موفق'}
                        {transaction.status === 'pending' && 'در انتظار'}
                        {transaction.status === 'failed' && 'ناموفق'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">تاریخ:</span>
                      <span>{formatDate(transaction.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">توضیحات:</span>
                      <span>{transaction.description || '-'}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                تراکنشی یافت نشد.
              </div>
            )}
          </div>

          {/* جدول تراکنش‌ها برای دسکتاپ */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full bg-white text-right">
              <thead>
                <tr className="bg-gray-50 text-gray-600 uppercase text-xs leading-normal">
                  <th className="py-3 px-2 cursor-pointer" onClick={() => requestSort('id')}>شناسه</th>
                  <th className="py-3 px-2 cursor-pointer" onClick={() => requestSort('type')}>نوع</th>
                  <th className="py-3 px-2 cursor-pointer" onClick={() => requestSort('amount')}>مبلغ</th>
                  <th className="py-3 px-2">وضعیت</th>
                  <th className="py-3 px-2 cursor-pointer" onClick={() => requestSort('date')}>تاریخ</th>
                  <th className="py-3 px-2">توضیحات</th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.length > 0 ? (
                  currentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-2">{transaction.id}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          transaction.type === 'deposit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type === 'deposit' ? 'واریز' : 'برداشت'}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-medium">{formatCurrency(transaction.amount, transaction.currency)}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          transaction.status === 'success' ? 'bg-green-100 text-green-800' :
                          transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status === 'success' && 'موفق'}
                          {transaction.status === 'pending' && 'در انتظار'}
                          {transaction.status === 'failed' && 'ناموفق'}
                        </span>
                      </td>
                      <td className="py-3 px-2">{formatDate(transaction.date)}</td>
                      <td className="py-3 px-2">{transaction.description || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-500 py-4">
                      تراکنشی یافت نشد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* صفحه‌بندی */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-full sm:w-auto p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                قبلی
              </button>
              <div className="flex flex-wrap justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`p-2 w-10 h-10 rounded-lg text-sm ${
                      currentPage === page ? 'bg-indigo-600 text-white' : 'border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-full sm:w-auto p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                بعدی
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;