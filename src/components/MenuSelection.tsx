
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Utensils, Coffee, Grid3X3 } from "lucide-react";

type MenuSelectionProps = {
  onMenuSelect: (category: 'all' | 'food' | 'drink') => void;
  language: string;
};

export const MenuSelection = ({ onMenuSelect, language }: MenuSelectionProps) => {
  const getLanguageText = () => {
    if (language === "en") {
      return {
        title: "Choose Your Favorite Menu",
        subtitle: "Select from our delicious collection",
        allMenu: "All Menu",
        food: "Food",
        drinks: "Drinks",
        allDesc: "Browse all our delicious offerings",
        foodDesc: "Main dishes and appetizers",
        drinkDesc: "Refreshing beverages"
      };
    }
    return {
      title: "Pilih Menu Favorit Anda",
      subtitle: "Pilih dari koleksi lezat kami",
      allMenu: "Semua Menu",
      food: "Makanan",
      drinks: "Minuman",
      allDesc: "Jelajahi semua penawaran lezat kami",
      foodDesc: "Hidangan utama dan pembuka",
      drinkDesc: "Minuman menyegarkan"
    };
  };

  const text = getLanguageText();

  const menuCategories = [
    {
      id: 'all',
      title: text.allMenu,
      description: text.allDesc,
      icon: Grid3X3,
      gradient: "from-blue-500 to-purple-600",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop"
    },
    {
      id: 'food',
      title: text.food,
      description: text.foodDesc,
      icon: Utensils,
      gradient: "from-orange-500 to-red-600",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop"
    },
    {
      id: 'drink',
      title: text.drinks,
      description: text.drinkDesc,
      icon: Coffee,
      gradient: "from-green-500 to-teal-600",
      image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop"
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white">
            {text.title}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {text.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {menuCategories.map((category) => (
            <Card
              key={category.id}
              className="group cursor-pointer transform hover:scale-105 transition-all duration-300 overflow-hidden border-0 shadow-2xl"
              onClick={() => onMenuSelect(category.id as 'all' | 'food' | 'drink')}
            >
              <CardContent className="p-0 relative">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-80`}></div>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                  <category.icon className="h-16 w-16 mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                  <p className="text-center text-white/90">{category.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
