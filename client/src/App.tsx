import { Route, Routes } from "react-router";
import "./App.css";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import Pagenotfound from "./pages/auth/pagenotfound";
import Home from "./pages/user/home";
import ProtectedRoute from "./pages/auth/protectedRoute";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Pagenotfound />} />
      </Routes>
    </>
  );
}

export default App;
