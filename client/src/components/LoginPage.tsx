"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Chrome } from "lucide-react"; // Or use a Google Icon
import { useContext, useEffect } from "react";
import api from "@/api/axios";
import { UserContext } from "./contexts/UserContext";
import { useNavigate } from "react-router-dom";
export default function LoginPage() {

  const auth = useContext(UserContext);
  const navigate = useNavigate(); 
  
  function handleGoogleResponse(response: any) {
    api
    .post("/auth/google", {
      token: response.credential,
    })
    .then((res) => {
      console.log("Logged in user:", res.data.user);
      auth.setUser({
        id: "1",
        username: "name",
        fname: "fname",
        lname: "lname",
        email: "email",
        created_at: String(Date.now()),
        balance: 100000,
        times_banned: 1
      });
      auth.setIsAuthenticated(true);
      window.location.href = "/"
    })
    .catch((err) => {
      console.error("Login failed", err);
    })
  }

  useEffect(() => {
    if (window.google) {
      // 1. Initialize
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        use_fedcm_for_prompt: false,
      });

      // 2. Render the actual Google button into a div
      window.google.accounts.id.renderButton(
        document.getElementById("googleButton"),
        { 
          theme: "outline", 
          size: "large", 
          width: "350", // Match your Card width
          text: "signin_with",
          shape: "rectangular" 
        }
      );
    }
  }, []);
  


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
          <Button
            variant="outline"
            onClick={() => {window.google.accounts.id.prompt(); console.log("rpressred")}}
            className="w-full gap-2"
          >
            <Chrome className="h-4 w-4" />
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
