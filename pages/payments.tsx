import React from 'react';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';

// Example invoice data (replace with real data from backend)
const exampleInvoices = [
  { id: 'inv_001', amount: 500, status: 'unpaid', dueDate: '2026-01-20', type: 'case' as const, caseRelated: 'DUI Case #123' },
  { id: 'inv_002', amount: 250, status: 'paid', dueDate: '2025-12-15', type: 'retainer' as const, caseRelated: 'Monthly Retainer' },
  { id: 'inv_003', amount: 1000, status: 'unpaid', dueDate: '2026-02-10', type: 'case' as const, caseRelated: 'Drug Offense #456' },
];

const Payments: React.FC = () => {
  // Simulate user invoices (replace with fetch from backend)
  const [invoices, setInvoices] = React.useState(exampleInvoices);
  const [activeTab, setActiveTab] = React.useState<'all' | 'cases' | 'retainers'>('all');

  // Filter invoices based on active tab
  const filteredInvoices = React.useMemo(() => {
    if (activeTab === 'all') return invoices;
    if (activeTab === 'cases') return invoices.filter(inv => inv.type === 'case');
    if (activeTab === 'retainers') return invoices.filter(inv => inv.type === 'retainer');
    return invoices;
  }, [invoices, activeTab]);

  // Stripe checkout handler (replace with real Stripe integration)
  const handlePay = (invoiceId: string) => {
    // Redirect to Stripe checkout (replace with real implementation)
    window.location.href = `/api/stripe/checkout?invoiceId=${invoiceId}`;
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-16">
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto text-white">
            <h1 className="text-3xl font-light mb-8">Payments & Invoices</h1>
            
            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-white/20">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                  activeTab === 'all'
                    ? 'border-blue-500 text-white'
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('cases')}
                className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                  activeTab === 'cases'
                    ? 'border-blue-500 text-white'
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                Cases
              </button>
              <button
                onClick={() => setActiveTab('retainers')}
                className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                  activeTab === 'retainers'
                    ? 'border-blue-500 text-white'
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                Retainers
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {filteredInvoices.length === 0 ? (
                <div className="text-white/60">No invoices found.</div>
              ) : (
                filteredInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    className={`rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between transition-all duration-200 shadow-sm
                      ${inv.status === 'unpaid'
                        ? 'border-2 border-blue-500 bg-white/5'
                        : 'border-2 border-white bg-white/5'}
                    `}
                  >
                    <div>
                      <div className="font-semibold text-lg mb-1">Invoice #{inv.id}</div>
                      <div className="text-white/70 text-sm mb-1">Invoice Date: {new Date(inv.dueDate).toLocaleDateString()}</div>
                      <div className="text-white/70 text-sm mb-1">Case Related: {inv.caseRelated ?? 'General'}</div>
                      <div className="text-white/70 text-sm mb-2">Due: {new Date(inv.dueDate).toLocaleDateString()}</div>
                      <div className="text-xl font-bold">${inv.amount.toFixed(2)}</div>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-3">
                      {inv.status === 'unpaid' ? (
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
                          onClick={() => handlePay(inv.id)}
                        >
                          Pay
                        </button>
                      ) : (
                        <>
                          <span className="text-white font-semibold bg-white/10 px-4 py-2 rounded-lg">Paid</span>
                          <button
                            className="bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-lg font-medium transition-all "
                            onClick={() => alert('Receipt view not implemented in mockup.')}
                          >
                            View Receipt
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Payments;
