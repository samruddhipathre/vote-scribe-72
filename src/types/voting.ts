// Core types for the voting platform
export interface Poll {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
  creator_id: string;
  creator_name?: string;
  start_date: string;
  end_date: string;
  max_votes_per_user: number;
  is_active: boolean;
  total_votes: number;
  created_at: string;
  updated_at: string;
}

export interface PollOption {
  id: string;
  poll_id: string;
  text: string;
  vote_count: number;
  percentage: number;
}

export interface Vote {
  id: string;
  user_id: string;
  poll_id: string;
  option_id: string;
  created_at: string;
  ip_address?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface VoteHistory {
  poll_id: string;
  poll_title: string;
  option_text: string;
  voted_at: string;
}

export interface CreatePollData {
  title: string;
  description: string;
  options: string[];
  start_date: string;
  end_date: string;
  max_votes_per_user: number;
}

export interface PollStats {
  total_polls: number;
  total_votes: number;
  active_polls: number;
  my_polls: number;
}