import React, { useState, useMemo, useRef } from 'react';
import { 
  PlusIcon, 
  EditIcon, 
  TrashIcon, 
  ImageIcon, 
  UploadIcon, 
  PackageIcon, 
  BarChartIcon 
} from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../contexts/AppContext';
import Modal from '../components/UI/Modal';
import Card from '../components/UI/Card';

const ProductManagementPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample product categories
  const categories = [
    'الکترونیک', 
    'لوازم خانگی', 
    'لباس', 
    'ورزشی', 
    'خوراکی', 
    'دیجیتال'
  ];

  // Sample products (replace with actual data source)
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
      createdAt: new Date('2024-01-15'),
      image: {
        url: 'https://example.com/laptop.jpg',
        fileName: 'laptop.jpg'
      },
      description: 'لپ تاپ با کیفیت با پردازنده نسل جدید',
      price: 45000000,
      barcode: '1234567890'
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
      createdAt: new Date('2024-02-01'),
      image: {
        url: 'https://example.com/headphones.jpg',
        fileName: 'headphones.jpg'
      },
      description: 'هدفون بی‌سیم با کیفیت صدای عالی',
      price: 5000000,
      barcode: '0987654321'
    }
  ];

  // Filtered and searched products
  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => 
      (filterCategory ? product.category === filterCategory : true) &&
      (searchTerm 
        ? product.name.includes(searchTerm) || 
          product.code.includes(searchTerm) || 
          product.category.includes(searchTerm)
        : true)
    );
  }, [mockProducts, filterCategory, searchTerm]);

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
      // TODO: Implement actual delete logic
      console.log(`Deleting product with ID: ${productId}`);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedProduct(prev => prev ? {
          ...prev,
          image: {
            url: reader.result as string,
            fileName: file.name
          }
        } : null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">مدیریت محصولات</h1>
        <button 
          onClick={handleAddProduct}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <PlusIcon className="w-5 h-5 ml-2" />
          افزودن محصول جدید
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <div className="flex flex-wrap justify-end items-center gap-4">
          <input
            type="text"
            placeholder="جستجو محصولات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow md:flex-grow-0 md:w-64 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-right"
          />
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-right"
          >
            <option value="">همه دسته‌بندی‌ها</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <div className="relative">
              {product.image?.url ? (
                <img 
                  src={product.image.url} 
                  alt={product.name} 
                  className="w-full h-48 object-cover rounded-t-xl"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-xl">
                  <PackageIcon className="w-12 h-12 text-gray-500" />
                </div>
              )}
              
              <div className="absolute top-2 right-2 flex space-x-2 reverse-space-x">
                <button 
                  onClick={() => handleEditProduct(product)}
                  className="bg-white p-2 rounded-full shadow-md hover:bg-blue-50 transition"
                >
                  <EditIcon className="w-5 h-5 text-blue-600" />
                </button>
                <button 
                  onClick={() => handleDeleteProduct(product.id)}
                  className="bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition"
                >
                  <TrashIcon className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
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
                  <span>دسته‌بندی:</span>
                  <span>{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>موجودی:</span>
                  <span>{product.currentStock} از {product.minStock}</span>
                </div>
                <div className="flex justify-between">
                  <span>محل نگهداری:</span>
                  <span>{product.location}</span>
                </div>
                {product.price && (
                  <div className="flex justify-between">
                    <span>قیمت:</span>
                    <span>
                      {new Intl.NumberFormat('fa-IR', {
                        style: 'currency',
                        currency: 'IRT',
                        minimumFractionDigits: 0,
                      }).format(product.price)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          title={selectedProduct ? 'ویرایش محصول' : 'افزودن محصول جدید'}
        >
          <ProductForm 
            initialProduct={selectedProduct} 
            categories={categories}
            onSubmit={(product) => {
              // TODO: Implement add/edit product logic
              console.log(product);
              setIsModalOpen(false);
            }} 
            onCancel={() => setIsModalOpen(false)}
            onImageUpload={handleImageUpload}
            fileInputRef={fileInputRef}
          />
        </Modal>
      )}

      {/* Hidden file input for image upload */}
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

interface ProductFormProps {
  initialProduct?: Product | null;
  categories: string[];
  onSubmit: (product: Product) => void;
  onCancel: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  initialProduct, 
  categories, 
  onSubmit, 
  onCancel, 
  onImageUpload,
  fileInputRef 
}) => {
  const [product, setProduct] = useState<Partial<Product>>({
    id: initialProduct?.id || '',
    name: initialProduct?.name || '',
    code: initialProduct?.code || '',
    category: initialProduct?.category || '',
    currentStock: initialProduct?.currentStock || 0,
    minStock: initialProduct?.minStock || 0,
    location: initialProduct?.location || '',
    supplier: initialProduct?.supplier || '',
    createdAt: initialProduct?.createdAt || new Date(),
    image: initialProduct?.image,
    description: initialProduct?.description || '',
    price: initialProduct?.price || 0,
    barcode: initialProduct?.barcode || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === 'currentStock' || name === 'minStock' || name === 'price' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(product as Product);
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Image Upload Section */}
      <div className="flex justify-center mb-4">
        <div 
          className="relative w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition"
          onClick={triggerImageUpload}
        >
          {product.image?.url ? (
            <img 
              src={product.image.url} 
              alt="محصول" 
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="flex flex-col items-center">
              <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">آپلود تصویر</span>
            </div>
          )}
          <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2">
            <UploadIcon className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Product Details Form */}
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
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">قیمت (تومان)</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
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
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">توضیحات</label>
        <textarea
          name="description"
          value={product.description}
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

export default ProductManagementPage;
