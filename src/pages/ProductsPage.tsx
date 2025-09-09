import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useApp } from '../contexts/AppContext';
import Card from '../components/UI/Card';
import Modal from '../components/UI/Modal';
import { Product } from '../types';

const ProductsPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('آیا از حذف این محصول اطمینان دارید؟')) {
      dispatch({ type: 'DELETE_PRODUCT', payload: productId });
    }
  };

  const handleSubmitProduct = (product: Product) => {
    if (selectedProduct) {
      dispatch({ type: 'UPDATE_PRODUCT', payload: product });
    } else {
      dispatch({ type: 'ADD_PRODUCT', payload: { ...product, id: Date.now().toString() } });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">محصولات</h1>
        <button 
          onClick={handleAddProduct}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <PlusIcon className="w-5 h-5 ml-2" />
          افزودن محصول جدید
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.products.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
              <div className="flex space-x-2 reverse-space-x">
                <button 
                  onClick={() => handleEditProduct(product)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDeleteProduct(product.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="space-y-2 text-gray-600">
              <p>کد محصول: {product.code}</p>
              <p>دسته‌بندی: {product.category}</p>
              <div className="flex justify-between">
                <span>موجودی: {product.currentStock}</span>
                <span 
                  className={`
                    px-2 py-1 rounded-full text-xs 
                    ${product.currentStock <= product.minStock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}
                  `}
                >
                  {product.currentStock <= product.minStock ? 'کمبود موجودی' : 'موجود'}
                </span>
              </div>
              <p>محل نگهداری: {product.location}</p>
              <p>تامین‌کننده: {product.supplier}</p>
            </div>
          </Card>
        ))}
      </div>

      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          title={selectedProduct ? 'ویرایش محصول' : 'افزودن محصول جدید'}
        >
          <ProductForm 
            initialProduct={selectedProduct} 
            onSubmit={handleSubmitProduct} 
            onCancel={() => setIsModalOpen(false)} 
          />
        </Modal>
      )}
    </div>
  );
};

interface ProductFormProps {
  initialProduct?: Product | null;
  onSubmit: (product: Product) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialProduct, onSubmit, onCancel }) => {
  const [product, setProduct] = useState<Product>({
    id: initialProduct?.id || '',
    name: initialProduct?.name || '',
    code: initialProduct?.code || '',
    category: initialProduct?.category || '',
    currentStock: initialProduct?.currentStock || 0,
    minStock: initialProduct?.minStock || 0,
    location: initialProduct?.location || '',
    supplier: initialProduct?.supplier || '',
    createdAt: initialProduct?.createdAt || new Date()
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === 'currentStock' || name === 'minStock' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(product);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">نام محصول</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">کد محصول</label>
          <input
            type="text"
            name="code"
            value={product.code}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">دسته‌بندی</label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">انتخاب دسته‌بندی</option>
            <option value="الکترونیک">الکترونیک</option>
            <option value="اداری">اداری</option>
            <option value="تجهیزات">تجهیزات</option>
          </select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">تامین‌کننده</label>
          <input
            type="text"
            name="supplier"
            value={product.supplier}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">موجودی فعلی</label>
          <input
            type="number"
            name="currentStock"
            value={product.currentStock}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">حداقل موجودی</label>
          <input
            type="number"
            name="minStock"
            value={product.minStock}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">محل نگهداری</label>
        <input
          type="text"
          name="location"
          value={product.location}
          onChange={handleChange}
          required
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

export default ProductsPage;