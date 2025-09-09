import React, { useState, useMemo, useRef } from 'react';
import { 
  PlusIcon, 
  DownloadIcon, 
  UploadIcon, 
  RefreshCwIcon, 
  WarehouseIcon, 
  PackageIcon,
  FilterIcon,
  SearchIcon
} from 'lucide-react';
import { Product, Warehouse, InventoryTransaction, InventoryTransactionType } from '../types';
import { useApp } from '../contexts/AppContext';
import Modal from '../components/UI/Modal';
import Card from '../components/UI/Card';

const InventoryManagementPage: React.FC = () => {
  const {  } = useApp();
  const [activeTab, setActiveTab] = useState<'products' | 'transactions' | 'warehouses'>('products');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'IN' | 'OUT' | 'TRANSFER' | 'WAREHOUSE'>('IN');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<InventoryTransactionType | ''>('');

  // Sample data (replace with actual data source)
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'لپ تاپ ایسوس',
      code: 'LAP001',
      category: 'الکترونیک',
      currentStock: 15,
      minStock: 5,
      location: 'انبار A-1',
      supplier: 'شرکت تک‌نولوژی',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'هدفون بی‌سیم',
      code: 'HDP001',
      category: 'دیجیتال',
      currentStock: 30,
      minStock: 10,
      location: 'انبار B-2',
      supplier: 'پخش رایانه',
      createdAt: new Date('2024-02-01')
    }
  ];

  const mockWarehouses: Warehouse[] = [
    {
      id: 'A-1',
      name: 'انبار مرکزی',
      location: 'تهران، خیابان آزادی',
      capacity: 1000,
      currentOccupancy: 650
    },
    {
      id: 'B-2',
      name: 'انبار شرق',
      location: 'مشهد، بلوار امام رضا',
      capacity: 500,
      currentOccupancy: 250
    }
  ];

  const mockTransactions: InventoryTransaction[] = [
    {
      id: '1',
      productId: '1',
      productName: 'لپ تاپ ایسوس',
      type: 'IN',
      quantity: 20,
      sourceWarehouseId: 'A-1',
      supplier: 'شرکت تک‌نولوژی',
      date: new Date('2024-02-15'),
      notes: 'محموله جدید از تولیدکننده'
    },
    {
      id: '2',
      productId: '2',
      productName: 'هدفون بی‌سیم',
      type: 'OUT',
      quantity: 5,
      destinationWarehouseId: 'B-2',
      customer: 'فروشگاه الکترونیک',
      date: new Date('2024-02-20'),
      notes: 'فروش به فروشگاه'
    }
  ];

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter(transaction => 
      (filterType ? transaction.type === filterType : true) &&
      (searchTerm 
        ? transaction.productName.includes(searchTerm) || 
          transaction.supplier?.includes(searchTerm) || 
          transaction.customer?.includes(searchTerm)
        : true)
    );
  }, [mockTransactions, filterType, searchTerm]);

  const handleOpenModal = (type: 'IN' | 'OUT' | 'TRANSFER' | 'WAREHOUSE') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleSubmitTransaction = (transaction: InventoryTransaction) => {
    // TODO: Implement actual transaction logic
    console.log('Transaction submitted:', transaction);
    setIsModalOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
                  <span 
                    className={`
                      px-2 py-1 rounded-full text-xs font-medium 
                      ${product.currentStock <= product.minStock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}
                    `}
                  >
                    {product.currentStock <= product.minStock ? 'کمبود موجودی' : 'موجود'}
                  </span>
                </div>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>کد محصول:</span>
                    <span>{product.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>موجودی:</span>
                    <span>{product.currentStock} از {product.minStock}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>محل نگهداری:</span>
                    <span>{product.location}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );
      
      case 'transactions':
        return (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-2 reverse-space-x">
                <button 
                  onClick={() => handleOpenModal('IN')}
                  className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  <DownloadIcon className="w-5 h-5 ml-2" />
                  ورود کالا
                </button>
                <button 
                  onClick={() => handleOpenModal('OUT')}
                  className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  <UploadIcon className="w-5 h-5 ml-2" />
                  خروج کالا
                </button>
                <button 
                  onClick={() => handleOpenModal('TRANSFER')}
                  className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <RefreshCwIcon className="w-5 h-5 ml-2" />
                  انتقال کالا
                </button>
              </div>
              
              <div className="flex items-center space-x-2 reverse-space-x">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="جستجو تراکنش‌ها..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-right"
                  />
                  <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as InventoryTransactionType | '')}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-right"
                >
                  <option value="">همه تراکنش‌ها</option>
                  <option value="IN">ورودی</option>
                  <option value="OUT">خروجی</option>
                  <option value="TRANSFER">انتقال</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm text-right">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6">محصول</th>
                    <th className="py-3 px-6">نوع تراکنش</th>
                    <th className="py-3 px-6">تعداد</th>
                    <th className="py-3 px-6">تاریخ</th>
                    <th className="py-3 px-6">توضیحات</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-6">{transaction.productName}</td>
                      <td className="py-3 px-6">
                        <span 
                          className={`
                            px-3 py-1 rounded-full text-xs font-medium 
                            ${transaction.type === 'IN' ? 'bg-green-100 text-green-800' : 
                              transaction.type === 'OUT' ? 'bg-red-100 text-red-800' : 
                              'bg-blue-100 text-blue-800'}
                          `}
                        >
                          {transaction.type === 'IN' ? 'ورودی' : 
                           transaction.type === 'OUT' ? 'خروجی' : 
                           'انتقال'}
                        </span>
                      </td>
                      <td className="py-3 px-6">{transaction.quantity}</td>
                      <td className="py-3 px-6">
                        {transaction.date.toLocaleDateString('fa-IR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="py-3 px-6">{transaction.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      
      case 'warehouses':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockWarehouses.map((warehouse) => (
              <Card key={warehouse.id} className="hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <WarehouseIcon className="w-8 h-8 text-gray-600 ml-3" />
                    <h2 className="text-xl font-semibold text-gray-800">{warehouse.name}</h2>
                  </div>
                  <button 
                    onClick={() => handleOpenModal('WAREHOUSE')}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <PlusIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>آدرس:</span>
                    <span>{warehouse.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ظرفیت کل:</span>
                    <span>{warehouse.capacity} واحد</span>
                  </div>
                  <div className="flex justify-between">
                    <span>اشغال شده:</span>
                    <span>{warehouse.currentOccupancy} واحد</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{
                        width: `${(warehouse.currentOccupancy / warehouse.capacity) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">مدیریت موجودی</h1>
        <div className="flex space-x-2 reverse-space-x">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'products' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <PackageIcon className="w-5 h-5 inline-block ml-2" />
            محصولات
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'transactions' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <RefreshCwIcon className="w-5 h-5 inline-block ml-2" />
            تراکنش‌ها
          </button>
          <button
            onClick={() => setActiveTab('warehouses')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'warehouses' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <WarehouseIcon className="w-5 h-5 inline-block ml-2" />
            انبارها
          </button>
        </div>
      </div>

      {renderContent()}

      {/* Modals for different transaction types */}
      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          title={
            modalType === 'IN' ? 'ورود کالا' : 
            modalType === 'OUT' ? 'خروج کالا' : 
            modalType === 'TRANSFER' ? 'انتقال کالا' : 
            'افزودن انبار جدید'
          }
        >
          <InventoryTransactionForm 
            type={modalType}
            products={mockProducts}
            warehouses={mockWarehouses}
            onSubmit={handleSubmitTransaction}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

interface InventoryTransactionFormProps {
  type: 'IN' | 'OUT' | 'TRANSFER' | 'WAREHOUSE';
  products: Product[];
  warehouses: Warehouse[];
  onSubmit: (transaction: InventoryTransaction) => void;
  onCancel: () => void;
}

const InventoryTransactionForm: React.FC<InventoryTransactionFormProps> = ({ 
  type, 
  products, 
  warehouses, 
  onSubmit, 
  onCancel 
}) => {
  const [transaction, setTransaction] = useState<Partial<InventoryTransaction>>({
    type,
    date: new Date(),
    quantity: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTransaction(prev => ({
      ...prev,
      [name]: name === 'quantity' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields based on transaction type
    if (type === 'IN' && !transaction.supplier) {
      alert('لطفاً تامین‌کننده را وارد کنید');
      return;
    }
    
    if (type === 'OUT' && (!transaction.customer && !transaction.department)) {
      alert('لطفاً مشتری یا بخش را وارد کنید');
      return;
    }
    
    if (type === 'TRANSFER' && (!transaction.sourceWarehouseId || !transaction.destinationWarehouseId)) {
      alert('لطفاً انبار مبدأ و مقصد را انتخاب کنید');
      return;
    }

    // Generate unique ID (in real app, this would be handled by backend)
    const newTransaction: InventoryTransaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date()
    } as InventoryTransaction;

    onSubmit(newTransaction);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Product Selection */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">محصول</label>
        <select
          name="productId"
          value={transaction.productId || ''}
          onChange={(e) => {
            const selectedProduct = products.find(p => p.id === e.target.value);
            setTransaction(prev => ({
              ...prev,
              productId: e.target.value,
              productName: selectedProduct?.name
            }));
          }}
          required
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="">انتخاب محصول</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>{product.name}</option>
          ))}
        </select>
      </div>

      {/* Quantity */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">تعداد</label>
        <input
          type="number"
          name="quantity"
          value={transaction.quantity}
          onChange={handleChange}
          required
          min="1"
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      {/* Conditional Fields Based on Transaction Type */}
      {type === 'IN' && (
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">تامین‌کننده</label>
          <input
            type="text"
            name="supplier"
            value={transaction.supplier || ''}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      )}

      {type === 'OUT' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">مشتری</label>
            <input
              type="text"
              name="customer"
              value={transaction.customer || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">بخش</label>
            <input
              type="text"
              name="department"
              value={transaction.department || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      )}

      {type === 'TRANSFER' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">انبار مبدأ</label>
            <select
              name="sourceWarehouseId"
              value={transaction.sourceWarehouseId || ''}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">انتخاب انبار مبدأ</option>
              {warehouses.map(warehouse => (
                <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">انبار مقصد</label>
            <select
              name="destinationWarehouseId"
              value={transaction.destinationWarehouseId || ''}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">انتخاب انبار مقصد</option>
              {warehouses.map(warehouse => (
                <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">توضیحات</label>
        <textarea
          name="notes"
          value={transaction.notes || ''}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <div className="flex justify-end space-x-4 reverse-space-x">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          انصراف
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          ذخیره
        </button>
      </div>
    </form>
  );
};

export default InventoryManagementPage;
