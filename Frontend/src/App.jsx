import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import PetDetails from "./components/PetDetails";
import EnhancedDashboard from './components/EnhancedDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PetDetails />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<EnhancedDashboard />} />

        
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
