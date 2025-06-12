
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Minus, Plus, Trash2, ShoppingBag, CreditCard } from "lucide-react";
import { CartItem } from "@/pages/Index";

type CartProps = {
  items: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onClearCart: () => void;
  onPlaceOrder: (customerName: string, customerPhone: string) => void;
};

export const Cart = ({ items, onUpdateQuantity, onClearCart, onPlaceOrder }: CartProps) => {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleOrder = () => {
    if (items.length === 0) return;
    if (!customerName || !customerPhone || !paymentMethod) {
      alert("Mohon lengkapi semua data termasuk metode pembayaran!");
      return;
    }
    onPlaceOrder(customerName, customerPhone);
    setCustomerName("");
    setCustomerPhone("");
    setPaymentMethod("");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white/95 backdrop-blur">
          <CardContent className="py-16 text-center">
            <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Keranjang Kosong</h3>
            <p className="text-gray-600">Tambahkan item dari menu untuk melanjutkan pesanan</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Keranjang Belanja</h1>
        <p className="text-gray-600">Review pesanan Anda sebelum checkout</p>
      </div>

      {/* Cart Items */}
      <Card className="bg-white/95 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-800">Item Pesanan</CardTitle>
            <Button variant="outline" onClick={onClearCart} className="gap-2">
              <Trash2 size={16} />
              Hapus Semua
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600">{formatPrice(item.price)} x {item.quantity}</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus size={16} />
                </Button>
                <span className="w-8 text-center font-semibold text-gray-800">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus size={16} />
                </Button>
                <div className="ml-4 font-bold text-gray-800">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            </div>
          ))}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-xl font-bold">
              <span className="text-gray-800">Total:</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card className="bg-white/95 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-gray-800">Informasi Pemesan</CardTitle>
          <CardDescription className="text-gray-600">Masukkan data untuk pengiriman pesanan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-700">Nama Lengkap</Label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Masukkan nama lengkap"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-700">Nomor Telepon</Label>
              <Input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Masukkan nomor telepon"
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label className="text-gray-700">Metode Pembayaran</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Pilih metode pembayaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Bayar Tunai</SelectItem>
                <SelectItem value="transfer">Transfer Bank</SelectItem>
                <SelectItem value="ewallet">E-Wallet (OVO/GoPay/DANA)</SelectItem>
                <SelectItem value="qris">QRIS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleOrder} 
            className="w-full bg-primary hover:bg-primary/90 gap-2 py-3"
            disabled={!customerName || !customerPhone || !paymentMethod}
          >
            <CreditCard size={20} />
            Pesan Sekarang - {formatPrice(total)}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
