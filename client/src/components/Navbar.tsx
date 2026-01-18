// components/Navbar.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User2, Wallet, Swords, Info, PlusCircle, ArrowUpRight } from "lucide-react";
import { useContext, useState } from "react";
import { UserContext } from "./contexts/UserContext";
import Logo from "../assets/vector/default-monochrome-black.svg";
import ModeToggle from "./ModeToggle";
import { Dialog } from "@/components/ui/dialog";
import { DepositModal, WithdrawModal } from "./WalletActions.tsx";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


export function Navbar() {
  const auth = useContext(UserContext);
  const [walletAction, setWalletAction] = useState<"deposit" | "withdraw" | null>(null);
  
  return (
    <nav className="border-b bg-card px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Left side: Logo + Arena */}
      <div className="flex items-center gap-4">
        <Link to="/contracts" className="text-xl font-bold tracking-tighter">
          <img src={Logo} alt="Betcha!" className="h-8 w-auto" />
        </Link>

         <Link to="/about">
          <Button
            variant="secondary"
            size="lg"
            className="gap-2 font-bold tracking-wide uppercase text-lg leading-none border border-transparent transition-colors hover:border-primary hover:shadow-[0_0_0_1px_hsl(var(--primary))]"
          >
            <Info className="h-5 w-5" />
            About
          </Button>
        </Link>

        <Link to="/contracts">
          <Button
            variant="secondary"
            size="lg"
            className="gap-2 font-bold tracking-wide uppercase text-lg leading-none border border-transparent transition-colors hover:border-primary hover:shadow-[0_0_0_1px_hsl(var(--primary))]"
          >
            <Swords className="h-5 w-5" />
            Arena
          </Button>
        </Link>

      </div>

      {/* Right side: Balance + Profile */}
      <div className="flex items-center gap-4">
        {auth.isAuthenticated && (
          <Dialog open={walletAction !== null} onOpenChange={(open) => !open && setWalletAction(null)}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 border-green-600/20 hover:border-green-600/50">
                  <Wallet className="h-5 w-5 text-green-600" />
                  <span className="font-bold text-green-600">${auth.user?.balance.toFixed(2)}</span>
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuLabel>Wallet Balance</DropdownMenuLabel>
                <div className="px-2 py-1.5 text-2xl font-bold">${auth.user?.balance.toFixed(2)}</div>
                <DropdownMenuSeparator />
                
                {/* Use onSelect to open the Dialog and set the specific action */}
                <DropdownMenuItem onSelect={() => setWalletAction("deposit")} className="cursor-pointer gap-2 py-3">
                  <PlusCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Add Money</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onSelect={() => setWalletAction("withdraw")} className="cursor-pointer gap-2 py-3">
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Withdraw Funds</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Render the appropriate modal based on state */}
            {walletAction === "deposit" && <DepositModal onComplete={() => setWalletAction(null)} />}
            {walletAction === "withdraw" && <WithdrawModal onComplete={() => setWalletAction(null)} />}
          </Dialog>
        )}
        
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
