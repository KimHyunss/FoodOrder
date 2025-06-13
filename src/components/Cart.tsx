
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { CartItem } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

type CartProps = {
  items: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onClearCart: () => void;
  onPlaceOrder: (customerName: string, customerPhone: string, customerAddress: string, paymentMethod: string) => void;
};

export const Cart = ({ items, onUpdateQuantity, onClearCart, onPlaceOrder }: CartProps) => {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [language, setLanguage] = useState("id");
  const { toast } = useToast();

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    // Auto-fill user information from logged in account
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      setCustomerName(userData.username || "");
      setCustomerPhone(userData.phone || "");
      setCustomerAddress(userData.address || "");
    }
  }, []);

  const getLanguageText = () => {
    if (language === "en") {
      return {
        cart: "Shopping Cart",
        emptyCart: "Your cart is empty",
        startShopping: "Start shopping to add items to your cart",
        quantity: "Quantity",
        remove: "Remove",
        total: "Total",
        clearCart: "Clear Cart",
        orderInformation: "Order Information",
        customerName: "Full Name",
        customerPhone: "Phone Number",
        customerAddress: "Delivery Address",
        paymentMethod: "Payment Method",
        selectPayment: "Select payment method",
        cash: "Cash",
        debitCard: "Debit Card",
        placeOrder: "Place Order",
        fillAllFields: "Please fill in all fields",
        orderPlaced: "Order placed successfully!"
      };
    }
    return {
      cart: "Keranjang Belanja",
      emptyCart: "Keranjang Anda kosong",
      startShopping: "Mulai berbelanja untuk menambahkan item ke keranjang",
      quantity: "Jumlah",
      remove: "Hapus",
      total: "Total",
      clearCart: "Kosongkan Keranjang",
      orderInformation: "Informasi Pemesanan",
      customerName: "Nama Lengkap",
      customerPhone: "Nomor Telepon",
      customerAddress: "Alamat Pengiriman",
      paymentMethod: "Metode Pembayaran",
      selectPayment: "Pilih metode pembayaran",
      cash: "Tunai",
      debitCard: "Kartu Debit",
      placeOrder: "Pesan Sekarang",
      fillAllFields: "Mohon isi semua field",
      orderPlaced: "Pesanan berhasil dibuat!"
    };
  };

  const text = getLanguageText();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePlaceOrder = () => {
    if (!customerName || !customerPhone || !customerAddress || !paymentMethod) {
      toast({
        title: language === "en" ? "Incomplete Information" : "Informasi Tidak Lengkap",
        description: text.fillAllFields,
        variant: "destructive"
      });
      return;
    }

    onPlaceOrder(customerName, customerPhone, customerAddress, paymentMethod);
    toast({
      title: language === "en" ? "Success!" : "Berhasil!",
      description: text.orderPlaced,
    });
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur">
          <CardContent className="p-8 text-center">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">{text.emptyCart}</h2>
            <p className="text-gray-600 dark:text-gray-400">{text.startShopping}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cart Items */}
        <div>
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-gray-800 dark:text-gray-100">{text.cart}</CardTitle>
                <Button variant="outline" onClick={onClearCart} className="dark:border-gray-600 dark:text-gray-300">
                  <Trash2 size={16} className="mr-2" />
                  {text.clearCart}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 dark:text-gray-100">{item.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="dark:border-gray-600 dark:text-gray-300"
                    >
                      <Minus size={14} />
                    </Button>
                    <span className="w-8 text-center text-gray-800 dark:text-gray-100">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="dark:border-gray-600 dark:text-gray-300"
                    >
                      <Plus size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateQuantity(item.id, 0)}
                      className="dark:border-gray-600 dark:text-gray-300"
                    >
                      {text.remove}
                    </Button>
                  </div>
                </div>
              ))}
              <Separator className="dark:border-gray-600" />
              <div className="flex justify-between items-center font-bold text-lg">
                <span className="text-gray-800 dark:text-gray-100">{text.total}:</span>
                <span className="text-primary dark:text-primary-foreground">{formatPrice(total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Information */}
        <div>
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-gray-800 dark:text-gray-100">{text.orderInformation}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="dark:text-gray-300">{text.customerName}</Label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={text.customerName}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
              </div>
              <div>
                <Label className="dark:text-gray-300">{text.customerPhone}</Label>
                <Input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder={text.customerPhone}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
              </div>
              <div>
                <Label className="dark:text-gray-300">{text.customerAddress}</Label>
                <Input
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder={text.customerAddress}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
              </div>
              <div>
                <Label className="dark:text-gray-300">{text.paymentMethod}</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                    <SelectValue placeholder={text.selectPayment} />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                    <SelectItem value="cash" className="dark:text-gray-200">{text.cash}</SelectItem>
                    <SelectItem value="debit" className="dark:text-gray-200">{text.debitCard}</SelectItem>
                    <SelectItem value="ovo" className="dark:text-gray-200">OVO</SelectItem>
                    <SelectItem value="dana" className="dark:text-gray-200">DANA</SelectItem>
                    <SelectItem value="gopay" className="dark:text-gray-200">GoPay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handlePlaceOrder} className="w-full">
                {text.placeOrder}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
