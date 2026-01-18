import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrophyWinnerProps {
  name: string | undefined;
  className?: string;
}

export function TrophyWinner({ name, className }: TrophyWinnerProps) {
  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      {/* The Glow Effect */}
      <div className="absolute -top-2 w-12 h-12 bg-yellow-500/20 blur-xl rounded-full" />
      
      <div className="flex items-center gap-2 relative">
        {/* Left Trophy */}
        <Trophy 
          className="h-5 w-5 text-yellow-500 fill-yellow-500/20 drop-shadow-sm" 
          strokeWidth={2.5}
        />
        
        {/* Winner Name */}
        <span className="text-base font-black uppercase tracking-widest bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
          {name}
        </span>

        {/* Right Trophy */}
        <Trophy 
          className="h-5 w-5 text-yellow-500 fill-yellow-500/20 drop-shadow-sm" 
          strokeWidth={2.5}
        />
      </div>
      
      {/* Bottom Reflection/Shine */}
      <div className="w-16 h-[1px] mt-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
    </div>
  );
}