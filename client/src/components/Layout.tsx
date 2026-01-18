import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="animate-in fade-in duration-500">
        <Outlet />
      </main>
    </div>
  );
}