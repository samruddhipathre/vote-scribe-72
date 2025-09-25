import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import { User } from "@/types/voting";

interface AuthPageProps {
  mode: "login" | "register";
  onLogin: (email: string, password: string) => Promise<User>;
  onRegister: (email: string, password: string, name: string) => Promise<User>;
}

const AuthPage = ({ mode, onLogin, onRegister }: AuthPageProps) => {
  const [currentMode, setCurrentMode] = useState(mode);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  const storedUser = localStorage.getItem('votehub_user');
  if (storedUser) {
    return <Navigate to="/" replace />;
  }

  // Update mode when prop changes
  useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      if (currentMode === "login") {
        await onLogin(data.email, data.password);
      } else {
        await onRegister(data.email, data.password, data.name);
      }
      
      // Redirect to home page after successful auth
      navigate("/");
    } catch (error) {
      throw error; // Re-throw to be handled by AuthForm
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    const newMode = currentMode === "login" ? "register" : "login";
    setCurrentMode(newMode);
    navigate(newMode === "login" ? "/login" : "/register", { replace: true });
  };

  return (
    <AuthForm
      mode={currentMode}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      onToggleMode={toggleMode}
    />
  );
};

export default AuthPage;