import { Sword, Scroll, ShieldCheck, Zap, Scale, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 1. Hero Section */}
      <section className="relative py-20 px-6 border-b bg-muted/20 overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <div className="flex justify-center items-center gap-4 mb-8">
            <Sword className="w-12 h-12 text-primary rotate-[225deg] opacity-20 hidden sm:block" />
            <div className="bg-primary/10 p-4 rounded-full border border-primary/20">
              <Scroll className="w-12 h-12 text-primary" />
            </div>
            <Sword className="w-12 h-12 text-primary rotate-[45deg] opacity-20 hidden sm:block" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 italic">
            THE RULES OF <span className="text-primary">ENGAGEMENT</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Betcha! is not just a sportsbook—it's a peer-to-peer arena where honor is tracked, 
            stakes are real, and every duel is backed by code.
          </p>
        </div>
        
        {/* Background Decorative Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary/5 blur-[120px] rounded-full -z-0" />
      </section>

      {/* 2. Core Pillars (The Blade & Hilt) */}
      <section className="py-24 px-6 container mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold italic">The Sharp Edge</h3>
            <p className="text-muted-foreground">
              Our high-speed transaction engine ensures your wagers are claimed and 
              locked instantly. No middleman, no waiting, just action.
            </p>
          </div>

          <div className="space-y-4">
            <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold italic">The Guarded Hilt</h3>
            <p className="text-muted-foreground">
              Your balance is held in a secure internal ledger. Funds are only 
              released once the duel is resolved or voided by the Maker.
            </p>
          </div>

          <div className="space-y-4">
            <div className="h-12 w-12 bg-yellow-500/10 rounded-lg flex items-center justify-center text-yellow-500">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold italic">The Honor Code</h3>
            <p className="text-muted-foreground">
              We track reputation. The "Times Banned" metric ensures you know exactly 
              who you are dueling before you ever put money on the line.
            </p>
          </div>
        </div>
      </section>

      {/* 3. The Process (Steps) */}
      <section className="py-24 bg-muted/30 border-y px-6">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-16 flex items-center gap-3">
            <Trophy className="text-primary" /> HOW TO ASCEND
          </h2>
          
          <div className="space-y-12 relative">
            {/* Vertical Line */}
            <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-border hidden sm:block" />

            {[
              { step: "01", title: "Forge a Wager", desc: "Create a contract with a title, description, and stake." },
              { step: "02", title: "Enter the Arena", desc: "Your wager appears in the public feed for anyone to challenge." },
              { step: "03", title: "Accept the Duel", desc: "A Taker accepts. Funds are deducted from both parties and held." },
              { step: "04", title: "Claim Victory", desc: "Once the event concludes, the Maker resolves the contract and the winner takes the pot." }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-8 relative">
                <div className="w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center font-bold text-sm shrink-0 z-10 shadow-sm">
                  {item.step}
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 italic tracking-tight">{item.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Call to Action */}
      <section className="py-24 text-center px-6">
        <h2 className="text-4xl font-bold mb-8 italic uppercase tracking-tighter">Ready to Duel?</h2>
        <Link to="/contracts">
          <Button size="lg" className="h-14 px-10 text-lg font-bold gap-2">
            <Sword className="w-5 h-5 rotate-45" />
            ENTER THE ARENA
          </Button>
        </Link>
      </section>
      
      <footer className="py-10 border-t text-center text-muted-foreground text-sm italic">
        © 2026 BETCHA! ARENA — PLAY WITH HONOR.
      </footer>
    </div>
  );
}