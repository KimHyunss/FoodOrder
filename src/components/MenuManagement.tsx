
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { MenuItem } from "@/pages/Index";

export const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: "",
    description: "",
    price: 0,
    category: 'food',
    image: ""
  });

  useEffect(() => {
    const savedMenu = localStorage.getItem("menuItems");
    if (savedMenu) {
      setMenuItems(JSON.parse(savedMenu));
    } else {
      // Load default menu items
      const defaultItems = JSON.parse(localStorage.getItem("defaultMenuItems") || "[]");
      setMenuItems(defaultItems);
    }
  }, []);

  const saveMenu = (items: MenuItem[]) => {
    setMenuItems(items);
    localStorage.setItem("menuItems", JSON.stringify(items));
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) return;
    
    const item: MenuItem = {
      id: Date.now(),
      name: newItem.name,
      description: newItem.description || "",
      price: Number(newItem.price),
      category: newItem.category as 'food' | 'drink',
      image: newItem.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop"
    };
    
    saveMenu([...menuItems, item]);
    setNewItem({ name: "", description: "", price: 0, category: 'food', image: "" });
    setIsAdding(false);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem({ ...item });
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    
    const updatedItems = menuItems.map(item => 
      item.id === editingItem.id ? editingItem : item
    );
    saveMenu(updatedItems);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: number) => {
    const updatedItems = menuItems.filter(item => item.id !== id);
    saveMenu(updatedItems);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Kelola Menu</h2>
          <p className="text-gray-600">Tambah, edit, atau hapus item menu</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="gap-2">
          <Plus size={16} />
          Tambah Menu Baru
        </Button>
      </div>

      {/* Add New Item Form */}
      {isAdding && (
        <Card className="bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-gray-800">Tambah Menu Baru</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700">Nama Menu</Label>
                <Input
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  placeholder="Masukkan nama menu"
                />
              </div>
              <div>
                <Label className="text-gray-700">Harga</Label>
                <Input
                  type="number"
                  value={newItem.price}
                  onChange={(e) => setNewItem({...newItem, price: Number(e.target.value)})}
                  placeholder="Masukkan harga"
                />
              </div>
              <div>
                <Label className="text-gray-700">Kategori</Label>
                <Select value={newItem.category} onValueChange={(value) => setNewItem({...newItem, category: value as 'food' | 'drink'})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Makanan</SelectItem>
                    <SelectItem value="drink">Minuman</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-700">URL Gambar</Label>
                <Input
                  value={newItem.image}
                  onChange={(e) => setNewItem({...newItem, image: e.target.value})}
                  placeholder="Masukkan URL gambar"
                />
              </div>
            </div>
            <div>
              <Label className="text-gray-700">Deskripsi</Label>
              <Textarea
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                placeholder="Masukkan deskripsi menu"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddItem} className="gap-2">
                <Save size={16} />
                Simpan
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)} className="gap-2">
                <X size={16} />
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Menu Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <Card key={item.id} className="bg-white/95 backdrop-blur">
            {editingItem?.id === item.id ? (
              /* Edit Form */
              <CardContent className="p-4 space-y-3">
                <Input
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                  className="font-semibold"
                />
                <Textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                  className="text-sm"
                />
                <Input
                  type="number"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({...editingItem, price: Number(e.target.value)})}
                />
                <Select 
                  value={editingItem.category} 
                  onValueChange={(value) => setEditingItem({...editingItem, category: value as 'food' | 'drink'})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Makanan</SelectItem>
                    <SelectItem value="drink">Minuman</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={editingItem.image}
                  onChange={(e) => setEditingItem({...editingItem, image: e.target.value})}
                  placeholder="URL Gambar"
                />
                <div className="flex gap-2">
                  <Button onClick={handleSaveEdit} size="sm" className="gap-1">
                    <Save size={14} />
                    Simpan
                  </Button>
                  <Button variant="outline" onClick={() => setEditingItem(null)} size="sm" className="gap-1">
                    <X size={14} />
                    Batal
                  </Button>
                </div>
              </CardContent>
            ) : (
              /* Display Mode */
              <>
                <div className="aspect-video bg-muted overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <Badge variant={item.category === 'food' ? 'default' : 'secondary'}>
                      {item.category === 'food' ? 'Makanan' : 'Minuman'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">{formatPrice(item.price)}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditItem(item)}>
                        <Edit size={14} />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteItem(item.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
