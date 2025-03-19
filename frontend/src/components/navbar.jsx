import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
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
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={`fixed top-0 left-1/2 transform -translate-x-1/2 w-[90%] md:w-[80%] bg-background/20 backdrop-blur-xs flex items-center justify-between xl:px-6 xl:py-4 px-4 py-2 z-10 border shadow-xs mt-5 rounded-full transition-all duration-300 ${
        isScrolled ? "shadow-md" : "bg-muted-80"
      }`}
    >
      <Link to="/esp">
        <img src="/logo-agv.png" alt="Logo" className="h-8 cursor-pointer" />
      </Link>

      <ul className="hidden md:flex gap-6">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`${
                location.pathname === item.path
                  ? "text-primary "
                  : "text-muted-foreground"
              } transition-colors`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-muted transition"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <button
          onClick={toggleLanguage}
          className="px-4 py-2  rounded-full bg-muted transition text-md"
        >
          {language === "id" ? "ENG" : "IDN"}
        </button>

        <button
          className="md:hidden p-2 rounded-full bg-muted transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </motion.nav>
  );
}

export default Navbar;
