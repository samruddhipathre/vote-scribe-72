import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import VotingInterface from "@/components/voting/VotingInterface";
import { Poll } from "@/types/voting";
import { mockPollsApi } from "@/utils/mockData";

interface PollDetailsPageProps {
  polls: Poll[];
  userVotes: { [pollId: string]: string[] };
  onVote: (pollId: string, optionIds: string[]) => Promise<void>;
}

const PollDetailsPage = ({ polls, userVotes, onVote }: PollDetailsPageProps) => {
  const { id } = useParams<{ id: string }>();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadPoll = async () => {
      if (!id) {
        setError("No poll ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // First try to find in local polls data
        const localPoll = polls.find(p => p.id === id);
        if (localPoll) {
          setPoll(localPoll);
        } else {
          // If not found locally, try to fetch from API
          const fetchedPoll = await mockPollsApi.getPoll(id);
          setPoll(fetchedPoll);
        }
      } catch (err) {
        console.error("Failed to load poll:", err);
        setError("Poll not found or failed to load");
      } finally {
        setIsLoading(false);
      }
    };

    loadPoll();
  }, [id, polls]);

  // Update poll data when polls prop changes
  useEffect(() => {
    if (id && polls.length > 0) {
      const updatedPoll = polls.find(p => p.id === id);
      if (updatedPoll) {
        setPoll(updatedPoll);
      }
    }
  }, [polls, id]);

  const handleVote = async (optionIds: string[]) => {
    if (!poll?.id) return;
    
    try {
      await onVote(poll.id, optionIds);
    } catch (error) {
      console.error("Failed to submit vote:", error);
      throw error;
    }
  };

  if (!id) {
    return <Navigate to="/" replace />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <VotingInterface onVote={handleVote} />
      </div>
    );
  }

  const hasVoted = poll?.id ? userVotes[poll.id]?.length > 0 : false;
  const userVoteOptions = poll?.id ? userVotes[poll.id] || [] : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <VotingInterface
        poll={poll || undefined}
        hasVoted={hasVoted}
        userVotes={userVoteOptions}
        onVote={handleVote}
        isLoading={isLoading}
      />
    </div>
  );
};

export default PollDetailsPage;