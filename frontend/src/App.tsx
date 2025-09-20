import RegistrationPage from "./pages/RegistraionPage";
import LoginEmail from "./pages/LoginEmail";
import LoginId from "./pages/LoginId";
import Landing from "./pages/Landing";
import PersonnelDashboard from "./pages/Main";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotificationSender from "./pages/Noti";

function App() {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Landing />}/>
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/login-email" element={<LoginEmail />}/>
        <Route path="/login-id" element={<LoginId />}/>
        <Route path="/main" element={<PersonnelDashboard />}/>
        <Route path="notification" element={<NotificationSender />}/>
      </Routes>
    </Router>

  )
}

export default App
