import { Route, Routes } from "react-router";
import "./App.css";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import Pagenotfound from "./pages/auth/pagenotfound";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* page not found */}
        <Route path="*" element={<Pagenotfound />} />
      </Routes>
    </>
  );
}

export default App;
