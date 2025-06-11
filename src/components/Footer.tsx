
import { Utensils, Phone, Mail, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Utensils className="h-8 w-8 text-primary mr-2" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                FoodOrder
              </span>
            </div>
            <p className="text-muted-foreground mb-4">
              Platform pemesanan makanan dan minuman online terpercaya. 
              Nikmati kelezatan makanan favorit Anda dengan mudah dan cepat.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Kontak</h3>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>+62 812-3456-7890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>info@foodorder.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Jakarta, Indonesia</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Jam Operasional</h3>
            <div className="space-y-2 text-muted-foreground">
              <div>Senin - Jumat: 08:00 - 22:00</div>
              <div>Sabtu - Minggu: 10:00 - 23:00</div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 FoodOrder. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
};
