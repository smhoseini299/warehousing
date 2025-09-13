import React, { useState, useEffect } from 'react';
import { FaBoxes, FaBoxOpen, FaExclamationTriangle, FaTimesCircle, FaPlus, FaSearch } from 'react-icons/fa'; // For icons

// --- Mock Data (for demonstration) ---
interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  lastUpdated: string;
}

const mockProducts: Product[] = [
  { id: 'P001', name: 'لپ تاپ ایسوس', category: 'الکترونیک', stock: 25, minStock: 10, price: 25000000, lastUpdated: '2023-10-26' },
  { id: 'P002', name: 'ماوس وایرلس', category: 'الکترونیک', stock: 120, minStock: 50, price: 800000, lastUpdated: '2023-10-25' },
  { id: 'P003', name: 'مانیتور ال جی', category: 'الکترونیک', stock: 8, minStock: 5, price: 12000000, lastUpdated: '2023-10-26' },
  { id: 'P004', name: 'کیبورد مکانیکال', category: 'الکترونیک', stock: 15, minStock: 10, price: 1500000, lastUpdated: '2023-10-24' },
  { id: 'P005', name: 'هدفون بلوتوث', category: 'الکترونیک', stock: 50, minStock: 20, price: 3000000, lastUpdated: '2023-10-26' },
  { id: 'P006', name: 'پرینتر جوهرافشان', category: 'الکترونیک', stock: 3, minStock: 2, price: 7000000, lastUpdated: '2023-10-23' },
  { id: 'P007', name: 'هارد اکسترنال', category: 'ذخیره سازی', stock: 30, minStock: 15, price: 4000000, lastUpdated: '2023-10-25' },
  { id: 'P008', name: 'روتر وای فای', category: 'شبکه', stock: 40, minStock: 15, price: 1800000, lastUpdated: '2023-10-24' },
  { id: 'P009', name: 'مودم ADSL', category: 'شبکه', stock: 0, minStock: 5, price: 1000000, lastUpdated: '2023-10-26' }, // Out of stock
  { id: 'P010', name: 'کابل HDMI', category: 'جانبی', stock: 200, minStock: 100, price: 150000, lastUpdated: '2023-10-25' },
  { id: 'P011', name: 'فلش مموری ۳۲ گیگ', category: 'ذخیره سازی', stock: 7, minStock: 10, price: 300000, lastUpdated: '2023-10-26' }, // Low stock
  { id: 'P012', name: 'پاور بانک', category: 'شارژر', stock: 18, minStock: 10, price: 700000, lastUpdated: '2023-10-26' },
];

const InventoryPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('همه');
  const [sortKey, setSortKey] = useState<keyof Product>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1500);
  }, []);

  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.stock > 0).length;
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= p.minStock).length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;

  const categories = ['همه', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'همه' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const handleSort = (key: keyof Product) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const renderSortIndicator = (key: keyof Product) => {
    if (sortKey === key) {
      return sortDirection === 'asc' ? ' 🔼' : ' 🔽';
    }
    return '';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR', { style: 'currency', currency: 'IRR' }).format(price);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-6 py-4 bg-gray-50 min-h-screen">
      <div className="flex flex-col space-y-4 max-w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 px-2 sm:px-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 sm:mb-0 flex items-center">
            <FaBoxes className="inline-block align-middle text-blue-600 ml-2 text-2xl sm:text-3xl" />
            مدیریت موجودی انبار
          </h1>
          <button
            onClick={() => alert('افزودن محصول جدید...')}
            className="w-full sm:w-auto flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow-lg transform transition duration-300 ease-in-out hover:scale-105"
          >
            <FaPlus className="ml-2" />
            افزودن محصول جدید
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 px-2 sm:px-0 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-4 sm:p-6 rounded-xl shadow-md h-24 sm:h-32">
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-2 sm:mb-4"></div>
                <div className="h-4 sm:h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Inventory Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 px-2 sm:px-0 mb-6">
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border-b-4 border-blue-500 hover:shadow-xl transition-shadow duration-300 flex items-center justify-between">
                <div>
                  <h2 className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">کل محصولات</h2>
                  <p className="text-lg sm:text-4xl font-bold text-blue-600">{totalProducts}</p>
                </div>
                <FaBoxes className="text-blue-400 text-2xl sm:text-5xl opacity-20" />
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border-b-4 border-green-500 hover:shadow-xl transition-shadow duration-300 flex items-center justify-between">
                <div>
                  <h2 className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">محصولات موجود</h2>
                  <p className="text-lg sm:text-4xl font-bold text-green-600">{inStockProducts}</p>
                </div>
                <FaBoxOpen className="text-green-400 text-2xl sm:text-5xl opacity-20" />
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border-b-4 border-yellow-500 hover:shadow-xl transition-shadow duration-300 flex items-center justify-between">
                <div>
                  <h2 className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">محصولات کم</h2>
                  <p className="text-lg sm:text-4xl font-bold text-yellow-600">{lowStockProducts}</p>
                </div>
                <FaExclamationTriangle className="text-yellow-400 text-2xl sm:text-5xl opacity-20" />
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border-b-4 border-red-500 hover:shadow-xl transition-shadow duration-300 flex items-center justify-between">
                <div>
                  <h2 className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">محصولات تمام شده</h2>
                  <p className="text-lg sm:text-4xl font-bold text-red-600">{outOfStockProducts}</p>
                </div>
                <FaTimesCircle className="text-red-400 text-2xl sm:text-5xl opacity-20" />
              </div>
            </div>

            {/* Search, Filter & Chart Section */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mb-6 mx-2 sm:mx-0">
              <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 border-b pb-2">فیلتر و جستجو</h3>
              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-3 sm:gap-6 items-end">
                {/* Search Input */}
                <div className="relative w-full col-span-2">
                  <label htmlFor="search" className="sr-only">جستجو</label>
                  <input
                    id="search"
                    type="text"
                    placeholder="جستجو بر اساس نام یا کد محصول..."
                    className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-500 transition duration-200"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); // Reset pagination on search
                    }}
                  />
                  <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                </div>

                {/* Category Filter */}
                <div className="w-full">
                  <label htmlFor="categoryFilter" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">فیلتر بر اساس دسته بندی:</label>
                  <select
                    id="categoryFilter"
                    className="w-full pl-3 pr-10 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 transition duration-200 appearance-none bg-white bg-no-repeat bg-[length:1.5rem] bg-[right_0.75rem_center]"
                    value={filterCategory}
                    onChange={(e) => {
                      setFilterCategory(e.target.value);
                      setCurrentPage(1); // Reset pagination on filter
                    }}
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")` }}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Products List */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mx-2 sm:mx-0">
              <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 border-b pb-2">لیست محصولات</h3>
              
              {/* Mobile Product Cards */}
              <div className="block sm:hidden space-y-4">
                {filteredProducts.length === 0 ? (
                  <div className="text-center text-gray-600 py-8 text-sm">
                    <p>هیچ محصولی با معیارهای جستجوی شما یافت نشد.</p>
                  </div>
                ) : (
                  currentProducts.map((product) => (
                    <div 
                      key={product.id} 
                      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-sm flex-grow">{product.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold mr-2
                          ${product.stock === 0 ? 'bg-red-100 text-red-800' :
                            product.stock <= product.minStock ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'}`}>
                          {product.stock === 0 ? 'اتمام موجودی' :
                           product.stock <= product.minStock ? 'کم' : 'موجود'}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 w-1/3">دسته بندی:</span>
                          <span className="text-right w-2/3">{product.category}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 w-1/3">موجودی:</span>
                          <span className="text-right w-2/3">{product.stock}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 w-1/3">قیمت:</span>
                          <span className="text-right w-2/3">{formatPrice(product.price)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 w-1/3">آخرین بروزرسانی:</span>
                          <span className="text-right w-2/3">{new Date(product.lastUpdated).toLocaleDateString('fa-IR')}</span>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <button className="text-blue-600 hover:text-blue-900 w-1/2 text-center">ویرایش</button>
                          <div className="border-l border-gray-300 h-4 mx-2"></div>
                          <button className="text-red-600 hover:text-red-900 w-1/2 text-center">حذف</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                {filteredProducts.length === 0 ? (
                  <div className="text-center text-gray-600 py-8 text-lg">
                    <p>هیچ محصولی با معیارهای جستجوی شما یافت نشد.</p>
                  </div>
                ) : (
                  <table className="w-full bg-white text-right">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          className="px-2 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-900 transition-colors"
                          onClick={() => handleSort('name')}
                        >
                          نام محصول {renderSortIndicator('name')}
                        </th>
                        <th
                          className="px-2 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-900 transition-colors"
                          onClick={() => handleSort('category')}
                        >
                          دسته بندی {renderSortIndicator('category')}
                        </th>
                        <th
                          className="px-2 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-900 transition-colors"
                          onClick={() => handleSort('stock')}
                        >
                          موجودی {renderSortIndicator('stock')}
                        </th>
                        <th
                          className="px-2 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-900 transition-colors"
                          onClick={() => handleSort('price')}
                        >
                          قیمت (ریال) {renderSortIndicator('price')}
                        </th>
                        <th className="px-2 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          وضعیت
                        </th>
                        <th className="px-2 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          آخرین بروزرسانی
                        </th>
                        <th className="relative px-2 sm:px-6 py-3">
                          <span className="sr-only">عملیات</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {product.name}
                          </td>
                          <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {product.category}
                          </td>
                          <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${product.stock === 0 ? 'bg-red-100 text-red-800' :
                               product.stock <= product.minStock ? 'bg-yellow-100 text-yellow-800' :
                               'bg-green-100 text-green-800'}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatPrice(product.price)}
                          </td>
                          <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm">
                            {product.stock === 0 && <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">اتمام موجودی</span>}
                            {product.stock > 0 && product.stock <= product.minStock && <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">کم</span>}
                            {product.stock > product.minStock && <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">موجود</span>}
                          </td>
                          <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(product.lastUpdated).toLocaleDateString('fa-IR')}
                          </td>
                          <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 ml-4">ویرایش</button>
                            <button className="text-red-600 hover:text-red-900">حذف</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-4">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-full sm:w-auto p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    قبلی
                  </button>
                  <div className="flex flex-wrap justify-center gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => paginate(i + 1)}
                        aria-current={currentPage === i + 1 ? 'page' : undefined}
                        className={`p-2 w-10 h-10 rounded-lg text-sm ${
                          currentPage === i + 1
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-full sm:w-auto p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    بعدی
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;