import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./theme/ThemeContext";
import { AuthProvider } from "./auth/AuthContext";
import { NavBar } from "./components/NavBar";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Home } from "./pages/Home";
import { Globe } from "./pages/Globe";
import { Explore } from "./pages/Explore";
import { EventDetail } from "./pages/EventDetail";
import { Settings } from "./pages/Settings";
import { NotFound } from "./pages/NotFound";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { VerifyEmail } from "./pages/VerifyEmail";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <BrowserRouter>
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
              <NavBar />
              <div style={{ flex: "1 1 auto", display: "flex", flexDirection: "column" }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/globe" element={<Globe />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/events/:id" element={<EventDetail />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </div>
          </BrowserRouter>
        </ErrorBoundary>
      </ThemeProvider>
    </AuthProvider>
  );
}