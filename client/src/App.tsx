import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Upload from "@/pages/Upload";
import History from "@/pages/History";
import Analytics from "@/pages/Analytics";
import Platforms from "@/pages/Platforms";
import MainLayout from "@/components/layout/MainLayout";

function Router() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/upload" component={Upload} />
        <Route path="/history" component={History} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/platforms" component={Platforms} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
