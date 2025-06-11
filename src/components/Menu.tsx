import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { MenuItem } from "@/pages/Index";

type MenuProps = {
  onAddToCart: (item: MenuItem) => void;
};

// Default menu items (will be loaded only once)
const defaultMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Nasi Goreng Spesial",
    description: "Nasi goreng dengan telur, ayam, dan sayuran segar",
    price: 25000,
    category: 'food',
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    name: "Mie Ayam Bakso",
    description: "Mie ayam dengan bakso sapi dan pangsit goreng",
    price: 20000,
    category: 'food',
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    name: "Gado-gado",
    description: "Sayuran segar dengan bumbu kacang dan kerupuk",
    price: 18000,
    category: 'food',
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop"
  },
  {
    id: 4,
    name: "Ayam Geprek",
    description: "Ayam crispy dengan sambal geprek pedas",
    price: 22000,
    category: 'food',
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&h=300&fit=crop"
  },
  {
    id: 5,
    name: "Soto Ayam",
    description: "Soto ayam dengan telur rebus dan emping",
    price: 19000,
    category: 'food',
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop"
  },
  {
    id: 6,
    name: "Rendang Daging",
    description: "Rendang daging sapi dengan nasi putih",
    price: 30000,
    category: 'food',
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop"
  },
  {
    id: 7,
    name: "Gudeg Jogja",
    description: "Gudeg tradisional dengan ayam dan telur",
    price: 28000,
    category: 'food',
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop"
  },
  {
    id: 8,
    name: "Nasi Uduk",
    description: "Nasi uduk dengan lauk pauk lengkap",
    price: 15000,
    category: 'food',
    image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop"
  },
  {
    id: 9,
    name: "Rawon Surabaya",
    description: "Rawon daging dengan kerupuk dan sambal",
    price: 26000,
    category: 'food',
    image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=300&fit=crop"
  },
  {
    id: 10,
    name: "Pecel Lele",
    description: "Lele goreng dengan sambal pecel dan lalapan",
    price: 17000,
    category: 'food',
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop"
  },
  {
    id: 11,
    name: "Bakso Malang",
    description: "Bakso dengan mie, tahu, dan telur",
    price: 18000,
    category: 'food',
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop"
  },
  {
    id: 12,
    name: "Nasi Padang",
    description: "Nasi putih dengan berbagai lauk Padang",
    price: 32000,
    category: 'food',
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop"
  },
  {
    id: 13,
    name: "Ketoprak Jakarta",
    description: "Ketoprak dengan tahu, lontong, dan bumbu kacang",
    price: 16000,
    category: 'food',
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop"
  },
  {
    id: 14,
    name: "Sate Kambing",
    description: "Sate kambing dengan bumbu kacang dan lontong",
    price: 35000,
    category: 'food',
    image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop"
  },
  {
    id: 15,
    name: "Ikan Bakar",
    description: "Ikan bakar dengan sambal dan lalapan",
    price: 28000,
    category: 'food',
    image: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=300&fit=crop"
  },
  {
    id: 16,
    name: "Bebek Goreng",
    description: "Bebek goreng kremes dengan sambal",
    price: 30000,
    category: 'food',
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&h=300&fit=crop"
  },
  {
    id: 17,
    name: "Nasi Kuning",
    description: "Nasi kuning dengan ayam dan sambal goreng",
    price: 20000,
    category: 'food',
    image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop"
  },
  {
    id: 18,
    name: "Rujak Cingur",
    description: "Rujak tradisional dengan cingur dan kerupuk",
    price: 15000,
    category: 'food',
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop"
  },
  {
    id: 19,
    name: "Martabak Telur",
    description: "Martabak telur dengan daging cincang",
    price: 25000,
    category: 'food',
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop"
  },
  {
    id: 20,
    name: "Nasi Liwet",
    description: "Nasi liwet dengan ayam dan sayuran",
    price: 22000,
    category: 'food',
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop"
  },
  // Minuman (20 items)
  {
    id: 21,
    name: "Es Teh Manis",
    description: "Teh manis dingin yang menyegarkan",
    price: 5000,
    category: 'drink',
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop"
  },
  {
    id: 22,
    name: "Es Jeruk",
    description: "Jus jeruk segar dengan es batu",
    price: 8000,
    category: 'drink',
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop"
  },
  {
    id: 23,
    name: "Kopi Hitam",
    description: "Kopi hitam panas tanpa gula",
    price: 7000,
    category: 'drink',
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop"
  },
  {
    id: 24,
    name: "Es Campur",
    description: "Es campur dengan buah-buahan dan sirup",
    price: 12000,
    category: 'drink',
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop"
  },
  {
    id: 25,
    name: "Jus Alpukat",
    description: "Jus alpukat segar dengan susu kental manis",
    price: 15000,
    category: 'drink',
    image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&h=300&fit=crop"
  },
  {
    id: 26,
    name: "Es Kelapa Muda",
    description: "Air kelapa muda segar dengan daging kelapa",
    price: 10000,
    category: 'drink',
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&h=300&fit=crop"
  },
  {
    id: 27,
    name: "Cappuccino",
    description: "Kopi cappuccino dengan foam susu tebal",
    price: 18000,
    category: 'drink',
    image: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&h=300&fit=crop"
  },
  {
    id: 28,
    name: "Es Cendol",
    description: "Cendol dengan santan dan gula merah",
    price: 12000,
    category: 'drink',
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop"
  },
  {
    id: 29,
    name: "Jus Mangga",
    description: "Jus mangga segar tanpa pemanis buatan",
    price: 13000,
    category: 'drink',
    image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=300&fit=crop"
  },
  {
    id: 30,
    name: "Es Dawet",
    description: "Dawet dengan santan dan gula jawa",
    price: 10000,
    category: 'drink',
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop"
  },
  {
    id: 31,
    name: "Latte",
    description: "Kopi latte dengan art foam yang cantik",
    price: 20000,
    category: 'drink',
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop"
  },
  {
    id: 32,
    name: "Es Buah",
    description: "Campuran buah segar dengan es serut",
    price: 15000,
    category: 'drink',
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop"
  },
  {
    id: 33,
    name: "Jus Tomat",
    description: "Jus tomat segar dengan sedikit garam",
    price: 9000,
    category: 'drink',
    image: "https://images.unsplash.com/photo-1594736797933-d0404501ba2f?w=400&h=300&fit=crop"
  },
  {
    id: 34,
    name: "Es Doger",
    description: "Es doger dengan tape, kelapa, dan sirup",
    price: 12000,
    category: 'drink',
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop"
  },
  {
    id: 35,
    name: "Americano",
    description: "Kopi americano hitam yang kuat",
    price: 15000,
    category: 'drink',
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop"
  },
  {
    id: 36,
    name: "Jus Wortel",
    description: "Jus wortel segar kaya vitamin A",
    price: 11000,
    category: 'drink',
    image: "https://images.unsplash.com/photo-1623428187425-5008d0f0bf5e?w=400&h=300&fit=crop"
  },
  {
    id: 37,
    name: "Es Teler",
    description: "Es teler dengan alpukat, kelapa, dan cincau",
    price: 18000,
    category: 'drink',
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop"
  },
  {
    id: 38,
    name: "Mocktail Berry",
    description: "Mocktail segar dengan campuran berry",
    price: 22000,
    category: 'drink',
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop"
  },
  {
    id: 39,
    name: "Es Cincau",
    description: "Es cincau hitam dengan sirup dan santan",
    price: 8000,
    category: 'drink',
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop"
  },
  {
    id: 40,
    name: "Jus Semangka",
    description: "Jus semangka segar tanpa biji",
    price: 10000,
    category: 'drink',
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop"
  }
];

