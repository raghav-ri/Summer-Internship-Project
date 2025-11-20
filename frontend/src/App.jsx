import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NoteDetailPage from "./pages/NoteDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <AuthProvider>
      <div className="relative h-full w-full">
        <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_60%,#00FF9D40_100%)]" />
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<ProtectedRoute element={<HomePage />} />} />
          <Route path="/create" element={<ProtectedRoute element={<CreatePage />} />} />
          <Route path="/note/:id" element={<ProtectedRoute element={<NoteDetailPage />} />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};
export default App;
