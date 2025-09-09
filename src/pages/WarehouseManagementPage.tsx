import React, { useState, useMemo } from 'react';
import { 
  PlusIcon, 
  WarehouseIcon, 
  BarChart3Icon, 
  EditIcon, 
  TrashIcon, 
  SearchIcon 
} from 'lucide-react';
import { Warehouse, WarehouseReport, Product, InventoryTransaction } from '../types';
import { useApp } from '../contexts/AppContext';
import Modal from '../components/UI/Modal';
import Card from '../components/UI/Card';

const WarehouseManagementPage: React.FC = () => {
  const { } = useApp();
  const [activeView, setActiveView] = useState<'warehouses' | 'reports'>('warehouses');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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
      currentOccupancy: 650,
      manager: {
        name: 'محمد رضایی',
        contactInfo: '09123456789'
      },
      products: [
        { productId: '1', productName: 'لپ تاپ ایسوس', quantity: 50 },
        { productId: '2', productName: 'هدفون بی‌سیم', quantity: 100 }
      ],
      status: 'ACTIVE',
      lastInventoryDate: new Date('2024-02-15')
    },
    {
      id: 'B-2',
      name: 'انبار شرق',
      location: 'مشهد، بلوار امام رضا',
      capacity: 500,
      currentOccupancy: 250,
      manager: {
        name: 'علی احمدی',
        contactInfo: '09987654321'
      },
      products: [
        { productId: '1', productName: 'لپ تاپ ایسوس', quantity: 20 },
        { productId: '2', productName: 'هدفون بی‌سیم', quantity: 50 }
      ],
      status: 'ACTIVE',
      lastInventoryDate: new Date('2024-02-10')
    }
  ];

  const mockWarehouseReports: WarehouseReport[] = [
    {
      warehouseId: 'A-1',
      date: new Date('2024-02-15'),
      totalProducts: 150,
      uniqueProductTypes: 2,
      mostStoredProduct: {
        productId: '2',
        productName: 'هدفون بی‌سیم',
        quantity: 100
      },
      occupancyRate: 65,
      recentTransactions: []
    },
    {
      warehouseId: 'B-2',
      date: new Date('2024-02-10'),
      totalProducts: 70,
      uniqueProductTypes: 2,
      mostStoredProduct: {
        productId: '2',
        productName: 'هدفون بی‌سیم',
        quantity: 50
      },
      occupancyRate: 50,
      recentTransactions: []
    }
  ];

  const filteredWarehouses = useMemo(() => {
    return mockWarehouses.filter(warehouse => 
      warehouse.name.includes(searchTerm) || 
      warehouse.location.includes(searchTerm)
    );
  }, [mockWarehouses, searchTerm]);

  const handleAddWarehouse = () => {
    setSelectedWarehouse(null);
    setIsModalOpen(true);
  };

  const handleEditWarehouse = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsModalOpen(true);
  };

  const handleDeleteWarehouse = (warehouseId: string) => {
    if (window.confirm('آیا از حذف این انبار اطمینان دارید؟')) {
      // TODO: Implement actual delete logic
      console.log(`Deleting warehouse with ID: ${warehouseId}`);
    }
  };

  const renderWarehousesView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredWarehouses.map((warehouse) => (
        <Card key={warehouse.id} className="hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <WarehouseIcon className="w-8 h-8 text-gray-600 ml-3" />
              <h2 className="text-xl font-semibold text-gray-800">{warehouse.name}</h2>
            </div>
            <div className="flex space-x-2 reverse-space-x">
              <button 
                onClick={() => handleEditWarehouse(warehouse)}
                className="text-blue-500 hover:text-blue-700"
              >
                <EditIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleDeleteWarehouse(warehouse.id)}
                className="text-red-500 hover:text-red-700"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-2 text-gray-600">
            <div className="flex justify-between">
              <span>مدیر انبار:</span>
              <span>{warehouse.manager?.name || '-'}</span>
            </div>
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
                className={`h-2.5 rounded-full ${
                  warehouse.currentOccupancy / warehouse.capacity > 0.8 
                    ? 'bg-red-500' 
                    : warehouse.currentOccupancy / warehouse.capacity > 0.5 
                    ? 'bg-yellow-500' 
                    : 'bg-green-500'
                }`}
                style={{
                  width: `${(warehouse.currentOccupancy / warehouse.capacity) * 100}%`
                }}
              ></div>
            </div>
            <div className="flex justify-between mt-2">
              <span>وضعیت:</span>
              <span 
                className={`
                  px-2 py-1 rounded-full text-xs font-medium 
                  ${warehouse.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                    warehouse.status === 'MAINTENANCE' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'}
                `}
              >
                {warehouse.status === 'ACTIVE' ? 'فعال' : 
                 warehouse.status === 'MAINTENANCE' ? 'در حال تعمیر' : 
                 'پر'}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderReportsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockWarehouseReports.map((report) => {
        const warehouse = mockWarehouses.find(w => w.id === report.warehouseId);
        return (
          <Card key={report.warehouseId} className="hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                گزارش انبار {warehouse?.name}
              </h2>
              <span className="text-sm text-gray-600">
                {report.date.toLocaleDateString('fa-IR')}
              </span>
            </div>

            <div className="space-y-2 text-gray-600">
              <div className="flex justify-between">
                <span>تعداد کل محصولات:</span>
                <span>{report.totalProducts}</span>
              </div>
              <div className="flex justify-between">
                <span>تعداد انواع محصولات:</span>
                <span>{report.uniqueProductTypes}</span>
              </div>
              <div className="flex justify-between">
                <span>محصول پرتعدادترین:</span>
                <span>{report.mostStoredProduct.productName}</span>
              </div>
              <div className="flex justify-between">
                <span>نرخ اشغال:</span>
                <span>{report.occupancyRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className={`h-2.5 rounded-full ${
                    report.occupancyRate > 80 
                      ? 'bg-red-500' 
                      : report.occupancyRate > 50 
                      ? 'bg-yellow-500' 
                      : 'bg-green-500'
                  }`}
                  style={{
                    width: `${report.occupancyRate}%`
                  }}
                ></div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">مدیریت انبارها</h1>
        <div className="flex space-x-2 reverse-space-x">
          <button
            onClick={() => setActiveView('warehouses')}
            className={`px-4 py-2 rounded-lg transition ${
              activeView === 'warehouses' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <WarehouseIcon className="w-5 h-5 inline-block ml-2" />
            انبارها
          </button>
          <button
            onClick={() => setActiveView('reports')}
            className={`px-4 py-2 rounded-lg transition ${
              activeView === 'reports' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <BarChart3Icon className="w-5 h-5 inline-block ml-2" />
            گزارشات
          </button>
        </div>
      </div>

      {/* Search and Add Warehouse */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <div className="flex flex-wrap justify-end items-center gap-4">
          <div className="relative flex-grow md:flex-grow-0 md:w-64">
            <input
              type="text"
              placeholder="جستجو انبارها..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-right"
            />
            <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          {activeView === 'warehouses' && (
            <button 
              onClick={handleAddWarehouse}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <PlusIcon className="w-5 h-5 ml-2" />
              افزودن انبار جدید
            </button>
          )}
        </div>
      </div>

      {/* Content View */}
      {activeView === 'warehouses' ? renderWarehousesView() : renderReportsView()}

      {/* Add/Edit Warehouse Modal */}
      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          title={selectedWarehouse ? 'ویرایش انبار' : 'افزودن انبار جدید'}
        >
          <WarehouseForm 
            initialWarehouse={selectedWarehouse} 
            onSubmit={(warehouse) => {
              // TODO: Implement add/edit warehouse logic
              console.log(warehouse);
              setIsModalOpen(false);
            }} 
            onCancel={() => setIsModalOpen(false)} 
          />
        </Modal>
      )}
    </div>
  );
};

interface WarehouseFormProps {
  initialWarehouse?: Warehouse | null;
  onSubmit: (warehouse: Warehouse) => void;
  onCancel: () => void;
}

const WarehouseForm: React.FC<WarehouseFormProps> = ({ 
  initialWarehouse, 
  onSubmit, 
  onCancel 
}) => {
  const [warehouse, setWarehouse] = useState<Partial<Warehouse>>({
    id: initialWarehouse?.id || '',
    name: initialWarehouse?.name || '',
    location: initialWarehouse?.location || '',
    capacity: initialWarehouse?.capacity || 0,
    currentOccupancy: initialWarehouse?.currentOccupancy || 0,
    manager: {
      name: initialWarehouse?.manager?.name || '',
      contactInfo: initialWarehouse?.manager?.contactInfo || ''
    },
    products: initialWarehouse?.products || [],
    status: initialWarehouse?.status || 'ACTIVE',
    lastInventoryDate: initialWarehouse?.lastInventoryDate || new Date()
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested manager fields
    if (name.startsWith('manager.')) {
      const managerField = name.split('.')[1];
      setWarehouse(prev => ({
        ...prev,
        manager: {
          ...prev.manager,
          [managerField]: value
        } as Warehouse['manager']
      }));
      return;
    }

    // Handle other fields
    setWarehouse(prev => ({
      ...prev,
      [name]: name === 'capacity' || name === 'currentOccupancy' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!warehouse.name || !warehouse.location) {
      alert('لطفاً نام و آدرس انبار را وارد کنید');
      return;
    }

    // Validate capacity and occupancy
    if ((warehouse.currentOccupancy ?? 0) > (warehouse.capacity ?? 0)) {
      alert('موجودی انبار نمی‌تواند از ظرفیت کل بیشتر باشد');
      return;
    }

    onSubmit(warehouse as Warehouse);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">نام انبار</label>
          <input
            type="text"
            name="name"
            value={warehouse.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">آدرس</label>
          <input
            type="text"
            name="location"
            value={warehouse.location}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">ظرفیت کل</label>
          <input
            type="number"
            name="capacity"
            value={warehouse.capacity}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">موجودی فعلی</label>
          <input
            type="number"
            name="currentOccupancy"
            value={warehouse.currentOccupancy}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">نام مدیر انبار</label>
          <input
            type="text"
            name="manager.name"
            value={warehouse.manager?.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">شماره تماس مدیر</label>
          <input
            type="text"
            name="manager.contactInfo"
            value={warehouse.manager?.contactInfo}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">وضعیت انبار</label>
        <select
          name="status"
          value={warehouse.status}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="ACTIVE">فعال</option>
          <option value="MAINTENANCE">در حال تعمیر</option>
          <option value="FULL">پر</option>
        </select>
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

export default WarehouseManagementPage;
