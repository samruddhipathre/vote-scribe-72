import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Vote, Plus, Search, Filter, TrendingUp, Clock, Users, BarChart3 } from "lucide-react";
import PollCard from "@/components/voting/PollCard";
import { Poll, PollStats } from "@/types/voting";
import { cn } from "@/lib/utils";

interface PollsPageProps {
  polls: Poll[];
  userVotes: { [pollId: string]: string[] };
  user?: {
    id: string;
    email: string;
    name?: string;
    role: 'user' | 'admin';
  };
  isLoading?: boolean;
  onLoadPolls: () => void;
}

const PollsPage = ({ polls, userVotes, user, isLoading = false, onLoadPolls }: PollsPageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular" | "ending">("newest");
  const [filterBy, setFilterBy] = useState<"all" | "active" | "voted" | "created">("all");
  const [stats, setStats] = useState<PollStats>({
    total_polls: 0,
    total_votes: 0,
    active_polls: 0,
    my_polls: 0,
  });

  useEffect(() => {
    onLoadPolls();
  }, []);

  useEffect(() => {
    // Calculate stats from polls
    const activePolls = polls.filter(p => p.is_active && new Date(p.end_date) > new Date());
    const myPolls = polls.filter(p => p.creator_id === user?.id);
    const totalVotes = polls.reduce((sum, p) => sum + p.total_votes, 0);

    setStats({
      total_polls: polls.length,
      total_votes: totalVotes,
      active_polls: activePolls.length,
      my_polls: myPolls.length,
    });
  }, [polls, user]);

  // Filter and sort polls
  const filteredPolls = polls
    .filter(poll => {
      // Search filter
      const matchesSearch = poll.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           poll.description.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // Category filter
      switch (filterBy) {
        case "active":
          return poll.is_active && new Date(poll.end_date) > new Date();
        case "voted":
          return userVotes[poll.id] && userVotes[poll.id].length > 0;
        case "created":
          return poll.creator_id === user?.id;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "popular":
          return b.total_votes - a.total_votes;
        case "ending":
          return new Date(a.end_date).getTime() - new Date(b.end_date).getTime();
        default: // newest
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    description, 
    gradient = false 
  }: { 
    title: string;
    value: number;
    icon: any;
    description: string;
    gradient?: boolean;
  }) => (
    <Card className={cn("vote-card", gradient && "gradient-secondary")}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className={cn(
            "p-3 rounded-lg",
            gradient ? "bg-white/20" : "gradient-primary"
          )}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <section className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="gradient-hero p-4 rounded-2xl">
            <Vote className="h-12 w-12 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Welcome to VoteHub
          </h1>
          <p className="text-xl text-muted-foreground mt-2 max-w-2xl mx-auto">
            Create secure polls, gather opinions, and make data-driven decisions with our 
            professional voting platform.
          </p>
        </div>
        {user && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gradient-primary text-white">
              <Link to="/create">
                <Plus className="h-5 w-5 mr-2" />
                Create New Poll
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/history">
                <BarChart3 className="h-5 w-5 mr-2" />
                View My Votes
              </Link>
            </Button>
          </div>
        )}
        {!user && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gradient-primary text-white">
              <Link to="/register">
                <Plus className="h-5 w-5 mr-2" />
                Get Started Free
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/login">
                Sign In
              </Link>
            </Button>
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Polls"
          value={stats.total_polls}
          icon={Vote}
          description="Active and completed polls"
          gradient
        />
        <StatCard
          title="Total Votes"
          value={stats.total_votes}
          icon={TrendingUp}
          description="Votes cast across all polls"
        />
        <StatCard
          title="Active Polls"
          value={stats.active_polls}
          icon={Clock}
          description="Currently open for voting"
        />
        <StatCard
          title={user ? "My Polls" : "Categories"}
          value={user ? stats.my_polls : 5}
          icon={Users}
          description={user ? "Polls you created" : "Different poll types"}
        />
      </section>

      {/* Enhanced Search Section */}
      <section className="space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Find Your Perfect Poll</h2>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search polls by title, description, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-lg border-2 focus:border-primary rounded-xl shadow-elegant"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold">
              {searchQuery ? `Results for "${searchQuery}"` : "All Polls"}
            </h3>
            <Badge variant="secondary" className="text-sm">
              {filteredPolls.length} found
            </Badge>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">            
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
              <SelectTrigger className="w-full sm:w-44">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">📅 Newest First</SelectItem>
                <SelectItem value="oldest">📅 Oldest First</SelectItem>
                <SelectItem value="popular">🔥 Most Popular</SelectItem>
                <SelectItem value="ending">⏰ Ending Soon</SelectItem>
              </SelectContent>
            </Select>

            {user && (
              <Select value={filterBy} onValueChange={(value) => setFilterBy(value as any)}>
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">🗳️ All Polls</SelectItem>
                  <SelectItem value="active">✅ Active Only</SelectItem>
                  <SelectItem value="voted">✏️ My Votes</SelectItem>
                  <SelectItem value="created">👤 My Polls</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Polls Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="vote-card animate-pulse">
                <CardHeader className="space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-6 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPolls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPolls.map((poll) => (
              <PollCard
                key={poll.id}
                poll={poll}
                hasVoted={userVotes[poll.id] && userVotes[poll.id].length > 0}
              />
            ))}
          </div>
        ) : (
          <Card className="vote-card">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Vote className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Polls Found</h3>
              <p className="text-muted-foreground text-center mb-6">
                {searchQuery 
                  ? "No polls match your search criteria. Try adjusting your filters."
                  : "There are no polls available at the moment."
                }
              </p>
              {user && (
                <Button asChild className="gradient-primary text-white">
                  <Link to="/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create the First Poll
                  </Link>
                </Button>
              )}
              {!user && (
                <Button asChild className="gradient-primary text-white">
                  <Link to="/register">
                    <Plus className="h-4 w-4 mr-2" />
                    Sign Up to Create Polls
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
};

export default PollsPage;