import { Navigate, useNavigate } from "react-router-dom";
import CreatePollForm from "@/components/voting/CreatePollForm";
import { CreatePollData, User } from "@/types/voting";
import { toast } from "@/hooks/use-toast";

interface CreatePollPageProps {
  user?: User;
  onCreatePoll: (data: CreatePollData) => Promise<any>;
}

const CreatePollPage = ({ user, onCreatePoll }: CreatePollPageProps) => {
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  if (!user) {
    toast({
      title: "Authentication Required",
      description: "Please sign in to create polls.",
      variant: "destructive",
    });
    return <Navigate to="/login" replace />;
  }

  const handleCreatePoll = async (data: CreatePollData) => {
    try {
      const newPoll = await onCreatePoll(data);
      
      // Navigate to the new poll
      navigate(`/poll/${newPoll.id}`);
    } catch (error) {
      console.error("Failed to create poll:", error);
      throw error;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <CreatePollForm onSubmit={handleCreatePoll} />
    </div>
  );
};

export default CreatePollPage;