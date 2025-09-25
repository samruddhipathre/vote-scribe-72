// Mock data for development and demo purposes
import { Poll, User, Vote, VoteHistory } from "@/types/voting";

export const mockUser: User = {
  id: "user-1",
  email: "demo@votehub.com",
  name: "Demo User",
  role: "admin",
  created_at: new Date().toISOString(),
};

export const mockPolls: Poll[] = [
  {
    id: "poll-1",
    title: "What's your favorite programming language for web development?",
    description: "We're curious about the community's preference for web development technologies. This poll will help us understand current trends.",
    options: [
      { id: "opt-1", poll_id: "poll-1", text: "JavaScript/TypeScript", vote_count: 45, percentage: 42.1 },
      { id: "opt-2", poll_id: "poll-1", text: "Python", vote_count: 32, percentage: 29.9 },
      { id: "opt-3", poll_id: "poll-1", text: "Java", vote_count: 18, percentage: 16.8 },
      { id: "opt-4", poll_id: "poll-1", text: "C#", vote_count: 12, percentage: 11.2 },
    ],
    creator_id: "user-2",
    creator_name: "Tech Survey Team",
    start_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    max_votes_per_user: 1,
    is_active: true,
    total_votes: 107,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "poll-2",
    title: "Which remote work benefits do you value most?",
    description: "As companies adapt to remote work, we want to understand what benefits employees value most in a distributed work environment.",
    options: [
      { id: "opt-5", poll_id: "poll-2", text: "Flexible working hours", vote_count: 78, percentage: 35.1 },
      { id: "opt-6", poll_id: "poll-2", text: "Home office stipend", vote_count: 56, percentage: 25.2 },
      { id: "opt-7", poll_id: "poll-2", text: "Mental health support", vote_count: 43, percentage: 19.4 },
      { id: "opt-8", poll_id: "poll-2", text: "Professional development budget", vote_count: 28, percentage: 12.6 },
      { id: "opt-9", poll_id: "poll-2", text: "Co-working space access", vote_count: 17, percentage: 7.7 },
    ],
    creator_id: "user-3",
    creator_name: "HR Research Team",
    start_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    max_votes_per_user: 2,
    is_active: true,
    total_votes: 222,
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "poll-3",
    title: "Best time for team meetings?",
    description: "Help us find the optimal time slot for our weekly all-hands meetings that works for everyone across different time zones.",
    options: [
      { id: "opt-10", poll_id: "poll-3", text: "9:00 AM EST", vote_count: 23, percentage: 31.5 },
      { id: "opt-11", poll_id: "poll-3", text: "1:00 PM EST", vote_count: 28, percentage: 38.4 },
      { id: "opt-12", poll_id: "poll-3", text: "3:00 PM EST", vote_count: 15, percentage: 20.5 },
      { id: "opt-13", poll_id: "poll-3", text: "5:00 PM EST", vote_count: 7, percentage: 9.6 },
    ],
    creator_id: "user-1",
    creator_name: "Demo User",
    start_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    max_votes_per_user: 1,
    is_active: true,
    total_votes: 73,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "poll-4",
    title: "Which features should we prioritize in our mobile app?",
    description: "We're planning our mobile app roadmap and want to focus on features that matter most to our users. Select up to 3 options.",
    options: [
      { id: "opt-14", poll_id: "poll-4", text: "Offline functionality", vote_count: 42, percentage: 18.9 },
      { id: "opt-15", poll_id: "poll-4", text: "Push notifications", vote_count: 38, percentage: 17.1 },
      { id: "opt-16", poll_id: "poll-4", text: "Dark mode theme", vote_count: 45, percentage: 20.3 },
      { id: "opt-17", poll_id: "poll-4", text: "Voice commands", vote_count: 25, percentage: 11.3 },
      { id: "opt-18", poll_id: "poll-4", text: "Social sharing", vote_count: 31, percentage: 14.0 },
      { id: "opt-19", poll_id: "poll-4", text: "Advanced analytics", vote_count: 41, percentage: 18.4 },
    ],
    creator_id: "user-4",
    creator_name: "Product Team",
    start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    max_votes_per_user: 3,
    is_active: true,
    total_votes: 222,
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "poll-5",
    title: "Favorite season for outdoor activities?",
    description: "This poll ended last week. We were gathering data for planning our quarterly team building events.",
    options: [
      { id: "opt-20", poll_id: "poll-5", text: "Spring", vote_count: 34, percentage: 28.3 },
      { id: "opt-21", poll_id: "poll-5", text: "Summer", vote_count: 52, percentage: 43.3 },
      { id: "opt-22", poll_id: "poll-5", text: "Fall", vote_count: 28, percentage: 23.3 },
      { id: "opt-23", poll_id: "poll-5", text: "Winter", vote_count: 6, percentage: 5.0 },
    ],
    creator_id: "user-5",
    creator_name: "Events Team",
    start_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    max_votes_per_user: 1,
    is_active: false,
    total_votes: 120,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockUserVotes: { [pollId: string]: string[] } = {
  "poll-1": ["opt-1"], // Voted for JavaScript/TypeScript
  "poll-3": ["opt-11"], // Voted for 1:00 PM EST
  "poll-5": ["opt-21"], // Voted for Summer (in expired poll)
};

export const mockVoteHistory: VoteHistory[] = [
  {
    poll_id: "poll-1",
    poll_title: "What's your favorite programming language for web development?",
    option_text: "JavaScript/TypeScript",
    voted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    poll_id: "poll-3", 
    poll_title: "Best time for team meetings?",
    option_text: "1:00 PM EST",
    voted_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    poll_id: "poll-5",
    poll_title: "Favorite season for outdoor activities?",
    option_text: "Summer",
    voted_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Helper functions for mock API simulation
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const mockApiCall = async <T>(data: T, delayMs: number = 1000): Promise<T> => {
  await delay(delayMs);
  return data;
};

// Mock API functions
export const mockAuthApi = {
  login: async (email: string, password: string) => {
    await delay(1500);
    if (email === "demo@votehub.com" && password === "demo123") {
      return mockUser;
    }
    throw new Error("Invalid email or password");
  },

  register: async (email: string, password: string, name: string) => {
    await delay(1500);
    if (email === "existing@example.com") {
      throw new Error("An account with this email already exists");
    }
    return {
      ...mockUser,
      id: generateId(),
      email,
      name,
      role: "user" as const,
    };
  },

  logout: async () => {
    await delay(500);
    return true;
  },
};

export const mockPollsApi = {
  getPolls: async () => mockApiCall(mockPolls),
  
  getPoll: async (id: string) => {
    await delay(800);
    const poll = mockPolls.find(p => p.id === id);
    if (!poll) throw new Error("Poll not found");
    return poll;
  },

  createPoll: async (pollData: any) => {
    await delay(1200);
    const newPoll: Poll = {
      ...pollData,
      id: generateId(),
      creator_id: mockUser.id,
      creator_name: mockUser.name,
      is_active: true,
      total_votes: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      options: pollData.options.map((text: string, index: number) => ({
        id: generateId(),
        poll_id: generateId(),
        text,
        vote_count: 0,
        percentage: 0,
      })),
    };
    mockPolls.unshift(newPoll);
    return newPoll;
  },

  vote: async (pollId: string, optionIds: string[]) => {
    await delay(800);
    const poll = mockPolls.find(p => p.id === pollId);
    if (!poll) throw new Error("Poll not found");
    
    // Simulate updating vote counts
    optionIds.forEach(optionId => {
      const option = poll.options.find(o => o.id === optionId);
      if (option) {
        option.vote_count += 1;
      }
    });
    
    poll.total_votes += 1;
    
    // Recalculate percentages
    poll.options.forEach(option => {
      option.percentage = poll.total_votes > 0 ? 
        Math.round((option.vote_count / poll.total_votes) * 100) : 0;
    });

    // Update mock user votes
    mockUserVotes[pollId] = optionIds;
    
    return true;
  },

  getUserVotes: async () => mockApiCall(mockUserVotes),
  getVoteHistory: async () => mockApiCall(mockVoteHistory),
};