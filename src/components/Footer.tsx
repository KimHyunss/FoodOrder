
import { useState, useEffect } from "react";
import { Utensils, Phone, Mail, MapPin } from "lucide-react";

export const Footer = () => {
  const [language, setLanguage] = useState("id");
  const [footerInfo, setFooterInfo] = useState({
    companyName: "FoodOrder",
    description: "",
    phone: "+62 812-3456-7890",
    email: "info@foodorder.com",
    address: "Jakarta, Indonesia",
    operationalHours: {
      weekdays: "08:00 - 22:00",
      weekend: "10:00 - 23:00"
    }
  });

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    // Load footer info from localStorage
    const savedFooterInfo = localStorage.getItem("footerInfo");
    if (savedFooterInfo) {
      setFooterInfo(JSON.parse(savedFooterInfo));
    }
  }, []);

  const getLanguageText = () => {
    if (language === "en") {
      return {
        description: footerInfo.description || "Trusted online food and beverage ordering platform. Enjoy your favorite food easily and quickly.",
        contact: "Contact",
        operationalHours: "Operational Hours",
        weekdays: "Monday - Friday:",
        weekend: "Saturday - Sunday:",
        copyright: "All rights reserved."
      };
    }
    return {
      description: footerInfo.description || "Platform pemesanan makanan dan minuman online terpercaya. Nikmati kelezatan makanan favorit Anda dengan mudah dan cepat.",
      contact: "Kontak",
      operationalHours: "Jam Operasional",
      weekdays: "Senin - Jumat:",
      weekend: "Sabtu - Minggu:",
      copyright: "Semua hak dilindungi."
    };
  };

  const text = getLanguageText();

  return (
    <footer className="bg-card dark:bg-gray-800 border-t border-border dark:border-gray-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Utensils className="h-8 w-8 text-primary mr-2" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {footerInfo.companyName}
              </span>
            </div>
            <p className="text-muted-foreground dark:text-gray-400 mb-4">
              {text.description}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 dark:text-gray-200">{text.contact}</h3>
            <div className="space-y-2 text-muted-foreground dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>{footerInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>{footerInfo.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>{footerInfo.address}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 dark:text-gray-200">{text.operationalHours}</h3>
            <div className="space-y-2 text-muted-foreground dark:text-gray-400">
              <div>{text.weekdays} {footerInfo.operationalHours.weekdays}</div>
              <div>{text.weekend} {footerInfo.operationalHours.weekend}</div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border dark:border-gray-700 mt-8 pt-8 text-center text-muted-foreground dark:text-gray-400">
          <p>&copy; 2024 {footerInfo.companyName}. {text.copyright}</p>
        </div>
      </div>
    </footer>
  );
};
