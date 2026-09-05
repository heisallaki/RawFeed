import { useState } from "react";
import { ThemeProvider } from "./theme/ThemeContext";
import { NavBar } from "./components/NavBar";
import { Home } from "./pages/Home";
import { Settings } from "./pages/Settings";

type Page = "home" | "settings";

export default function App() {
  const [page, setPage] = useState<Page>("home");

  return (
    <ThemeProvider>
      <NavBar activePage={page} onNavigate={setPage} />
      {page === "home" ? <Home /> : <Settings />}
    </ThemeProvider>
  );
}