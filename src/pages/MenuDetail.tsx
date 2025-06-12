
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Minus, ShoppingCart, Utensils, Star } from "lucide-react";
import { MenuItem } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

const MenuDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const savedMenu = localStorage.getItem("menuItems");
    if (savedMenu) {
      const menuItems: MenuItem[] = JSON.parse(savedMenu);
      const item = menuItems.find(item => item.id === Number(id));
      setMenuItem(item || null);
    }

    // Load reviews for this item
    const savedReviews = localStorage.getItem(`reviews_${id}`);
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
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

    // Check if user is logged in
    const isUserLoggedIn = localStorage.getItem("userLoggedIn");
    if (!isUserLoggedIn) {
      toast({
        title: "Login diperlukan",
        description: "Anda harus login terlebih dahulu untuk menambahkan ke keranjang",
        variant: "destructive"
      });
      navigate("/user/login");
      return;
    }

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

  const handleSubmitReview = () => {
    const isUserLoggedIn = localStorage.getItem("userLoggedIn");
    if (!isUserLoggedIn) {
      toast({
        title: "Login diperlukan",
        description: "Anda harus login untuk memberikan rating",
        variant: "destructive"
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating diperlukan",
        description: "Pilih rating bintang terlebih dahulu",
        variant: "destructive"
      });
      return;
    }

    const currentUser = localStorage.getItem("currentUser");
    const newReview = {
      user: currentUser,
      rating,
      comment,
      date: new Date()
    };

    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${id}`, JSON.stringify(updatedReviews));

    setRating(0);
    setComment("");
    
    toast({
      title: "Review berhasil ditambahkan!",
      description: "Terima kasih atas rating dan komentar Anda",
    });
  };

  const handleBackToMenu = () => {
    navigate("/");
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
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
              <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
                <Utensils className="h-8 w-8 text-primary mr-2" />
                <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  FoodOrder
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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
                  {reviews.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{getAverageRating()}</span>
                      <span className="text-sm text-gray-500">({reviews.length} review)</span>
                    </div>
                  )}
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
                  className="w-full gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg text-lg py-6 mb-6"
                >
                  <ShoppingCart size={20} />
                  Tambah ke Keranjang
                </Button>

                {/* Rating Section */}
                <div className="border-t pt-6 space-y-4">
                  <h3 className="text-lg font-semibold">Berikan Rating & Komentar</h3>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="hover:scale-110 transition-transform"
                      >
                        <Star 
                          className={`w-8 h-8 ${
                            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tulis komentar Anda (opsional)"
                    className="w-full p-3 border rounded-lg resize-none h-20"
                  />
                  <Button onClick={handleSubmitReview} className="w-full">
                    Kirim Review
                  </Button>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <Card className="bg-white/95 backdrop-blur shadow-xl border border-white/20">
            <CardHeader>
              <CardTitle>Review dari Pelanggan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.map((review, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{review.user}</span>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-gray-600">{review.comment}</p>
                  )}
                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(review.date).toLocaleDateString('id-ID')}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MenuDetail;
