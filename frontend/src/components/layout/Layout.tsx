
import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { DynamicFilterBar } from "./DynamicFilterBar";
import { useProcessMining } from "@/contexts/ProcessMiningContext";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { setFilters } = useProcessMining();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <DynamicFilterBar onFiltersChange={setFilters} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
