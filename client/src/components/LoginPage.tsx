"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useContext, useEffect } from "react";
import api from "@/api/axios";
import { UserContext } from "./contexts/UserContext";
import { useNavigate } from "react-router-dom";
import SetUsernamePage from "./SetUsernamePage";
export default function LoginPage() {

  const auth = useContext(UserContext);
  const [user, setUser] = useState(auth.user);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(auth.isAuthenticated);  
  const navigate = useNavigate(); 
  
  const handleGoogleResponse = async (response: any) => {
    try {
      const res = await api.post("/auth/google", {
        token: response.credential,
      });
      const user = res.data.user;
      // Update Context State
      auth.setUser({
        id: user.uuid,
        username: user.username,
        fname: user.firstName,
        lname: user.lastName,
        email: user.email,
        created_at: user.accountCreatedAt,
        balance: user.balance,
        times_banned: user.timesBanned,
      });
      auth.setIsAuthenticated(true);
      console.log(auth.user);
      navigate(`/user/${user.id}`);
    } catch (err) {
      console.error("Login failed", err);
      // Optional: Add a toast notification here for the user
    }
  };

  useEffect(() => {
    // Check if script is loaded
    const initializeGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          use_fedcm_for_prompt: false,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("googleButton"),
          { 
            theme: "outline", 
            size: "large", 
            width: "350", 
            text: "signin_with",
            shape: "rectangular" 
          }
        );
      }
    };

    

    // Small delay to ensure the DOM element #googleButton is rendered
    const timer = setTimeout(initializeGoogle, 150);
    return () => clearTimeout(timer);
  }, []);
  
  if (auth.user && auth.user.username == "") {
    return <SetUsernamePage></SetUsernamePage>
  } 
  return (
    <div className="flex h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to Arena</CardTitle>
          <CardDescription>
            Login with your Google account to start wagering.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {/* Google button will be rendered here */}
          <div id="googleButton" className="w-full"></div>
        </CardContent>
      </Card>
    </div>
  );
}
