import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landing";
import Listings from "./pages/Listing";
import ListingDetail from "./pages/ListingDetail";
import MyInterests from "./pages/MyInterests";
import Authentication from "./pages/Authentication";

import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
        <Route path="/my-interests" element={<MyInterests />} />
        <Route path="/auth" element={<Authentication />} />
        
      </Routes>
    </Router>
  );
}

export default App;