import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
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
  const [isOrdering, setIsOrdering] = useState(false);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handlePlaceOrder = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      alert("Mohon isi nama dan nomor telepon");
      return;
    }
    onPlaceOrder(customerName, customerPhone);
    setCustomerName("");
    setCustomerPhone("");
    setIsOrdering(false);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-16 bg-white/90 backdrop-blur rounded-3xl shadow-lg border border-gray-200">
          <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Keranjang Kosong</h2>
          <p className="text-gray-600">Tambahkan makanan atau minuman ke keranjang Anda</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Keranjang Belanja</h1>
        <p className="text-xl text-gray-600">Review pesanan Anda sebelum checkout</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-white/95 backdrop-blur border border-gray-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-800">Item Pesanan</CardTitle>
                <Button variant="outline" size="sm" onClick={onClearCart}>
                  <Trash2 size={16} className="mr-2" />
                  Kosongkan
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/70 border-gray-200">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-gray-600">{formatPrice(item.price)}</p>
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
                      <div className="w-20 text-right font-semibold text-gray-800">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-white/95 backdrop-blur border border-gray-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-800">Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-800">Total:</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>

                {!isOrdering ? (
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => setIsOrdering(true)}
                  >
                    Lanjut ke Checkout
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-700">Nama Lengkap</Label>
                      <Input
                        id="name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Masukkan nama Anda"
                        className="bg-white/90 text-gray-800"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-gray-700">Nomor Telepon</Label>
                      <Input
                        id="phone"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Masukkan nomor telepon"
                        className="bg-white/90 text-gray-800"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsOrdering(false)}
                        className="flex-1"
                      >
                        Batal
                      </Button>
                      <Button
                        onClick={handlePlaceOrder}
                        className="flex-1"
                      >
                        Pesan Sekarang
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
