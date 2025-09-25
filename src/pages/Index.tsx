import PollsPage from "./PollsPage";
import { Poll, User } from "@/types/voting";

interface IndexProps {
  polls: Poll[];
  userVotes: { [pollId: string]: string[] };
  user?: User;
  isLoading?: boolean;
  onLoadPolls: () => void;
}

const Index = ({ polls, userVotes, user, isLoading, onLoadPolls }: IndexProps) => {
  return (
    <PollsPage 
      polls={polls}
      userVotes={userVotes}
      user={user}
      isLoading={isLoading}
      onLoadPolls={onLoadPolls}
    />
  );
};

export default Index;
