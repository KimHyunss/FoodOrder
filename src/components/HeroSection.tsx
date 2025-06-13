
import { Button } from "@/components/ui/button";
import { ArrowRight, ChefHat, Clock, Star } from "lucide-react";

type HeroSectionProps = {
  onOrderNow: () => void;
  language: string;
};

export const HeroSection = ({ onOrderNow, language }: HeroSectionProps) => {
  const getLanguageText = () => {
    if (language === "en") {
      return {
        title: "Delicious Food Delivered",
        subtitle: "Fresh ingredients, authentic flavors, delivered to your door",
        orderNow: "Order Now",
        fastDelivery: "Fast Delivery",
        freshIngredients: "Fresh Ingredients",
        topRated: "Top Rated"
      };
    }
    return {
      title: "Makanan Lezat Diantar",
      subtitle: "Bahan segar, cita rasa autentik, diantar ke pintu Anda",
      orderNow: "Pesan Sekarang",
      fastDelivery: "Pengiriman Cepat",
      freshIngredients: "Bahan Segar",
      topRated: "Rating Tinggi"
    };
  };

  const text = getLanguageText();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-20"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
              {text.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {text.subtitle}
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 py-8">
            <div className="flex items-center gap-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full px-6 py-3 shadow-lg">
              <Clock className="h-6 w-6 text-orange-500" />
              <span className="text-gray-800 dark:text-gray-200 font-medium">{text.fastDelivery}</span>
            </div>
            <div className="flex items-center gap-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full px-6 py-3 shadow-lg">
              <ChefHat className="h-6 w-6 text-orange-500" />
              <span className="text-gray-800 dark:text-gray-200 font-medium">{text.freshIngredients}</span>
            </div>
            <div className="flex items-center gap-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full px-6 py-3 shadow-lg">
              <Star className="h-6 w-6 text-orange-500" />
              <span className="text-gray-800 dark:text-gray-200 font-medium">{text.topRated}</span>
            </div>
          </div>

          <Button 
            onClick={onOrderNow}
            className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-6 text-xl rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            {text.orderNow}
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>
      </div>
    </section>
  );
};
