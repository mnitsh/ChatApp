import { Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import LoginPage from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";
import SignUpPage from "./Pages/SignUpPage";
import SettingPage from "./Pages/SettingPage";
import ProfilePage from "./Pages/ProfilePage";
import { useAuthStore } from "./Store/useAuthStore";
import { useThemeStore } from "./Store/useThemeStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

function App() {
  const { authUser, CheckAuth, isCheckingAuth,onlineUser } = useAuthStore();
  const { theme } = useThemeStore();

  console.log(onlineUser);
  console.log(authUser);
  
  
  useEffect(() => {
    CheckAuth();
  }, [CheckAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex justify-center h-screen items-center">
        <Loader className="size-16 animate-spin" />
      </div>
    );
  return (
    <div data-theme={theme} className="overflow-y-scroll">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route path="/settings" element={<SettingPage />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
