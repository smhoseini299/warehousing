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
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-right">
        تراکنش‌ها <span className="text-indigo-600">📊</span>
      </h1>

      {/* بخش خلاصه وضعیت */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-right">
        <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-xl shadow-lg flex flex-col justify-between">
          <p className="text-sm opacity-90 mb-2">مجموع واریزی‌های موفق</p>
          <p className="text-3xl font-bold">{formatCurrency(totalDeposits, 'IRT')}</p>
        </div>
        <div className="bg-gradient-to-r from-red-400 to-red-600 text-white p-6 rounded-xl shadow-lg flex flex-col justify-between">
          <p className="text-sm opacity-90 mb-2">مجموع برداشتی‌های موفق</p>
          <p className="text-3xl font-bold">{formatCurrency(totalWithdrawals, 'IRT')}</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-6 rounded-xl shadow-lg flex flex-col justify-between">
          <p className="text-sm opacity-90 mb-2">تراکنش‌های در انتظار</p>
          <p className="text-3xl font-bold">{totalPending}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-2xl">
        {/* فیلتر و جستجو */}
        <div className="flex flex-wrap items-center justify-end gap-4 mb-6">
          <input
            type="text"
            placeholder="جستجو در تراکنش‌ها..."
            className="flex-grow md:flex-grow-0 md:w-64 p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-right"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-right"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as '' | 'deposit' | 'withdrawal')}
          >
            <option value="">همه انواع</option>
            <option value="deposit">واریز</option>
            <option value="withdrawal">برداشت</option>
          </select>

          <select
            className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-right"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as '' | 'success' | 'pending' | 'failed')}
          >
            <option value="">همه وضعیت‌ها</option>
            <option value="success">موفق</option>
            <option value="pending">در انتظار</option>
            <option value="failed">ناموفق</option>
          </select>

          <button
            className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
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

        {/* جدول تراکنش‌ها */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm text-right">
            <thead>
              <tr className="bg-gray-50 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 cursor-pointer" onClick={() => requestSort('id')}>
                  شناسه
                  {getClassNamesFor('id') === 'ascending' ? ' ⬆️' : getClassNamesFor('id') === 'descending' ? ' ⬇️' : ''}
                </th>
                <th className="py-3 px-6 cursor-pointer" onClick={() => requestSort('type')}>
                  نوع
                  {getClassNamesFor('type') === 'ascending' ? ' ⬆️' : getClassNamesFor('type') === 'descending' ? ' ⬇️' : ''}
                </th>
                <th className="py-3 px-6 cursor-pointer" onClick={() => requestSort('amount')}>
                  مبلغ
                  {getClassNamesFor('amount') === 'ascending' ? ' ⬆️' : getClassNamesFor('amount') === 'descending' ? ' ⬇️' : ''}
                </th>
                <th className="py-3 px-6">وضعیت</th>
                <th className="py-3 px-6 cursor-pointer" onClick={() => requestSort('date')}>
                  تاریخ
                  {getClassNamesFor('date') === 'ascending' ? ' ⬆️' : getClassNamesFor('date') === 'descending' ? ' ⬇️' : ''}
                </th>
                <th className="py-3 px-6">توضیحات</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {currentTransactions.length > 0 ? (
                currentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6">{transaction.id}</td>
                    <td className="py-3 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        transaction.type === 'deposit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type === 'deposit' ? 'واریز' : 'برداشت'}
                      </span>
                    </td>
                    <td className="py-3 px-6 font-medium">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </td>
                    <td className="py-3 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        transaction.status === 'success' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status === 'success' && 'موفق'}
                        {transaction.status === 'pending' && 'در انتظار'}
                        {transaction.status === 'failed' && 'ناموفق'}
                      </span>
                    </td>
                    <td className="py-3 px-6">{formatDate(transaction.date)}</td>
                    <td className="py-3 px-6">{transaction.description || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-500">
                    تراکنشی یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* صفحه‌بندی */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              قبلی
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`p-2 w-10 h-10 rounded-lg ${
                  currentPage === page ? 'bg-indigo-600 text-white' : 'border border-gray-300 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              بعدی
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;