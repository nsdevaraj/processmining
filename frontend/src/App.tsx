
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProcessMiningProvider } from "./contexts/ProcessMiningContext";
import { Layout } from "./components/layout/Layout";

import Upload from "./pages/Upload";
import Overview from "./pages/Overview";
import ProcessFlow from "./pages/ProcessFlow";
import Conformance from "./pages/Conformance";
import LeadTime from "./pages/LeadTime";
import RootCauses from "./pages/RootCauses";
import CaseReplay from "./pages/CaseReplay";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ProcessMiningProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Upload />} />
            <Route path="/overview" element={
              <Layout>
                <Overview />
              </Layout>
            } />
            <Route path="/process-flow" element={
              <Layout>
                <ProcessFlow />
              </Layout>
            } />
            <Route path="/conformance" element={
              <Layout>
                <Conformance />
              </Layout>
            } />
            <Route path="/lead-time" element={
              <Layout>
                <LeadTime />
              </Layout>
            } />
            <Route path="/root-causes" element={
              <Layout>
                <RootCauses />
              </Layout>
            } />
            <Route path="/case-replay" element={
              <Layout>
                <CaseReplay />
              </Layout>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ProcessMiningProvider>
  </QueryClientProvider>
);

export default App;
