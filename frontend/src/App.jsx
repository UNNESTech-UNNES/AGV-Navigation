import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Beranda from "./pages/beranda/page";
import CariRuangan from "./pages/cari-ruangan/page";
import DaftarRuangan from "./pages/ruangan/page";
import Denah from "./pages/denah/page";
import Feedback from "./pages/feedback/page";
import Tentang from "./pages/tentang/page";
import AGV from "./pages/agv/page";
import NotFound from "./pages/404/page";
import ESPControl from "./pages/esp/page";
import "@fontsource/manrope";

import Navbar from "./components/navbar";
import { Toaster } from "./components/ui/sonner";
import { useState, useEffect } from "react";
import CommandControl from "./pages/demo/page";
import Credit from "./components/kredit";

function App() {
  const [language, setLanguage] = useState(
    localStorage.getItem("lang") || "id"
  );

  useEffect(() => {
    const handleLangChange = () => {
      setLanguage(localStorage.getItem("lang") || "id");
    };
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Beranda language={language} />} />
        <Route
          path="/cari-ruangan"
          element={<CariRuangan language={language} />}
        />
        <Route
          path="/daftar-ruangan"
          element={<DaftarRuangan language={language} />}
        />
        <Route path="/denah" element={<Denah language={language} />} />
        <Route path="/feedback" element={<Feedback language={language} />} />
        <Route path="/tentang" element={<Tentang language={language} />} />
        <Route path="/agv" element={<AGV language={language} />} />
        <Route path="/esp" element={<ESPControl language={language} />} />
        <Route path="/demo" element={<CommandControl />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="bottom-right" richColors />
      <Credit />
    </Router>
  );
}

export default App;
