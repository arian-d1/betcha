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
import { UserProvider } from "./components/contexts/UserContext";
import About from "./components/About";

export default function App() {
  return (
    <UserProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route path="/" element={<Navigate to="/contracts" replace />} />
          <Route path="/about" element={<About></About>}/>
          <Route
            path="/login"
            element={<LoginPage />}
          />
          <Route path="/contracts" element={<ContractFeed></ContractFeed>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/user/:id" element={<UserProfile></UserProfile>} />
            <Route
              path="/contracts/:id"
              element={<ContractFeed></ContractFeed>}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </UserProvider>
  );
}
