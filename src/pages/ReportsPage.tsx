import React, { useState, useMemo } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// ثبت کامپوننت‌های Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// داده‌های فرضی برای گزارشات
interface ReportData {
  date: string; // YYYY-MM-DD
  totalSales: number;
  newUsers: number;
  successfulTransactions: number;
  failedTransactions: number;
}

const mockReportData: ReportData[] = [
  { date: '2023-10-01', totalSales: 1500000, newUsers: 10, successfulTransactions: 50, failedTransactions: 2 },
  { date: '2023-10-02', totalSales: 1800000, newUsers: 12, successfulTransactions: 60, failedTransactions: 1 },
  { date: '2023-10-03', totalSales: 2000000, newUsers: 8, successfulTransactions: 65, failedTransactions: 3 },
  { date: '2023-10-04', totalSales: 1700000, newUsers: 15, successfulTransactions: 55, failedTransactions: 0 },
  { date: '2023-10-05', totalSales: 2200000, newUsers: 20, successfulTransactions: 70, failedTransactions: 4 },
  { date: '2023-10-06', totalSales: 1900000, newUsers: 11, successfulTransactions: 62, failedTransactions: 2 },
  { date: '2023-10-07', totalSales: 2500000, newUsers: 25, successfulTransactions: 80, failedTransactions: 1 },
];

