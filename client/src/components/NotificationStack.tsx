import { Bell, Check, X } from "lucide-react";
import { 
  Popover, PopoverContent, PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Notification } from "@/types/Notification";

export function NotificationStack({ notifications, onAction }: { 
  notifications: Notification[], 
  onAction: (id: string, action: 'accept' | 'decline') => void 
}) {
  const unreadCount = notifications.filter(n => n.status === 'pending').length;
  return (
    <Popover>
      <PopoverTrigger asChild>
        {/* Changed variant to outline and size to match ModeToggle */}
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-background animate-in zoom-in">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b bg-muted/30">
          <h4 className="font-bold text-sm uppercase tracking-wider">Activity Feed</h4>
        </div>
        
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground italic">
              No new activity
            </div>
          ) : (
            notifications.map((n) => (
              
              <div key={n.id} className="p-4 border-b last:border-0 hover:bg-muted/50 transition-colors">
                <p className="text-xs font-medium mb-1 line-clamp-1">
                  Raise offer for: <span className="font-bold">{n.contract_title || "Unknown Contract"}</span>
                </p>
                <p className="text-sm font-bold text-green-600 mb-3">
                  ${n.amount.toFixed(2)}
                </p>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="h-8 flex-1 bg-green-600 hover:bg-green-700 font-bold text-xs"
                    onClick={() => onAction(n.id, 'accept')}
                  >
                    <Check className="h-3 w-3 mr-1" /> Accept
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 flex-1 text-destructive hover:bg-destructive/10 border-destructive/20 font-bold text-xs"
                    onClick={() => onAction(n.id, 'decline')}
                  >
                    <X className="h-3 w-3 mr-1" /> Decline
                  </Button>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}