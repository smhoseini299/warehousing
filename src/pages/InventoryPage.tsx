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
    <div className="min-h-screen bg-gray-50 p-6 sm:p-8 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 sm:mb-0">
          <FaBoxes className="inline-block align-middle text-blue-600 mr-3" />
          مدیریت موجودی انبار
        </h1>
        <button
          onClick={() => alert('افزودن محصول جدید...')}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg transform transition duration-300 ease-in-out hover:scale-105"
        >
          <FaPlus className="ml-2" />
          افزودن محصول جدید
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md h-32">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Inventory Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-blue-500 hover:shadow-xl transition-shadow duration-300 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-1">کل محصولات</h2>
                <p className="text-4xl font-bold text-blue-600">{totalProducts}</p>
              </div>
              <FaBoxes className="text-blue-400 text-5xl opacity-20" />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-green-500 hover:shadow-xl transition-shadow duration-300 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-1">محصولات موجود</h2>
                <p className="text-4xl font-bold text-green-600">{inStockProducts}</p>
              </div>
              <FaBoxOpen className="text-green-400 text-5xl opacity-20" />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-yellow-500 hover:shadow-xl transition-shadow duration-300 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-1">محصولات کم</h2>
                <p className="text-4xl font-bold text-yellow-600">{lowStockProducts}</p>
              </div>
              <FaExclamationTriangle className="text-yellow-400 text-5xl opacity-20" />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-red-500 hover:shadow-xl transition-shadow duration-300 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-1">محصولات تمام شده</h2>
                <p className="text-4xl font-bold text-red-600">{outOfStockProducts}</p>
              </div>
              <FaTimesCircle className="text-red-400 text-5xl opacity-20" />
            </div>
          </div>

          {/* Search, Filter & Chart Section */}
          <div className="bg-white p-6 rounded-xl shadow-lg mb-10">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">فیلتر و جستجو</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mb-6">
              {/* Search Input */}
              <div className="relative col-span-2">
                <label htmlFor="search" className="sr-only">جستجو</label>
                <input
                  id="search"
                  type="text"
                  placeholder="جستجو بر اساس نام یا کد محصول..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-500 transition duration-200"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset pagination on search
                  }}
                />
                <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {/* Category Filter */}
              <div>
                <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-1">فیلتر بر اساس دسته بندی:</label>
                <select
                  id="categoryFilter"
                  className="w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 transition duration-200 appearance-none bg-white bg-no-repeat bg-[length:1.5rem] bg-[right_0.75rem_center]" // Custom arrow for select
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

          {/* Products Table */}
          <div className="bg-white p-6 rounded-xl shadow-lg overflow-x-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">لیست محصولات</h3>
            {filteredProducts.length === 0 ? (
              <div className="text-center text-gray-600 py-8 text-lg">
                <p>هیچ محصولی با معیارهای جستجوی شما یافت نشد.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-900 transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      نام محصول {renderSortIndicator('name')}
                    </th>
                    <th
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-900 transition-colors"
                      onClick={() => handleSort('category')}
                    >
                      دسته بندی {renderSortIndicator('category')}
                    </th>
                    <th
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-900 transition-colors"
                      onClick={() => handleSort('stock')}
                    >
                      موجودی {renderSortIndicator('stock')}
                    </th>
                    <th
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-900 transition-colors"
                      onClick={() => handleSort('price')}
                    >
                      قیمت (ریال) {renderSortIndicator('price')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      وضعیت
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      آخرین بروزرسانی
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">عملیات</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${product.stock === 0 ? 'bg-red-100 text-red-800' :
                           product.stock <= product.minStock ? 'bg-yellow-100 text-yellow-800' :
                           'bg-green-100 text-green-800'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {product.stock === 0 && <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">اتمام موجودی</span>}
                        {product.stock > 0 && product.stock <= product.minStock && <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">کم</span>}
                        {product.stock > product.minStock && <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">موجود</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(product.lastUpdated).toLocaleDateString('fa-IR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 ml-4">ویرایش</button>
                        <button className="text-red-600 hover:text-red-900">حذف</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    قبلی
                  </button>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    بعدی
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      نمایش <span className="font-medium">{indexOfFirstProduct + 1}</span> تا <span className="font-medium">{Math.min(indexOfLastProduct, sortedProducts.length)}</span> از{' '}
                      <span className="font-medium">{sortedProducts.length}</span> نتیجه
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Previous</span>
                        {/* Heroicon name: solid/chevron-right */}
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => paginate(i + 1)}
                          aria-current={currentPage === i + 1 ? 'page' : undefined}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                            ${currentPage === i + 1
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="sr-only">Next</span>
                        {/* Heroicon name: solid/chevron-left */}
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </nav>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default InventoryPage;