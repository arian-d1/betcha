// components/Navbar.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User2, Wallet, Swords, Info } from "lucide-react";
import { useContext } from "react";
import { UserContext } from "./contexts/UserContext";
import Logo from "../assets/vector/default-monochrome-black.svg";
import ModeToggle from "./ModeToggle";
// In a real app, you'd get this from an Auth Context
export function Navbar() {
  const auth = useContext(UserContext);
  return (
    <nav className="border-b bg-card px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Left side: Logo + Arena */}
      <div className="flex items-center gap-4">
        <Link to="/contracts" className="text-xl font-bold tracking-tighter">
          <img src={Logo} alt="Betcha!" className="h-8 w-auto" />
        </Link>

        <Link to="/contracts">
          <Button
            variant="secondary"
            size="lg"
            className="gap-2 font-bold tracking-wide uppercase text-lg leading-none border border-transparent transition-colors hover:bg-primary/7.5 dark:hover:bg-primary/15 hover:shadow-[0_0_0_1px_hsl(var(--primary))]"
          >
            <Swords className="h-5 w-5" />
            Arena
          </Button>
        </Link>

        <Link to="/about">
          <Button
            variant="secondary"
            size="lg"
            className="gap-2 font-bold tracking-wide uppercase text-lg leading-none border border-transparent transition-colors hover:bg-primary/7.5 dark:hover:bg-primary/15 hover:shadow-[0_0_0_1px_hsl(var(--primary))]"
          >
            <Info className="h-5 w-5" />
            About
          </Button>
        </Link>

      </div>

      {/* Right side: Balance + Profile */}
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground">
          {auth.isAuthenticated ? (
            <>
              <Wallet className="h-5 w-5" />
              {/* Use .toFixed(2) for currency and ?? as a fallback for 0 */}
              <span>${auth.user?.balance.toFixed(2) ?? "0.00"}</span>
            </>
          ) : (
            ""
          )}
        </div>
        
        <Link
          to={
            auth.isAuthenticated
              ? `/user/${auth.user?.id ?? "login"}`
              : `/user/login`
          }
        >
          <Button variant="ghost" size="sm" className="gap-2">
            <User2 className="h-4 w-4" />
            <span className="hidden sm:inline">My Profile</span>
          </Button>
        </Link>

        <ModeToggle />
      </div>
    </nav>
  );
}
