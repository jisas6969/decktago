'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  'In Production': 'bg-blue-100 text-blue-800',
  'In Transit': 'bg-purple-100 text-purple-800',
  'Out for Delivery': 'bg-orange-100 text-orange-800',
  Delivered: 'bg-green-100 text-green-800',
};

export default function DashboardPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const { metrics, loading: metricsLoading } = useDashboardMetrics();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Please Log In</h1>
            <p className="text-lg text-slate-600 mb-8">You need to log in to view the dashboard</p>
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Log In</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation user={user} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Sales Dashboard</h1>
          <p className="text-slate-600">Monitor your store performance and metrics</p>
        </div>

        {metricsLoading ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading dashboard...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Total Sales */}
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium mb-1">Total Sales</p>
                    <p className="text-3xl font-bold text-blue-600">
                      ${metrics.totalSales.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-3xl text-blue-200">💰</div>
                </div>
                <p className="text-slate-500 text-xs mt-3">
                  {metrics.completedOrders} completed orders
                </p>
              </Card>

              {/* Total Orders */}
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium mb-1">Total Orders</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {metrics.totalOrders}
                    </p>
                  </div>
                  <div className="text-3xl text-purple-200">📦</div>
                </div>
                <p className="text-slate-500 text-xs mt-3">
                  {metrics.pendingOrders} pending
                </p>
              </Card>

              {/* Average Order Value */}
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium mb-1">Avg Order Value</p>
                    <p className="text-3xl font-bold text-green-600">
                      ${metrics.averageOrderValue.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-3xl text-green-200">📊</div>
                </div>
                <p className="text-slate-500 text-xs mt-3">
                  Per order
                </p>
              </Card>

              {/* Completed Orders */}
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium mb-1">Completed Orders</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {metrics.completedOrders}
                    </p>
                  </div>
                  <div className="text-3xl text-orange-200">✅</div>
                </div>
                <p className="text-slate-500 text-xs mt-3">
                  Out for delivery or delivered
                </p>
              </Card>
            </div>

            {/* Recent Orders */}
            <div>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Recent Orders</h2>
                  <Link href="/orders">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>

                {metrics.recentOrders.length === 0 ? (
                  <p className="text-slate-600 text-center py-8">No orders yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-4 font-semibold text-slate-700">
                            Order ID
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700">
                            Customer
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700">
                            Date
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-700">
                            Status
                          </th>
                          <th className="text-right py-3 px-4 font-semibold text-slate-700">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {metrics.recentOrders.map((order) => (
                          <tr
                            key={order.id}
                            className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                          >
                            <td className="py-4 px-4 font-mono text-sm">
                              #{order.id.slice(0, 8)}
                            </td>
                            <td className="py-4 px-4">
                              {order.shippingAddress.fullName}
                            </td>
                            <td className="py-4 px-4 text-sm text-slate-600">
                              {order.createdAt instanceof Date
                                ? order.createdAt.toLocaleDateString()
                                : new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  statusColors[order.status] ||
                                  'bg-slate-100 text-slate-800'
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right font-semibold">
                              ${order.total.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
