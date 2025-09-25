import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Vote, 
  Clock, 
  Users, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  BarChart3,
  Share2,
  Download,
  ArrowLeft 
} from "lucide-react";
import { Poll, PollOption } from "@/types/voting";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface VotingInterfaceProps {
  poll?: Poll;
  hasVoted?: boolean;
  userVotes?: string[];
  onVote: (optionIds: string[]) => Promise<void>;
  isLoading?: boolean;
}

const VotingInterface = ({ 
  poll, 
  hasVoted = false, 
  userVotes = [], 
  onVote, 
  isLoading = false 
}: VotingInterfaceProps) => {
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isExpired = poll ? new Date(poll.end_date) < new Date() : false;
  const isActive = poll ? poll.is_active && !isExpired : false;
  const canVote = isActive && !hasVoted && !isLoading;
  const isMultiSelect = poll ? poll.max_votes_per_user > 1 : false;

  useEffect(() => {
    if (hasVoted && userVotes.length > 0) {
      setSelectedOptions(userVotes);
    }
  }, [hasVoted, userVotes]);

  const handleOptionChange = (optionId: string, checked: boolean) => {
    if (!canVote) return;

    if (isMultiSelect) {
      setSelectedOptions(prev => {
        if (checked) {
          if (prev.length < (poll?.max_votes_per_user || 1)) {
            return [...prev, optionId];
          } else {
            toast({
              title: "Vote Limit Reached",
              description: `You can only select up to ${poll?.max_votes_per_user} options.`,
              variant: "destructive",
            });
            return prev;
          }
        } else {
          return prev.filter(id => id !== optionId);
        }
      });
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleSubmitVote = async () => {
    if (!poll || selectedOptions.length === 0) return;

    try {
      setIsSubmitting(true);
      await onVote(selectedOptions);
      
      toast({
        title: "Vote Submitted Successfully",
        description: "Thank you for participating in this poll!",
      });
    } catch (error) {
      toast({
        title: "Error Submitting Vote",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Link Copied",
        description: "Poll link has been copied to your clipboard.",
      });
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const getTimeRemaining = () => {
    if (!poll) return "";
    
    const now = new Date().getTime();
    const endTime = new Date(poll.end_date).getTime();
    const timeLeft = endTime - now;

    if (timeLeft <= 0) return "Expired";

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  if (!poll) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="vote-card">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Poll Not Found</h3>
              <p className="text-muted-foreground mb-4">
                The poll you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate("/")} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Polls
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Poll Header */}
      <Card className="vote-card">
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Polls
            </Button>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-gradient-primary text-white">
                  {poll.creator_name?.charAt(0)?.toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{poll.creator_name || "Anonymous"}</p>
                <p className="text-sm text-muted-foreground">
                  Created {formatDate(poll.created_at)}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              {hasVoted && (
                <Badge className="bg-success/10 text-success border-success/20">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  You Voted
                </Badge>
              )}
              {isExpired ? (
                <Badge variant="destructive">
                  <Clock className="h-3 w-3 mr-1" />
                  Expired
                </Badge>
              ) : isActive ? (
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  <Clock className="h-3 w-3 mr-1" />
                  {getTimeRemaining()}
                </Badge>
              ) : (
                <Badge variant="secondary">
                  Scheduled
                </Badge>
              )}
            </div>
          </div>

          <div>
            <CardTitle className="text-2xl font-bold leading-tight">
              {poll.title}
            </CardTitle>
            <CardDescription className="mt-2 text-base">
              {poll.description}
            </CardDescription>
          </div>

          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>{poll.total_votes} votes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Ends {formatDate(poll.end_date)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Vote className="h-4 w-4" />
              <span>
                {poll.max_votes_per_user === 1 
                  ? "Single choice" 
                  : `Choose up to ${poll.max_votes_per_user}`
                }
              </span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Voting Section */}
      <Card className="vote-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span>{hasVoted || isExpired ? "Results" : "Cast Your Vote"}</span>
          </CardTitle>
          {canVote && (
            <CardDescription>
              {isMultiSelect 
                ? `Select up to ${poll.max_votes_per_user} options below and click vote.`
                : "Select one option below and click vote."
              }
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {!canVote && !hasVoted && !isExpired && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This poll is not currently active. Voting will open on {formatDate(poll.start_date)}.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            {isMultiSelect ? (
              // Multi-select voting
              <div className="space-y-3">
                {poll.options.map((option) => (
                  <div key={option.id} className="space-y-2">
                    <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                      <Checkbox
                        id={`option-${option.id}`}
                        checked={selectedOptions.includes(option.id)}
                        onCheckedChange={(checked) => handleOptionChange(option.id, !!checked)}
                        disabled={!canVote}
                      />
                      <Label 
                        htmlFor={`option-${option.id}`}
                        className="flex-1 cursor-pointer font-medium"
                      >
                        {option.text}
                      </Label>
                      {(hasVoted || isExpired) && (
                        <div className="text-sm text-muted-foreground">
                          {option.vote_count} votes ({option.percentage}%)
                        </div>
                      )}
                    </div>
                    {(hasVoted || isExpired) && (
                      <Progress value={option.percentage} className="h-2" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              // Single-select voting
              <RadioGroup
                value={selectedOptions[0] || ""}
                onValueChange={(value) => setSelectedOptions([value])}
                disabled={!canVote}
                className="space-y-3"
              >
                {poll.options.map((option) => (
                  <div key={option.id} className="space-y-2">
                    <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                      <RadioGroupItem 
                        value={option.id} 
                        id={`option-${option.id}`}
                        disabled={!canVote}
                      />
                      <Label 
                        htmlFor={`option-${option.id}`}
                        className="flex-1 cursor-pointer font-medium"
                      >
                        {option.text}
                      </Label>
                      {(hasVoted || isExpired) && (
                        <div className="text-sm text-muted-foreground">
                          {option.vote_count} votes ({option.percentage}%)
                        </div>
                      )}
                    </div>
                    {(hasVoted || isExpired) && (
                      <Progress value={option.percentage} className="h-2" />
                    )}
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>

          {canVote && (
            <>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {selectedOptions.length > 0 && (
                    <span>
                      {selectedOptions.length} of {poll.max_votes_per_user} selected
                    </span>
                  )}
                </div>
                <Button
                  onClick={handleSubmitVote}
                  disabled={selectedOptions.length === 0 || isSubmitting}
                  className="gradient-primary text-white"
                >
                  {isSubmitting ? "Submitting..." : `Submit Vote${selectedOptions.length > 1 ? 's' : ''}`}
                </Button>
              </div>
            </>
          )}

          {(hasVoted || isExpired) && (
            <>
              <Separator />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Total votes: {poll.total_votes}</span>
                {hasVoted && userVotes.length > 0 && (
                  <span>
                    Your vote{userVotes.length > 1 ? 's' : ''}: {
                      poll.options
                        .filter(opt => userVotes.includes(opt.id))
                        .map(opt => opt.text)
                        .join(", ")
                    }
                  </span>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VotingInterface;