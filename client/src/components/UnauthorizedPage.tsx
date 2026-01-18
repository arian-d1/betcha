// pages/UnauthorizedPage.tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldAlert, ArrowLeft, LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md border-destructive/20 shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <LockKeyhole className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
            Access Denied
          </CardTitle>
          <p className="mt-2 text-sm text-muted-foreground">
            You don't have permission to do this action. Please sign in to
            verify your identity.
          </p>
        </CardHeader>

        <CardContent className="flex justify-center pb-8">
          <div className="rounded-lg bg-muted p-4 text-xs text-muted-foreground italic">
            "Only verified gladiators may enter the private quarters."
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button
            className="w-full bg-primary"
            size="lg"
            onClick={() => navigate("/login")}
          >
            Sign In
          </Button>

          <Button
            variant="ghost"
            className="w-full gap-2"
            onClick={() => navigate("/contracts")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Public Arena
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
