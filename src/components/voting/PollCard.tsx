import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Users, Clock, CheckCircle, XCircle } from "lucide-react";
import { Poll } from "@/types/voting";
import { cn } from "@/lib/utils";

interface PollCardProps {
  poll: Poll;
  hasVoted?: boolean;
  isPreview?: boolean;
  className?: string;
}

const PollCard = ({ poll, hasVoted = false, isPreview = false, className }: PollCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const isActive = poll.is_active && new Date(poll.end_date) > new Date();
  const isExpired = new Date(poll.end_date) < new Date();
  const timeRemaining = Math.max(0, new Date(poll.end_date).getTime() - new Date().getTime());
  const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  const getStatusBadge = () => {
    if (isExpired) {
      return (
        <Badge variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20">
          <XCircle className="h-3 w-3 mr-1" />
          Expired
        </Badge>
      );
    }
    if (hasVoted) {
      return (
        <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
          <CheckCircle className="h-3 w-3 mr-1" />
          Voted
        </Badge>
      );
    }
    if (isActive) {
      return (
        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
          <Clock className="h-3 w-3 mr-1" />
          Active
        </Badge>
      );
    }
    return null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card 
      className={cn(
        "vote-card transition-all duration-300 group cursor-pointer",
        isHovered && "shadow-elegant scale-[1.02]",
        hasVoted && "border-success/30",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-primary text-white text-sm">
                {poll.creator_name?.charAt(0)?.toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{poll.creator_name || "Anonymous"}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(poll.created_at)}
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        <div>
          <CardTitle className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
            {poll.title}
          </CardTitle>
          <CardDescription className="mt-2 line-clamp-2">
            {poll.description}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Vote Progress Preview */}
        {poll.total_votes > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Votes</span>
              <span className="font-medium">{poll.total_votes}</span>
            </div>
            {poll.options.slice(0, 2).map((option) => (
              <div key={option.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="truncate">{option.text}</span>
                  <span className="text-muted-foreground">{option.percentage}%</span>
                </div>
                <Progress value={option.percentage} className="h-2" />
              </div>
            ))}
            {poll.options.length > 2 && (
              <p className="text-xs text-muted-foreground text-center">
                +{poll.options.length - 2} more options
              </p>
            )}
          </div>
        )}

        {/* Poll Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{poll.total_votes} votes</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>
                {isExpired 
                  ? "Ended" 
                  : daysRemaining > 0 
                    ? `${daysRemaining}d left` 
                    : `${hoursRemaining}h left`
                }
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t border-border">
        <Button 
          asChild 
          variant={hasVoted ? "secondary" : "default"} 
          className="w-full transition-smooth"
          disabled={isExpired}
        >
          <Link to={`/poll/${poll.id}`}>
            {isExpired 
              ? "View Results" 
              : hasVoted 
                ? "View Results" 
                : "Vote Now"
            }
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PollCard;