export const Menu = ({ onAddToCart }: MenuProps) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'food' | 'drink'>('all');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    // Initialize default menu items if not exists
    const savedDefaultItems = localStorage.getItem("defaultMenuItems");
    if (!savedDefaultItems) {
      localStorage.setItem("defaultMenuItems", JSON.stringify(defaultMenuItems));
    }

    // Load current menu items (either default or admin-modified)
    const savedMenu = localStorage.getItem("menuItems");
    if (savedMenu) {
      setMenuItems(JSON.parse(savedMenu));
    } else {
      setMenuItems(defaultMenuItems);
      localStorage.setItem("menuItems", JSON.stringify(defaultMenuItems));
    }
  }, []);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm rounded-3xl my-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Menu Makanan & Minuman</h1>
        <p className="text-xl text-gray-600">Pilih makanan dan minuman favorit Anda</p>
      </div>

      <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as 'all' | 'food' | 'drink')} className="mb-8">
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto bg-white/10 backdrop-blur border border-white/20">
          <TabsTrigger value="all" className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-primary">Semua</TabsTrigger>
          <TabsTrigger value="food" className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-primary">Makanan</TabsTrigger>
          <TabsTrigger value="drink" className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-primary">Minuman</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur border border-white/20 hover:bg-white/95 hover:scale-105">
            <CardHeader className="p-0">
              <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <div className="p-4">
                <CardTitle className="text-lg text-gray-800">{item.name}</CardTitle>
                <CardDescription className="text-gray-600">{item.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-primary">
                  {formatPrice(item.price)}
                </span>
                <Button onClick={() => onAddToCart(item)} className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg">
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
