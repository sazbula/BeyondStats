import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Utensils, Train, Wifi, Heart, ShoppingBag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const items = [
  { id: "rent", name: "Monthly Rent", price: 800, icon: Home },
  { id: "food", name: "Groceries", price: 300, icon: Utensils },
  { id: "transport", name: "Transport Pass", price: 80, icon: Train },
  { id: "internet", name: "Internet", price: 50, icon: Wifi },
  { id: "healthcare", name: "Healthcare", price: 150, icon: Heart },
  { id: "clothing", name: "Clothing", price: 100, icon: ShoppingBag },
];

interface PurchasingPowerGameProps {
  onComplete: () => void;
}

export function PurchasingPowerGame({ onComplete }: PurchasingPowerGameProps) {
  const [selectedGender, setSelectedGender] = useState<"man" | "woman">("man");
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  
  // Simulated income difference (women earn ~82% of men on average)
  const baseIncome = 2000;
  const income = selectedGender === "man" ? baseIncome : baseIncome * 0.82;
  const spent = purchasedItems.reduce((sum, id) => {
    const item = items.find(i => i.id === id);
    return sum + (item?.price || 0);
  }, 0);
  const remaining = income - spent;

  const handlePurchase = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item && remaining >= item.price && !purchasedItems.includes(itemId)) {
      setPurchasedItems([...purchasedItems, itemId]);
    }
  };

  const resetGame = () => {
    setPurchasedItems([]);
  };

  const switchGender = (gender: "man" | "woman") => {
    setSelectedGender(gender);
    setPurchasedItems([]);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Gender Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-secondary rounded-2xl p-1 inline-flex">
          <button
            onClick={() => switchGender("man")}
            className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
              selectedGender === "man"
                ? "bg-card shadow-md text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            As a Man
          </button>
          <button
            onClick={() => switchGender("woman")}
            className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
              selectedGender === "woman"
                ? "bg-card shadow-md text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            As a Woman
          </button>
        </div>
      </div>

      {/* Budget Display */}
      <motion.div
        layout
        className="stat-card mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Monthly Income</p>
            <p className="text-2xl font-display font-bold text-foreground">
              ${income.toFixed(0)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Remaining</p>
            <motion.p
              key={remaining}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className={`text-2xl font-display font-bold ${
                remaining < 0 ? "text-stat-negative" : "text-stat-positive"
              }`}
            >
              ${remaining.toFixed(0)}
            </motion.p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(spent / income) * 100}%` }}
            className={`h-full rounded-full transition-all ${
              spent > income ? "bg-stat-negative" : "accent-gradient"
            }`}
          />
        </div>
      </motion.div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {items.map((item) => {
          const isPurchased = purchasedItems.includes(item.id);
          const canAfford = remaining >= item.price;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => handlePurchase(item.id)}
              disabled={isPurchased || !canAfford}
              whileHover={!isPurchased && canAfford ? { scale: 1.02 } : {}}
              whileTap={!isPurchased && canAfford ? { scale: 0.98 } : {}}
              className={`stat-card text-left transition-all ${
                isPurchased
                  ? "opacity-50 cursor-not-allowed"
                  : canAfford
                  ? "hover:shadow-lg cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-accent-foreground" />
                </div>
                {isPurchased && (
                  <div className="w-6 h-6 rounded-full bg-stat-positive flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
              <p className="font-medium text-foreground mb-1">{item.name}</p>
              <p className="text-lg font-display font-bold text-primary">
                ${item.price}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* Result Message */}
      <AnimatePresence>
        {purchasedItems.length >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="stat-card border-2 border-primary/20"
          >
            <h3 className="text-lg font-display font-semibold text-foreground mb-2">
              What This Shows
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              {selectedGender === "woman"
                ? "With an 18% lower income, women must make harder choices about basic necessities. This gap compounds over a lifetime, affecting savings, retirement, and quality of life."
                : "Try switching to 'As a Woman' to see how the same expenses become more challenging with a lower average income."}
            </p>
            <div className="flex gap-3">
              <Button onClick={resetGame} variant="outline">
                Reset
              </Button>
              <Button onClick={onComplete}>
                See Results
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
