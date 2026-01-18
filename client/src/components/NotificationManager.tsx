import { useEffect, useState, useContext } from "react";
import { UserContext } from "./contexts/UserContext";
import api from "@/api/axios";
import type { Notification } from "@/types/Notification";
import { NotificationStack } from "./NotificationStack";

export function NotificationManager() {
  const auth = useContext(UserContext);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // 1. GET Notifications
  const fetchData = async () => {
    if (!auth.user?.id) return;
    try {
      // 1. Run both requests in parallel for better performance
      const [notificationsRes, contractsRes] = await Promise.all([
        api.get("/notification", {
          params: { to_uid: auth.user.id, status: "pending" }
        }),
        api.get("/contracts")
      ]);

      if (notificationsRes.data.success && contractsRes.data.success) {
        const rawNotifications = notificationsRes.data.data;
        const allContracts = contractsRes.data.data;

        // 2. Create a lookup map for O(1) title retrieval
        const contractMap = new Map(
          allContracts.map((c: any) => [c.id, c.title])
        );

        // 3. Hydrate notifications with the contract title
        const hydrated = rawNotifications.map((n: Notification) => ({
          ...n,
          contract_title: contractMap.get(n.contract_id) || "Unknown Contract"
        }));

        setNotifications(hydrated);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  useEffect(() => {
    fetchData();
    // Optional: Poll every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [auth.user?.id]);

  // 2. PATCH (Action) Handler
  const handleAction = async (notificationId: string, action: 'accept' | 'decline') => {
    try {
      const status = action === 'accept' ? 'accepted' : 'declined';
      
      const response = await api.patch(`/notification/${notificationId}`, {
        status: status
      });

      if (response.data.success) {
        // If accepted, you might want to refresh the page or specific contract 
        // because the contract amount has now changed on the backend.
        if (action === 'accept') {
          window.location.reload(); 
        } else {
          // Just remove from local list if declined
          setNotifications(prev => prev.filter(n => n.id !== notificationId));
        }
      }
    } catch (err) {
      console.error(`Failed to ${action} notification:`, err);
      alert(`Error processing ${action}`);
    }
  };

  return (
    <NotificationStack 
      notifications={notifications} 
      onAction={handleAction} 
    />
  );
}