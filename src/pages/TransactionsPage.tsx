import React, { useState } from 'react';
import { Plus, Minus, Search, Calendar } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Transaction } from '../types';
import Card from '../components/UI/Card';
import Modal from '../components/UI/Modal';

export default function TransactionsPage() {
  const { state, dispatch } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'in' | 'out'>('in');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');

  const filteredTransactions = state.transactions.filter(transaction => {
    const matchesSearch = transaction.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProduct = selectedProduct === '' || transaction.productId === selectedProduct;
    return matchesSearch && matchesProduct;
  });

  const openAddModal = (type: 'in' | 'out') => {
    setTransactionType(type);
    setIsAddModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ورود و خروج کالا</h1>
            <p className="mt-2 text-gray-600">ثبت تراکنش‌های ورود و خروج انبار</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-reverse space-x-3">
            <button
              onClick={() => openAddModal('in')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <Plus className="h-4 w-4 ml-2" />
              ورود کالا
            </button>
            <button
              onClick={() => openAddModal('out')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <Minus className="h-4 w-4 ml-2" />
              خروج کالا
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="جستجوی نام کالا..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
            />
          </div>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
          >
            <option value="">همه کالاها</option>
            {state.products.map(product => (
              <option key={product.id} value={product.id}>{product.name}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Transactions List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  نوع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  کالا
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  مقدار
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاریخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  طرف تراکنش
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  یادداشت
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(transaction => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === 'in'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transaction.type === 'in' ? (
                          <>
                            <Plus className="h-3 w-3 ml-1" />
                            ورود
                          </>
                        ) : (
                          <>
                            <Minus className="h-3 w-3 ml-1" />
                            خروج
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 ml-2" />
                        {new Date(transaction.date).toLocaleDateString('fa-IR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.supplier || transaction.customer || transaction.destination || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.notes || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    هیچ تراکنشی یافت نشد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Transaction Modal */}
      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        type={transactionType}
      />
    </div>
  );
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'in' | 'out';
}

function TransactionModal({ isOpen, onClose, type }: TransactionModalProps) {
  const { state, dispatch } = useApp();
  const [formData, setFormData] = useState({
    productId: '',
    quantity: 0,
    supplier: '',
    customer: '',
    destination: '',
    notes: ''
  });

  React.useEffect(() => {
    setFormData({
      productId: '',
      quantity: 0,
      supplier: '',
      customer: '',
      destination: '',
      notes: ''
    });
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedProduct = state.products.find(p => p.id === formData.productId);
    if (!selectedProduct) return;

    const transaction: Transaction = {
      id: Date.now().toString(),
      productId: formData.productId,
      productName: selectedProduct.name,
      type,
      quantity: formData.quantity,
      date: new Date(),
      supplier: type === 'in' ? formData.supplier : undefined,
      customer: type === 'out' ? formData.customer : undefined,
      destination: type === 'out' ? formData.destination : undefined,
      notes: formData.notes
    };

    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
    onClose();
  };

  const selectedProduct = state.products.find(p => p.id === formData.productId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={type === 'in' ? 'ثبت ورود کالا' : 'ثبت خروج کالا'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            انتخاب کالا
          </label>
          <select
            required
            value={formData.productId}
            onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
          >
            <option value="">انتخاب کنید...</option>
            {state.products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} - موجودی: {product.currentStock}
              </option>
            ))}
          </select>
        </div>

        {selectedProduct && type === 'out' && formData.quantity > selectedProduct.currentStock && (
          <div className="p-3 bg-red-50 rounded-md">
            <p className="text-sm text-red-600">
              ⚠️ تعداد درخواستی ({formData.quantity}) از موجودی فعلی ({selectedProduct.currentStock}) بیشتر است!
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            تعداد
          </label>
          <input
            type="number"
            min="1"
            required
            value={formData.quantity || ''}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
          />
        </div>

        {type === 'in' ? (
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                مشتری
              </label>
              <input
                type="text"
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                مقصد
              </label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            یادداشت
          </label>
          <textarea
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
            placeholder="یادداشت اختیاری..."
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
            disabled={selectedProduct && type === 'out' && formData.quantity > selectedProduct.currentStock}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
              type === 'in'
                ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {type === 'in' ? 'ثبت ورود' : 'ثبت خروج'}
          </button>
        </div>
      </form>
    </Modal>
  );
}