import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">داشبورد</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">موجودی انبار</h2>
          <p className="text-2xl text-blue-600">۱۲۳۴ عدد</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">فروش ماهانه</h2>
          <p className="text-2xl text-green-600">۴,۵۶۷,۸۹۰ تومان</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">سفارشات جدید</h2>
          <p className="text-2xl text-yellow-600">۲۳ سفارش</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">مشتریان فعال</h2>
          <p className="text-2xl text-purple-600">۱۵۶ مشتری</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;