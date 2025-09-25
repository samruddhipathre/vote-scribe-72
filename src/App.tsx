import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navigation from "@/components/layout/Navigation";
import Index from "./pages/Index";
import PollDetailsPage from "./pages/PollDetailsPage";
import CreatePollPage from "./pages/CreatePollPage";
import AuthPage from "./pages/AuthPage";
import VoteHistoryPage from "./pages/VoteHistoryPage";
import NotFound from "./pages/NotFound";
import { mockAuthApi, mockPollsApi, mockPolls, mockUserVotes } from "@/utils/mockData";
import { User, Poll } from "@/types/voting";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [userVotes, setUserVotes] = useState<{ [pollId: string]: string[] }>({});
  const [isLoading, setIsLoading] = useState(true);

  // Initialize app data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check for stored user session (in a real app, this would be from localStorage/cookies)
        const storedUser = localStorage.getItem('votehub_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        // Load initial data
        const [pollsData, votesData] = await Promise.all([
          mockPollsApi.getPolls(),
          mockPollsApi.getUserVotes(),
        ]);

        setPolls(pollsData);
        setUserVotes(votesData);
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const userData = await mockAuthApi.login(email, password);
    setUser(userData);
    localStorage.setItem('votehub_user', JSON.stringify(userData));
    return userData;
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    const userData = await mockAuthApi.register(email, password, name);
    setUser(userData);
    localStorage.setItem('votehub_user', JSON.stringify(userData));
    return userData;
  };

  const handleLogout = async () => {
    await mockAuthApi.logout();
    setUser(null);
    localStorage.removeItem('votehub_user');
  };

  const handleCreatePoll = async (pollData: any) => {
    const newPoll = await mockPollsApi.createPoll(pollData);
    setPolls(prev => [newPoll, ...prev]);
    return newPoll;
  };

  const handleVote = async (pollId: string, optionIds: string[]) => {
    await mockPollsApi.vote(pollId, optionIds);
    
    // Update local state
    setUserVotes(prev => ({ ...prev, [pollId]: optionIds }));
    
    // Update poll data
    const updatedPolls = await mockPollsApi.getPolls();
    setPolls(updatedPolls);
  };

  const loadPolls = async () => {
    setIsLoading(true);
    try {
      const pollsData = await mockPollsApi.getPolls();
      setPolls(pollsData);
    } catch (error) {
      console.error('Failed to load polls:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navigation user={user} onSignOut={handleLogout} />
            <main>
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <Index 
                      polls={polls}
                      userVotes={userVotes}
                      user={user}
                      isLoading={isLoading}
                      onLoadPolls={loadPolls}
                    />
                  } 
                />
                <Route 
                  path="/poll/:id" 
                  element={
                    <PollDetailsPage 
                      polls={polls}
                      userVotes={userVotes}
                      onVote={handleVote}
                    />
                  } 
                />
                <Route 
                  path="/create" 
                  element={
                    <CreatePollPage 
                      user={user}
                      onCreatePoll={handleCreatePoll}
                    />
                  } 
                />
                <Route 
                  path="/login" 
                  element={
                    <AuthPage 
                      mode="login"
                      onLogin={handleLogin}
                      onRegister={handleRegister}
                    />
                  } 
                />
                <Route 
                  path="/register" 
                  element={
                    <AuthPage 
                      mode="register"
                      onLogin={handleLogin}
                      onRegister={handleRegister}
                    />
                  } 
                />
                <Route 
                  path="/history" 
                  element={
                    <VoteHistoryPage 
                      user={user}
                    />
                  } 
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
