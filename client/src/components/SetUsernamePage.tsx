"use client";
import { useState, useContext } from "react";
import { UserContext } from "./contexts/UserContext";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SetUsernamePage() {
  const { user, setUser } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    if (!user || !user?.id) {
        setError("User session not found. Please log in again.");
        return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Update the user on the backend
      const res = await api.patch(`/user/${user.id}`, { username });      
      // Update context with the new user data returned from backend
      setUser({ ...user, username: res.data.username });
      // Redirect to home or profile
      navigate("/contracts");
    } catch (err: any) {
      setError(err.response?.data?.error || "This username is already taken.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-sm shadow-xl border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Claim your handle</CardTitle>
          <CardDescription>
            You're almost in! Choose a unique username for the Arena.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="e.g. ArenaMaster"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))} // No spaces
                className={error ? "border-destructive" : ""}
                disabled={isSubmitting}
              />
              {error && <p className="text-xs text-destructive font-medium">{error}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Complete Setup"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}