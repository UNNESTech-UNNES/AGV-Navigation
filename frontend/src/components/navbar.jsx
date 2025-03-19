import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X } from "lucide-react";

function Navbar() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [language, setLanguage] = useState(
    localStorage.getItem("lang") || "id"
  );
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleLangChange = () => {
      setLanguage(localStorage.getItem("lang") || "id");
    };
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const toggleLanguage = () => {
    const newLang = language === "id" ? "en" : "id";
    localStorage.setItem("lang", newLang);
    setLanguage(newLang);
    window.dispatchEvent(new Event("languageChange"));
  };

  const menuItems = [
    { path: "/", label: language === "id" ? "Beranda" : "Home" },
    {
      path: "/daftar-ruangan",
      label: language === "id" ? "Daftar Ruangan" : "Room List",
    },
    { path: "/denah", label: language === "id" ? "Denah" : "Map" },
    { path: "/feedback", label: language === "id" ? "Ulasan" : "Feedback" },
    { path: "/tentang", label: language === "id" ? "Tentang" : "About" },
  ];

  return (
    <nav
      className={`fixed top-0 left-1/2 transform -translate-x-1/2 w-[90%] md:w-[80%] bg-background/20 backdrop-blur-md flex items-center justify-between px-4 py-3 z-20 border mt-5 rounded-full transition-all duration-300 ${
        isScrolled ? "shadow-md" : "bg-muted-80"
      }`}
    >
      <Link to="/esp">
        <img src="/logo-agv.png" alt="Logo" className="h-8 cursor-pointer" />
      </Link>

      {/* Menu untuk Desktop */}
      <ul className="hidden md:flex gap-6">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`${
                location.pathname === item.path
                  ? "text-primary"
                  : "text-muted-foreground"
              } transition-colors`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Tombol untuk Theme & Language */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-muted transition"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <button
          onClick={toggleLanguage}
          className="px-4 py-2 rounded-full bg-muted transition text-md"
        >
          {language === "id" ? "ENG" : "IDN"}
        </button>

        {/* Tombol untuk Menu Mobile */}
        <button
          className="md:hidden p-2 rounded-full bg-muted transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menu Mobile */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-20 left-0 w-full bg-background border rounded-md p-4 flex flex-col items-center md:hidden"
          >
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`py-2 w-full text-center ${
                  location.pathname === item.path
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-primary"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
