import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import SettingPage from "./pages/SettingPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { useAuthStore } from "./stores/useAuthStore.js";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./stores/useThemeStore.js";

export default function App() {
  const { authUser, isCheckingAuth, checkAuth, onlineUsers } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  useEffect(() => {
    if (!authUser) {
      checkAuth();
    }
  }, []);

  console.log("onlineUsers", onlineUsers);
  // console.log("authUser", authUser);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    ); // You can replace this with a loading spinner or a skeleton screen
  }

  return (
    <div data-theme={theme}>
      <Navbar></Navbar>

      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/sign-in" />}
        />
        <Route
          path="/sign-up"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/sign-in"
          element={!authUser ? <SignInPage /> : <Navigate to="/" />}
        />
        <Route path="/setting" element={<SettingPage />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/sign-in" />}
        />
      </Routes>

      <Toaster />
    </div>
  );
}