const ReportsPage: React.FC = () => {
  const [selectedReportType, setSelectedReportType] = useState<'sales' | 'users' | 'transactions'>('sales');
  const [startDate, setStartDate] = useState<string>('2023-10-01'); // فرمت YYYY-MM-DD
  const [endDate, setEndDate] = useState<string>('2023-10-07'); // فرمت YYYY-MM-DD

  const filteredData = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return mockReportData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= end;
    });
  }, [startDate, endDate]);

  // آماده‌سازی داده‌ها برای نمودار فروش
  const salesChartData = useMemo(() => ({
    labels: filteredData.map(item => new Date(item.date).toLocaleDateString('fa-IR')),
    datasets: [
      {
        label: 'مجموع فروش',
        data: filteredData.map(item => item.totalSales),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
        fill: true,
      },
    ],
  }), [filteredData]);

  // آماده‌سازی داده‌ها برای نمودار کاربران جدید
  const usersChartData = useMemo(() => ({
    labels: filteredData.map(item => new Date(item.date).toLocaleDateString('fa-IR')),
    datasets: [
      {
        label: 'کاربران جدید',
        data: filteredData.map(item => item.newUsers),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgb(153, 102, 255)',
        borderWidth: 1,
      },
    ],
  }), [filteredData]);

  // آماده‌سازی داده‌ها برای نمودار وضعیت تراکنش‌ها
  const transactionSummary = useMemo(() => {
    const success = filteredData.reduce((sum, item) => sum + item.successfulTransactions, 0);
    const failed = filteredData.reduce((sum, item) => sum + item.failedTransactions, 0);
    return { success, failed };
  }, [filteredData]);

  const transactionPieData = {
    labels: ['موفق', 'ناموفق'],
    datasets: [
      {
        data: [transactionSummary.success, transactionSummary.failed],
        backgroundColor: ['rgba(75, 192, 192, 0.8)', 'rgba(255, 99, 132, 0.8)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        rtl: true,
      },
      title: {
        display: true,
        text: '',
        font: {
          size: 16,
          family: 'IRANSans',
        },
      },
      tooltip: {
        rtl: true,
        bodyFont: {
          family: 'IRANSans',
        },
        titleFont: {
          family: 'IRANSans',
        },
      },
    } as const,
  };

  const lineChartOptions: ChartOptions<'line'> = {
    ...commonChartOptions,
    scales: {
      x: {
        type: 'category',
        ticks: {
          font: {
            family: 'IRANSans',
          },
        },
      },
      y: {
        type: 'linear',
        ticks: {
          font: {
            family: 'IRANSans',
          },
          callback: function (value) {
            if (selectedReportType === 'sales') {
              return new Intl.NumberFormat('fa-IR', {
                style: 'currency',
                currency: 'IRT',
                minimumFractionDigits: 0,
              }).format(Number(value));
            }
            return value;
          }
        },
      },
    },
  };

  const barChartOptions: ChartOptions<'bar'> = {
    ...commonChartOptions,
    scales: {
      x: {
        type: 'category',
        ticks: {
          font: {
            family: 'IRANSans',
          },
        },
      },
      y: {
        type: 'linear',
        ticks: {
          font: {
            family: 'IRANSans',
          },
          callback: function (value) {
            if (selectedReportType === 'users') {
              return value.toString();
            }
            return value;
          }
        },
      },
    },
  };

  const pieChartOptions: ChartOptions<'pie'> = {
    ...commonChartOptions,
    plugins: {
      ...commonChartOptions.plugins,
      legend: {
        position: 'right',
        rtl: true,
      },
    },
  };

  const formatCurrency = (amount: number, currency: string = 'IRT') => {
    return new Intl.NumberFormat('fa-IR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const downloadReport = (format: 'pdf' | 'excel' | 'csv') => {
    alert(`گزارش ${selectedReportType} با فرمت ${format.toUpperCase()} در حال دانلود است... (این یک شبیه‌سازی است)`);
    // در اینجا منطق واقعی برای تولید و دانلود فایل را پیاده‌سازی می‌کنید
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-right">
        داشبورد گزارشات <span className="text-purple-600">📈</span>
      </h1>

      {/* بخش فیلترها و تنظیمات */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <div className="flex flex-wrap justify-end items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label htmlFor="endDate" className="text-gray-700">تا تاریخ:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-right"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="startDate" className="text-gray-700">از تاریخ:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-right"
            />
          </div>

          <select
            value={selectedReportType}
            onChange={(e) => setSelectedReportType(e.target.value as typeof selectedReportType)}
            className="p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-right"
          >
            <option value="sales">گزارش فروش</option>
            <option value="users">گزارش کاربران</option>
            <option value="transactions">گزارش تراکنش‌ها</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => downloadReport('pdf')}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 flex items-center gap-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              PDF
            </button>
            <button
              onClick={() => downloadReport('excel')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 flex items-center gap-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path></svg>
              Excel
            </button>
          </div>
        </div>
      </div>

      {/* بخش نمایش نمودارها */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {selectedReportType === 'sales' && (
          <div className="bg-white p-6 rounded-xl shadow-lg h-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-right">
              گزارش فروش روزانه
            </h2>
            <Line
              options={{
                ...lineChartOptions,
                plugins: {
                  ...(lineChartOptions.plugins ?? {}),
                  title: {
                    ...(lineChartOptions.plugins?.title ?? {}),
                    text: 'روند فروش در بازه زمانی انتخابی',
                  },
                },
              }}
              data={salesChartData}
            />
          </div>
        )}

        {selectedReportType === 'users' && (
          <div className="bg-white p-6 rounded-xl shadow-lg h-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-right">
              گزارش کاربران جدید
            </h2>
            <Bar
              options={{
                ...barChartOptions,
                plugins: {
                  ...(barChartOptions.plugins ?? {}),
                  title: {
                    ...(barChartOptions.plugins?.title ?? {}),
                    text: 'تعداد کاربران جدید ثبت‌نام شده',
                  },
                },
              }}
              data={usersChartData}
            />
          </div>
        )}

        {selectedReportType === 'transactions' && (
          <div className="bg-white p-6 rounded-xl shadow-lg h-96 flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-right w-full">
              خلاصه وضعیت تراکنش‌ها
            </h2>
            <div className="h-64 w-64">
              <Pie
                options={{
                  ...pieChartOptions,
                  plugins: {
                    ...(pieChartOptions.plugins ?? {}),
                    title: {
                      ...(pieChartOptions.plugins?.title ?? {}),
                      text: 'نسبت تراکنش‌های موفق و ناموفق',
                    },
                  },
                }}
                data={transactionPieData}
              />
            </div>
          </div>
        )}


        {/* می‌توانید یک کامپوننت دیگر برای نمایش داده‌های جدول اضافه کنید که بر اساس selectedReportType تغییر کند */}
        <div className="bg-white p-6 rounded-xl shadow-lg lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-right">جزئیات گزارش {selectedReportType === 'sales' ? 'فروش' : selectedReportType === 'users' ? 'کاربران' : 'تراکنش‌ها'}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm text-right">
              <thead>
                <tr className="bg-gray-50 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6">تاریخ</th>
                  {selectedReportType === 'sales' && <th className="py-3 px-6">مجموع فروش</th>}
                  {selectedReportType === 'users' && <th className="py-3 px-6">کاربران جدید</th>}
                  {selectedReportType === 'transactions' && (
                    <>
                      <th className="py-3 px-6">تراکنش‌های موفق</th>
                      <th className="py-3 px-6">تراکنش‌های ناموفق</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item.date} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-6">{new Date(item.date).toLocaleDateString('fa-IR')}</td>
                      {selectedReportType === 'sales' && <td className="py-3 px-6">{formatCurrency(item.totalSales)}</td>}
                      {selectedReportType === 'users' && <td className="py-3 px-6">{item.newUsers}</td>}
                      {selectedReportType === 'transactions' && (
                        <>
                          <td className="py-3 px-6 text-green-600 font-medium">{item.successfulTransactions}</td>
                          <td className="py-3 px-6 text-red-600 font-medium">{item.failedTransactions}</td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={selectedReportType === 'sales' || selectedReportType === 'users' ? 2 : 3} className="py-6 text-center text-gray-500">
                      داده‌ای برای این بازه و نوع گزارش یافت نشد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;