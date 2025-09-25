import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Vote, ArrowRight, History, CheckCircle } from "lucide-react";
import { User, VoteHistory } from "@/types/voting";
import { mockPollsApi } from "@/utils/mockData";
import { toast } from "@/hooks/use-toast";

interface VoteHistoryPageProps {
  user?: User;
}

const VoteHistoryPage = ({ user }: VoteHistoryPageProps) => {
  const [voteHistory, setVoteHistory] = useState<VoteHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect to login if not authenticated
  if (!user) {
    toast({
      title: "Authentication Required",
      description: "Please sign in to view your vote history.",
      variant: "destructive",
    });
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const loadVoteHistory = async () => {
      try {
        setIsLoading(true);
        const history = await mockPollsApi.getVoteHistory();
        setVoteHistory(history);
      } catch (error) {
        console.error("Failed to load vote history:", error);
        toast({
          title: "Error Loading History",
          description: "Failed to load your voting history. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadVoteHistory();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="gradient-primary p-3 rounded-xl">
            <History className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Your Vote History</h1>
        <p className="text-muted-foreground">
          Track all the polls you've participated in and see your voting patterns.
        </p>
      </div>

      {/* Stats Card */}
      <Card className="vote-card mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Vote className="h-5 w-5 text-primary" />
            <span>Voting Statistics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">{voteHistory.length}</div>
              <div className="text-sm text-muted-foreground">Total Votes Cast</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {new Set(voteHistory.map(v => v.poll_id)).size}
              </div>
              <div className="text-sm text-muted-foreground">Polls Participated</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {voteHistory.length > 0 
                  ? Math.round((voteHistory.length / new Set(voteHistory.map(v => v.poll_id)).size) * 10) / 10
                  : 0
                }
              </div>
              <div className="text-sm text-muted-foreground">Avg Votes per Poll</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vote History List */}
      <Card className="vote-card">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your voting activity across all polls, from most recent to oldest.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-start space-x-4 p-4 border border-border rounded-lg">
                    <div className="w-8 h-8 bg-muted rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                      <div className="h-3 bg-muted rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : voteHistory.length > 0 ? (
            <div className="space-y-4">
              {voteHistory.map((vote, index) => (
                <div key={`${vote.poll_id}-${index}`}>
                  <div className="flex items-start space-x-4 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="mt-1">
                      <div className="gradient-primary p-2 rounded-full">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium leading-tight">{vote.poll_title}</h3>
                        <Badge variant="secondary" className="shrink-0 ml-2">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(vote.voted_at)}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-muted-foreground">Your choice:</span>
                        <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                          {vote.option_text}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="shrink-0"
                    >
                      <Link to={`/poll/${vote.poll_id}`}>
                        <span className="sr-only">View poll results</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  {index < voteHistory.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Vote className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Votes Yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't participated in any polls yet. Start voting to see your history here!
              </p>
              <Button asChild className="gradient-primary text-white">
                <Link to="/">
                  <Vote className="h-4 w-4 mr-2" />
                  Browse Polls
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VoteHistoryPage;