import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Package } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Product } from '../types';
import Card from '../components/UI/Card';
import Modal from '../components/UI/Modal';

export default function ProductsPage() {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const categories = [...new Set(state.products.map(p => p.category))];
  
  const filteredProducts = state.products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('آیا از حذف این کالا مطمئن هستید؟')) {
      dispatch({ type: 'DELETE_PRODUCT', payload: productId });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">مدیریت کالاها</h1>
            <p className="mt-2 text-gray-600">مدیریت و نمایش تمام کالاهای انبار</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Plus className="h-4 w-4 ml-2" />
            افزودن کالا جدید
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="جستجوی نام یا کد کالا..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
          >
            <option value="">همه دسته‌بندی‌ها</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex space-x-reverse space-x-2">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">کد کالا:</span>
                  <span className="font-medium">{product.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">دسته‌بندی:</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">موجودی:</span>
                  <span className={`font-medium ${product.currentStock <= product.minStock ? 'text-red-600' : 'text-green-600'}`}>
                    {product.currentStock}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">محل نگهداری:</span>
                  <span className="font-medium">{product.location}</span>
                </div>
                {product.supplier && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">تأمین‌کننده:</span>
                    <span className="font-medium">{product.supplier}</span>
                  </div>
                )}
              </div>

              {product.currentStock <= product.minStock && (
                <div className="mt-3 p-2 bg-red-50 rounded-md">
                  <p className="text-xs text-red-600">⚠️ موجودی کم - حداقل: {product.minStock}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">هیچ کالایی یافت نشد</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedCategory ? 'فیلتر خود را تغییر دهید' : 'اولین کالای خود را اضافه کنید'}
            </p>
          </div>
        </Card>
      )}

      {/* Add/Edit Product Modal */}
      <ProductModal
        isOpen={isAddModalOpen || editingProduct !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
      />
    </div>
  );
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const { dispatch } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: '',
    currentStock: 0,
    minStock: 0,
    location: '',
    supplier: ''
  });

  React.useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        code: product.code,
        category: product.category,
        currentStock: product.currentStock,
        minStock: product.minStock,
        location: product.location,
        supplier: product.supplier || ''
      });
    } else {
      setFormData({
        name: '',
        code: '',
        category: '',
        currentStock: 0,
        minStock: 0,
        location: '',
        supplier: ''
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData: Product = {
      id: product?.id || Date.now().toString(),
      ...formData,
      createdAt: product?.createdAt || new Date()
    };

    if (product) {
      dispatch({ type: 'UPDATE_PRODUCT', payload: productData });
    } else {
      dispatch({ type: 'ADD_PRODUCT', payload: productData });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'ویرایش کالا' : 'افزودن کالا جدید'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نام کالا
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              کد کالا
            </label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              دسته‌بندی
            </label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              محل نگهداری
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              موجودی فعلی
            </label>
            <input
              type="number"
              min="0"
              required
              value={formData.currentStock}
              onChange={(e) => setFormData({ ...formData, currentStock: parseInt(e.target.value) || 0 })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              حداقل موجودی
            </label>
            <input
              type="number"
              min="0"
              required
              value={formData.minStock}
              onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            تأمین‌کننده
          </label>
          <input
            type="text"
            value={formData.supplier}
            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
          />
        </div>
        
        <div className="flex justify-end space-x-reverse space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            انصراف
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            {product ? 'ویرایش کالا' : 'افزودن کالا'}
          </button>
        </div>
      </form>
    </Modal>
  );
}