import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Chrome } from "lucide-react"; // Or use a Google Icon

export default function LoginPage() {
  async function handleLogin() {
    console.log("Hello");
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
          <Button
            variant="outline"
            onClick={handleLogin}
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
