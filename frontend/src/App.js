import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";

import SignUp from "./components/SignUp";
import Main from "./pages/Main";
import CarCollection from "./pages/CarCollection";
import AddCar from "./components/AddCar";
import CarDetails from "./pages/CarDetails";
import EditCar from "./components/EditCar";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/main" element={<Main />} />
        <Route path="/" element={<Login />} />
        <Route path="/carCollection" element={<CarCollection />} />
        <Route path="/addCar" element={<AddCar />} />
        <Route path="/carDetails" element={<CarDetails />} />
        <Route path="/editCar" element={<EditCar />} />
      </Routes>
    </Router>
  );
}

export default App;
