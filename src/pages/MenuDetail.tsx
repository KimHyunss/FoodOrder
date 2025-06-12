
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Minus, ShoppingCart, Utensils } from "lucide-react";
import { MenuItem } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

const MenuDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const savedMenu = localStorage.getItem("menuItems");
    if (savedMenu) {
      const menuItems: MenuItem[] = JSON.parse(savedMenu);
      const item = menuItems.find(item => item.id === Number(id));
      setMenuItem(item || null);
    }
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!menuItem) return;

    // Get existing cart items
    const existingCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    
    // Find if item already exists in cart
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === menuItem.id);
    
    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      existingCart.push({
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: quantity
      });
    }

    localStorage.setItem("cartItems", JSON.stringify(existingCart));
    
    toast({
      title: "Berhasil ditambahkan!",
      description: `${quantity}x ${menuItem.name} telah ditambahkan ke keranjang`,
    });

    // Navigate back to main page with cart tab active
    navigate("/?tab=cart");
  };

  const handleBackToMenu = () => {
    navigate("/");
  };

  if (!menuItem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Menu tidak ditemukan</h2>
          <Button onClick={handleBackToMenu} className="gap-2">
            <ArrowLeft size={16} />
            Kembali ke Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={handleBackToMenu}
                className="mr-4 gap-2"
              >
                <ArrowLeft size={16} />
                Kembali
              </Button>
              <Utensils className="h-8 w-8 text-primary mr-2" />
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                FoodOrder
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white/95 backdrop-blur shadow-xl border border-white/20">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img 
                src={menuItem.image} 
                alt={menuItem.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="p-6">
              <CardHeader className="px-0 pt-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    menuItem.category === 'food' 
                      ? 'bg-orange-100 text-orange-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {menuItem.category === 'food' ? 'Makanan' : 'Minuman'}
                  </span>
                </div>
                <CardTitle className="text-3xl text-gray-800 mb-2">{menuItem.name}</CardTitle>
                <CardDescription className="text-lg text-gray-600 mb-4">
                  {menuItem.description}
                </CardDescription>
                <div className="text-3xl font-bold text-primary mb-6">
                  {formatPrice(menuItem.price)}
                </div>
              </CardHeader>

              <CardContent className="px-0">
                {/* Quantity Selector */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-lg font-medium text-gray-700">Jumlah:</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} />
                    </Button>
                    <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>

                {/* Total Price */}
                <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                  <span className="text-lg font-medium text-gray-700">Total:</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(menuItem.price * quantity)}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <Button 
                  onClick={handleAddToCart}
                  className="w-full gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg text-lg py-6"
                >
                  <ShoppingCart size={20} />
                  Tambah ke Keranjang
                </Button>
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MenuDetail;
