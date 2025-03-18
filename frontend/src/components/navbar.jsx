import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, Moon, Menu, X } from "lucide-react";

function Navbar() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation(); // Dapatkan path saat ini

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Deteksi scroll untuk mengubah background navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10); // Jika scroll lebih dari 10px, ubah background
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Daftar menu
  const menuItems = [
    { path: "/", label: "Beranda" },
    { path: "/daftar-ruangan", label: "Daftar Ruangan" },
    { path: "/denah", label: "Denah" },
    { path: "/feedback", label: "Feedback" },
    { path: "/tentang", label: "Tentang" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={`fixed top-0 left-1/2 transform -translate-x-1/2 w-[90%] md:w-[80%] bg-background/20 backdrop-blur-xs    flex items-center justify-between xl:px-6 xl:py-4 px-4 py-2 z-10 border shadow-xs mt-5 rounded-full transition-all duration-300 ${
        isScrolled ? "shadow-md" : "bg-muted-80"
      }`}
    >
      {/* Logo */}
      <div>
        <img src="/logo-agv.png" alt="Logo" class=" h-8" />
      </div>

      {/* Menu Desktop */}
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

      {/* Toggle Dark Mode & Menu Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-muted transition"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Hamburger Menu (Mobile) */}
        <button
          className="md:hidden p-2 rounded-full bg-muted transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-[70px] left-0 w-full bg-background shadow-xs border rounded-lg p-5 md:hidden z-50"
        >
          <ul className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`${
                    location.pathname === item.path
                      ? "text-primary font-semibold"
                      : "text-muted-foreground"
                  } transition-colors`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.nav>
  );
}

export default Navbar;
