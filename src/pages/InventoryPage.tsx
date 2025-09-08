import React from 'react';

const InventoryPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">موجودی انبار</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">صفحه موجودی انبار در حال توسعه است.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">کل محصولات</h2>
            <p className="text-2xl text-blue-600">۱۲۳</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">محصولات موجود</h2>
            <p className="text-2xl text-green-600">۹۸</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">محصولات کم</h2>
            <p className="text-2xl text-yellow-600">۱۵</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">محصولات تمام شده</h2>
            <p className="text-2xl text-red-600">۱۰</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
