
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { MenuItem } from "@/pages/Index";

type MenuProps = {
  onAddToCart: (item: MenuItem) => void;
};

const menuItems: MenuItem[] = [
  // Makanan
  {
    id: 1,
    name: "Nasi Goreng Spesial",
    description: "Nasi goreng dengan telur, ayam, dan sayuran segar",
    price: 25000,
    category: 'food',
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Mie Ayam Bakso",
    description: "Mie ayam dengan bakso sapi dan pangsit goreng",
    price: 20000,
    category: 'food',
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Gado-gado",
    description: "Sayuran segar dengan bumbu kacang dan kerupuk",
    price: 18000,
    category: 'food',
    image: "/placeholder.svg"
  },
  {
    id: 4,
    name: "Ayam Geprek",
    description: "Ayam crispy dengan sambal geprek pedas",
    price: 22000,
    category: 'food',
    image: "/placeholder.svg"
  },
  {
    id: 5,
    name: "Soto Ayam",
    description: "Soto ayam dengan telur rebus dan emping",
    price: 19000,
    category: 'food',
    image: "/placeholder.svg"
  },
  {
    id: 6,
    name: "Rendang Daging",
    description: "Rendang daging sapi dengan nasi putih",
    price: 30000,
    category: 'food',
    image: "/placeholder.svg"
  },
  // Minuman
  {
    id: 7,
    name: "Es Teh Manis",
    description: "Teh manis dingin yang menyegarkan",
    price: 5000,
    category: 'drink',
    image: "/placeholder.svg"
  },
  {
    id: 8,
    name: "Es Jeruk",
    description: "Jus jeruk segar dengan es batu",
    price: 8000,
    category: 'drink',
    image: "/placeholder.svg"
  },
  {
    id: 9,
    name: "Kopi Hitam",
    description: "Kopi hitam panas tanpa gula",
    price: 7000,
    category: 'drink',
    image: "/placeholder.svg"
  },
  {
    id: 10,
    name: "Es Campur",
    description: "Es campur dengan buah-buahan dan sirup",
    price: 12000,
    category: 'drink',
    image: "/placeholder.svg"
  },
  {
    id: 11,
    name: "Jus Alpukat",
    description: "Jus alpukat segar dengan susu kental manis",
    price: 15000,
    category: 'drink',
    image: "/placeholder.svg"
  },
  {
    id: 12,
    name: "Es Kelapa Muda",
    description: "Air kelapa muda segar dengan daging kelapa",
    price: 10000,
    category: 'drink',
    image: "/placeholder.svg"
  }
];

export const Menu = ({ onAddToCart }: MenuProps) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'food' | 'drink'>('all');

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Menu Makanan & Minuman</h1>
        <p className="text-xl text-muted-foreground">Pilih makanan dan minuman favorit Anda</p>
      </div>

      <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as 'all' | 'food' | 'drink')} className="mb-8">
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="food">Makanan</TabsTrigger>
          <TabsTrigger value="drink">Minuman</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <CardTitle className="text-xl">{item.name}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(item.price)}
                </span>
                <Button onClick={() => onAddToCart(item)} className="gap-2">
                  <Plus size={16} />
                  Tambah
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
