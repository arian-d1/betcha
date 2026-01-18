import { useState } from "react";
import { MessageCircle, Send, X, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  // This is dummy data - eventually you'd fetch this based on the active contract
  const dummyMessages = [
    { sender: "maker", text: "Ready for the match?" },
    { sender: "taker", text: "Born ready. Send the invite." },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            size="icon" 
            className="h-14 w-14 rounded-full shadow-2xl bg-primary hover:scale-110 transition-transform"
          >
            {isOpen ? <Minus /> : <MessageCircle className="h-6 w-6" />}
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          side="top" 
          align="end" 
          className="w-80 h-[450px] p-0 flex flex-col mb-4 shadow-2xl border-muted overflow-hidden animate-in slide-in-from-bottom-4"
        >
          {/* Header */}
          <div className="bg-primary p-4 text-primary-foreground flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm">Contract Chat</h3>
              <p className="text-[10px] opacity-70">Discussing: #2941-Match</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4 bg-muted/20">
            <div className="flex flex-col gap-3">
              {dummyMessages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`max-w-[80%] p-2 rounded-lg text-sm ${
                    msg.sender === "maker" 
                    ? "bg-primary text-primary-foreground self-end rounded-tr-none" 
                    : "bg-background border self-start rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-3 border-t bg-background flex gap-2">
            <Input 
              placeholder="Type a message..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="text-xs focus-visible:ring-1"
            />
            <Button size="icon" className="h-9 w-9 shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}