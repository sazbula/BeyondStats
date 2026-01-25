import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, BarChart3, Gamepad2, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { path: "/explore", label: "Explore Map", icon: Globe },
  { path: "/country", label: "Countries", icon: BarChart3 },
  { path: "/games", label: "Mini-Games", icon: Gamepad2 },
];

export function Header() {
  const location = useLocation();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark =
      window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;

    const isDark = saved ? saved === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50"
    >
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          {/* LEFT: Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl font-display font-bold text-foreground">
              Beyond<span className="text-primary">Stats</span>
            </span>
          </Link>

          {/* RIGHT: Desktop nav + theme toggle */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={[
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                    ].join(" ")}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="inline-flex items-center justify-center rounded-xl border border-border/50 bg-background/60 hover:bg-secondary transition px-3 py-2"
              title={dark ? "Switch to light" : "Switch to dark"}
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* MOBILE: Explore + toggle on the right */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="inline-flex items-center justify-center rounded-xl border border-border/50 bg-background/60 hover:bg-secondary transition px-3 py-2"
              title={dark ? "Switch to light" : "Switch to dark"}
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              to="/explore"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground"
            >
              <Globe className="w-4 h-4" />
              Explore
            </Link>
          </div>
        </nav>
      </div>
    </motion.header>
  );
}
