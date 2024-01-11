import "./App.css";
import Availableflights from "./components/availableflights/Availableflights";
import BookingPage from "./components/body/BookingPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<BookingPage />}></Route>
        <Route exact path="/availableflights" element={<Availableflights />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
