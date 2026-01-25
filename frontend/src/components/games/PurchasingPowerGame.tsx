import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Zap,
  Utensils,
  Train,
  Wifi,
  Heart,
  Droplets,
  GraduationCap,
  CreditCard,
  AlertTriangle,
  Users,
  Shirt,
  Coffee,
  Film,
  Dumbbell,
  Music,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// EU-only baseline + pay gap
const EU_AVG_ANNUAL_SALARY_2024 = 39800; // €
const EU_AVG_MONTHLY_SALARY_2024 = EU_AVG_ANNUAL_SALARY_2024 / 12; // ≈ €3317
const EU_GENDER_PAY_GAP = 0.162; // 16.2%
const WOMEN_EARN_MULTIPLIER = 1 - EU_GENDER_PAY_GAP; // ≈ 0.838 (~84 cents per €1)

const CORE_BILL_IDS = ["housing", "utilities", "food", "transport", "phone_net"] as const;

const baseItems = [
  { id: "housing", name: "Housing (Rent + basic fees)", price: 950, icon: Home },
  { id: "utilities", name: "Electricity & Utilities", price: 170, icon: Zap },
  { id: "food", name: "Food & Essentials", price: 450, icon: Utensils },
  { id: "transport", name: "Transport", price: 70, icon: Train },
  { id: "phone_net", name: "Phone & Internet", price: 60, icon: Wifi },

  { id: "healthcare", name: "Healthcare", price: 120, icon: Heart },
  { id: "hygiene", name: "Household & Hygiene", price: 70, icon: Droplets },
  { id: "work", name: "Education / Work Costs", price: 100, icon: GraduationCap },
  { id: "fees", name: "Debt / Fees (banking, late fees)", price: 120, icon: CreditCard },
  { id: "clothing", name: "Clothes", price: 100, icon: Shirt },
  { id: "unexpected", name: "Unexpected Expenses", price: 200, icon: AlertTriangle },
] as const;


const leisureItems = [
  { id: "leisure", name: "Leisure", price: 150, icon: Music },
  { id: "memberships", name: "Memberships", price: 70, icon: CreditCard },
] as const;


const womenOnlyItems = [
  {
    id: "unpaid_labour",
    name: "Unpaid work (relationships, marriage, home)",
    price: 0,
    icon: Users,
    note:
      "women do ~86% more unpaid work than men.(+121 min ≈ 2 hours/day).",
  },
] as const;

interface PurchasingPowerGameProps {
  onComplete: () => void; // kept for compatibility; not used here
}

type Item = {
  id: string;
  name: string;
  price: number;
  icon: any;
  note?: string;
};

