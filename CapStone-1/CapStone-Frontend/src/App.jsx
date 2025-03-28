import "./App.css";
import AdminHome from "./pages/admin/AdminHome.jsx";
import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/Signup.jsx";
import FormSubmission from "./pages/employee/formSubmission.jsx";
import Home from "./pages/employee/Home.jsx";
import UserEntry from "./pages/UserEntry.jsx";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserEntry />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/employee/home" element={<Home/>}/>
      <Route path="/employee/fillsurvey" element={<FormSubmission/>}/>
      <Route path="/admin/home" element={<AdminHome/>}/>
    </Routes>
  );
}

export default App;
