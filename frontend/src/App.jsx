import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Beranda from "./pages/beranda/page";
import CariRuangan from "./pages/cari-ruangan/page";
import DaftarRuangan from "./pages/ruangan/page";
import Denah from "./pages/denah/page";
import Feedback from "./pages/feedback/page";
import Tentang from "./pages/tentang/page";
import AGV from "./pages/agv/page";
import NotFound from "./pages/404/page";

import Navbar from "./components/navbar";
import "@fontsource/manrope";
import { GridBackgroundDemo } from "./components/GridDemo";

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Beranda />} />
          <Route path="/cari-ruangan" element={<CariRuangan />} />
          <Route path="/daftar-ruangan" element={<DaftarRuangan />} />
          <Route path="/denah" element={<Denah />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/tentang" element={<Tentang />} />
          <Route path="/agv" element={<GridBackgroundDemo />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