function ItemCard({
  item,
  isSelected,
  onToggle,
  fmt,
}: {
  item: Item;
  isSelected: boolean;
  onToggle: (id: string) => void;
  fmt: Intl.NumberFormat;
}) {
  return (
    <motion.button
      key={item.id}
      onClick={() => onToggle(item.id)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`stat-card text-left transition-all ${
        isSelected ? "ring-2 ring-primary/40 shadow-lg" : "hover:shadow-lg"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
          <item.icon className="w-6 h-6 text-accent-foreground" />
        </div>
        {isSelected && (
          <div className="w-6 h-6 rounded-full bg-stat-positive flex items-center justify-center">
            <Check className="w-4 h-4 text-primary-foreground" />
          </div>
        )}
      </div>

      <p className="font-medium text-foreground mb-1">{item.name}</p>
      {item.note ? <p className="text-xs text-muted-foreground mb-2">{item.note}</p> : null}
      <p className="text-lg font-display font-bold text-primary">{fmt.format(item.price)}</p>
    </motion.button>
  );
}

export function PurchasingPowerGame({}: PurchasingPowerGameProps) {
  const [selectedGender, setSelectedGender] = useState<"man" | "woman">("man");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const fmt = useMemo(
    () =>
      new Intl.NumberFormat("en-IE", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }),
    []
  );

  const baseIncome = EU_AVG_MONTHLY_SALARY_2024;
  const income = selectedGender === "man" ? baseIncome : baseIncome * WOMEN_EARN_MULTIPLIER;

  // Women-only unpaid work card (still toggleable, price €0)
  const womanExtra = selectedGender === "woman" ? (womenOnlyItems as unknown as Item[]) : [];

  const spent = useMemo(() => {
    const allItems = [...baseItems, ...leisureItems, ...womanExtra] as unknown as Item[];
    return selectedItems.reduce((sum, id) => {
      const item = allItems.find((i) => i.id === id);
      return sum + (item?.price || 0);
    }, 0);
  }, [selectedItems, selectedGender]);

  const budgetLeft = income - spent;
  const progressPct = income > 0 ? Math.min(100, Math.max(0, (spent / income) * 100)) : 0;

  const coreBillsPicked = useMemo(() => {
    return CORE_BILL_IDS.filter((id) => selectedItems.includes(id)).length;
  }, [selectedItems]);

  const toggleItem = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((x) => x !== itemId) : [...prev, itemId]
    );
  };

  const resetGame = () => setSelectedItems([]);

  const switchGender = (gender: "man" | "woman") => {
    setSelectedGender(gender);
    setSelectedItems([]);
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

      {/* Budget Display (big number decreases with picks) */}
      <motion.div layout className="stat-card mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-muted-foreground">Monthly Income (EU baseline)</p>
            <motion.p
              key={Math.round(budgetLeft)}
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              className={`text-3xl font-display font-bold ${
                budgetLeft < 0 ? "text-stat-negative" : "text-foreground"
              }`}
            >
              {fmt.format(budgetLeft)}
            </motion.p>
            <p className="text-xs text-muted-foreground mt-1">
              
              Gender pay gap: 16.2% (≈ €0.84 per €1).
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-muted-foreground">Core bills picked</p>
            <p className="text-2xl font-display font-bold text-foreground">
              {coreBillsPicked}/{CORE_BILL_IDS.length}
            </p>
          </div>
        </div>

        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            className={`h-full rounded-full transition-all ${
              spent > income ? "bg-stat-negative" : "accent-gradient"
            }`}
          />
        </div>
      </motion.div>

      {/* Essentials / Bills */}
      <div className="mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">Monthly costs</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {baseItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item as unknown as Item}
            isSelected={selectedItems.includes(item.id)}
            onToggle={toggleItem}
            fmt={fmt}
          />
        ))}

        {/* Women-only card sits in the same section (only appears for women) */}
        {womanExtra.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            isSelected={selectedItems.includes(item.id)}
            onToggle={toggleItem}
            fmt={fmt}
          />
        ))}
      </div>

      {/* ✅ New section: Free time / going out */}
      <div className="mb-5">
        <h3 className="text-sm font-medium text-muted-foreground">Free time & Hobbies</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {leisureItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item as unknown as Item}
            isSelected={selectedItems.includes(item.id)}
            onToggle={toggleItem}
            fmt={fmt}
          />
        ))}
      </div>

      {/* Bottom Explanation */}
      <AnimatePresence>
        {selectedItems.length >= 6 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="stat-card border-2 border-primary/20"
          >
            <h3 className="text-lg font-display font-semibold text-foreground mb-2">What This Shows (EU)</h3>

            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              {selectedGender === "woman"
                ? "Across the EU, women are paid an average of 16.2% less than men — for every €1 a man makes, a woman makes about €0.84. Try selecting the core bills first (rent, electricity, food, transport, phone & internet) and see what’s left for healthcare, fees, clothes, unexpected costs — and even free time."
                : "Switch to 'As a Woman' to apply the EU average gender pay gap (16.2% less). Then try selecting the core bills first (rent, electricity, food, transport, phone & internet) and see what’s left for everything else — including free time."}
            </p>

            <div className="flex gap-3">
              <Button onClick={resetGame} variant="outline">
                Reset
              </Button>
            </div>

            {/* Resources */}
<div className="mt-6 pt-4 border-t border-border/60">
  <p className="text-xs text-muted-foreground mb-2">Resources</p>

  <ul className="space-y-2 text-xs">
    <li className="text-muted-foreground">
      <span className="font-medium text-foreground">Eurostat (European Commission)</span> — EU average annual full-time
      adjusted salary (used to compute monthly baseline).{" "}
      <a
        className="underline underline-offset-2 hover:text-foreground"
        href="https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20251112-1"
        target="_blank"
        rel="noreferrer"
      >
        https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20251112-1
      </a>
    </li>

    <li className="text-muted-foreground">
      <span className="font-medium text-foreground">European Commission</span> — EU gender pay gap (16.2%; ~€0.84 per
      €1).{" "}
      <a
        className="underline underline-offset-2 hover:text-foreground"
        href="https://commission.europa.eu/strategy-and-policy/policies/justice-and-fundamental-rights/gender-equality/equal-pay/gender-pay-gap-situation-eu_en"
        target="_blank"
        rel="noreferrer"
      >
        https://commission.europa.eu/strategy-and-policy/policies/justice-and-fundamental-rights/gender-equality/equal-pay/gender-pay-gap-situation-eu_en
      </a>
    </li>

    <li className="text-muted-foreground">
      <span className="font-medium text-foreground">University Women of Europe</span> — supporting summary/context on EU
      gender pay gap.{" "}
      <a
        className="underline underline-offset-2 hover:text-foreground"
        href="https://www.universitywomenofeurope.org/2025/10/29/gender-pay-gap-in-eu/"
        target="_blank"
        rel="noreferrer"
      >
        https://www.universitywomenofeurope.org/2025/10/29/gender-pay-gap-in-eu/
      </a>
    </li>

    <li className="text-muted-foreground">
      <span className="font-medium text-foreground">Yahoo Finance</span> — unpaid work time-use stats (23 European
      countries; 262 vs 141 min/day; +121 min/day).{" "}
      <a
        className="underline underline-offset-2 hover:text-foreground"
        href="https://uk.finance.yahoo.com/news/unpaid-europe-countries-biggest-gender-050047652.html"
        target="_blank"
        rel="noreferrer"
      >
        https://uk.finance.yahoo.com/news/unpaid-europe-countries-biggest-gender-050047652.html
      </a>
    </li>
  </ul>
</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}