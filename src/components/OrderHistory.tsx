import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, Truck, Package } from "lucide-react";
import { Order } from "@/pages/Index";

type OrderHistoryProps = {
  orders: Order[];
};

export const OrderHistory = ({ orders }: OrderHistoryProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />;
      case 'preparing':
        return <Package size={16} />;
      case 'ready':
        return <CheckCircle size={16} />;
      case 'delivered':
        return <Truck size={16} />;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Menunggu Konfirmasi';
      case 'preparing':
        return 'Sedang Diproses';
      case 'ready':
        return 'Siap Diambil';
      case 'delivered':
        return 'Selesai';
    }
  };

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'preparing':
        return 'default';
      case 'ready':
        return 'default';
      case 'delivered':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-16 bg-white/90 backdrop-blur rounded-3xl shadow-lg border border-gray-200">
          <Package size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Belum Ada Pesanan</h2>
          <p className="text-gray-600">Pesanan Anda akan muncul di sini</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Riwayat Pesanan</h1>
        <p className="text-xl text-gray-600">Lihat status dan riwayat pesanan Anda</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="bg-white/95 backdrop-blur border border-gray-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-gray-800">
                  Pesanan #{order.id}
                </CardTitle>
                <Badge variant={getStatusVariant(order.status)} className="gap-1">
                  {getStatusIcon(order.status)}
                  {getStatusText(order.status)}
                </Badge>
              </div>
              <div className="text-sm text-gray-600">
                <p>Waktu Pesanan: {formatTime(order.orderTime)}</p>
                <p>Nama: {order.customerName}</p>
                <p>Telepon: {order.customerPhone}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <div>
                      <span className="font-medium text-gray-800">{item.name}</span>
                      <span className="text-gray-600 ml-2">x{item.quantity}</span>
                    </div>
                    <span className="font-semibold text-gray-800">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 text-lg font-bold">
                  <span className="text-gray-800">Total:</span>
                  <span className="text-primary">{formatPrice(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
