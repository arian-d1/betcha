import ContractFeed from "./components/ContractFeed";
import Layout from "./components/Layout";
import {
  BrowserRouter,
  Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProfile from "./components/UserProfile";
import { useContext } from "react";
import { UserContext } from "./components/contexts/UserContext";

export default function App() {
  const user = useContext(UserContext);
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route path="/" element={<Navigate to="/contracts" replace />} />
          <Route path="/login" element={<LoginPage handleLogin={user?.login}/>} />
          <Route path="/contracts" element={<ContractFeed></ContractFeed>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/user/:id" element={<UserProfile></UserProfile>} />
            <Route path="/contracts/:id" element={<ContractFeed></ContractFeed>} />

          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
