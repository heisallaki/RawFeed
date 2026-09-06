import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./theme/ThemeContext";
import { NavBar } from "./components/NavBar";
import { Home } from "./pages/Home";
import { Globe } from "./pages/Globe";
import { Explore } from "./pages/Explore";
import { EventDetail } from "./pages/EventDetail";
import { Settings } from "./pages/Settings";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/globe" element={<Globe />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}