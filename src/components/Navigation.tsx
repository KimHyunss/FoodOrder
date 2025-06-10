
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Brand
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#" className="hover:text-primary transition-colors duration-200">Product</a>
              <a href="#" className="hover:text-primary transition-colors duration-200">Features</a>
              <a href="#" className="hover:text-primary transition-colors duration-200">Pricing</a>
              <a href="#" className="hover:text-primary transition-colors duration-200">About</a>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost">Sign in</Button>
            <Button>Get Started</Button>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#" className="block px-3 py-2 hover:text-primary transition-colors">Product</a>
            <a href="#" className="block px-3 py-2 hover:text-primary transition-colors">Features</a>
            <a href="#" className="block px-3 py-2 hover:text-primary transition-colors">Pricing</a>
            <a href="#" className="block px-3 py-2 hover:text-primary transition-colors">About</a>
            <div className="pt-4 pb-3 border-t border-border">
              <Button variant="ghost" className="w-full mb-2">Sign in</Button>
              <Button className="w-full">Get Started</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
