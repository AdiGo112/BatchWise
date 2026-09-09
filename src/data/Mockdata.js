// Content data for BatchWise.
// The user directory lives in Users.js and is re-exported here so existing
// imports keep working -- there is exactly ONE list of users in the app now.

import { users, getUserById } from './Users'
export { users, getUserById }

// Seed timestamps are relative to page load, so "2 hours ago" and the
// 3-day trending window stay true no matter when the demo is opened.
const hoursAgo = (h) => new Date(Date.now() - h * 3600 * 1000).toISOString()


// Communities
export const communities = [
  {
    id: 1,
    name: "DSA & Competitive Programming",
    description: "Discuss data structures, algorithms, and competitive programming problems",
    memberCount: 2347,
    members: [1, 2, 4, 6, 7, 8]
  },
  {
    id: 2,
    name: "ML & AI",
    description: "Machine Learning, Deep Learning, and AI research discussions",
    memberCount: 1823,
    members: [1, 2, 5, 6, 10]
  },
  {
    id: 3,
    name: "Resume Review",
    description: "Get your resume reviewed by peers and alumni",
    memberCount: 3142,
    members: [1, 4, 6, 7, 8]
  },
  {
    id: 4,
    name: "Campus Beauties",
    description: "Discuss campus life, events, and student activities",
    memberCount: 892,
    members: [4, 6, 7, 8]
  },
  {
    id: 5,
    name: "Web Development",
    description: "Frontend, Backend, Full-stack development discussions",
    memberCount: 1654,
    members: [1, 2, 5, 6, 7]
  },
  {
    id: 6,
    name: "Product Management",
    description: "PM interview prep, product discussions, and case studies",
    memberCount: 745,
    members: [2, 5, 8, 10]
  }
];

// Companies
export const companies = [
  {
    id: 1,
    name: "Google",
    logo: "🔍"
  },
  {
    id: 2,
    name: "Microsoft",
    logo: "🪟"
  },
  {
    id: 3,
    name: "Amazon",
    logo: "📦"
  },
  {
    id: 4,
    name: "Goldman Sachs",
    logo: "💰"
  },
  {
    id: 5,
    name: "Meta",
    logo: "👍"
  },
  {
    id: 6,
    name: "Apple",
    logo: "🍎"
  },
  {
    id: 7,
    name: "Netflix",
    logo: "🎬"
  },
  {
    id: 8,
    name: "Uber",
    logo: "🚗"
  }
];

// Resources
export const resources = [
  {
    id: 1,
    title: "Striver's SDE Sheet",
    description: "180 most important DSA problems for interviews",
    category: "DSA",
    url: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/",
    upvotes: 1247
  },
  {
    id: 2,
    title: "NeetCode 150",
    description: "150 LeetCode problems covering all patterns",
    category: "DSA",
    url: "https://neetcode.io/practice",
    upvotes: 892
  },
  {
    id: 3,
    title: "Resume Template - Software Engineer",
    description: "ATS-friendly resume template for tech roles",
    category: "Resume",
    url: "https://www.overleaf.com/latex/templates/jakes-resume/syzfjbzwjncs",
    upvotes: 1534
  },
  {
    id: 4,
    title: "System Design Primer",
    description: "Complete guide to system design interviews",
    category: "Interview Prep",
    url: "https://github.com/donnemartin/system-design-primer",
    upvotes: 2145
  },
  {
    id: 5,
    title: "Behavioral Interview Guide",
    description: "STAR method and common behavioral questions",
    category: "Interview Prep",
    url: "https://www.themuse.com/advice/star-interview-method",
    upvotes: 678
  },
  {
    id: 6,
    title: "Salary Negotiation Guide",
    description: "How to negotiate your tech job offer",
    category: "Career",
    url: "https://www.levels.fyi/",
    upvotes: 945
  }
];

// Posts - comprehensive mock data
export const initialPosts = [
  {
    id: 1,
    title: "TPO Update: Infosys Campus Drive Details",
    content: "Infosys will be conducting on-campus interviews for pre-final and final year students. Eligibility: CSE, IT, ECE branches with CGPA > 7.0. Registration deadline is Feb 5th on the placement portal. The drive will consist of aptitude test, technical interview, and HR round. Register early!",
    authorId: 3,
    communityId: null,
    companyId: null,
    postType: "Announcement",
    upvotes: [2, 4, 5, 6, 7, 8],
    downvotes: [],
    comments: [],
    createdAt: hoursAgo(2),
    isPinned: true
  },
  {
    id: 2,
    title: "Google SDE Internship Interview Experience",
    content: "Just finished my Google interview process for SDE Intern role. Here's my detailed experience:\n\nRound 1 (Phone Screen): Asked about my projects, then a medium-level array problem. Solved it in 30 minutes with optimal solution.\n\nRound 2 (Technical): Graph problem (similar to course schedule). Had to think about topological sort. Interviewer was very helpful.\n\nRound 3 (Technical): System design lite - design a URL shortener. Discussed database choices, API design, and scalability.\n\nRound 4 (Behavioral): Talked about team conflicts, leadership experiences, and why Google.\n\nGot the offer after 2 weeks! Happy to answer questions.",
    authorId: 2,
    communityId: 1,
    companyId: 1,
    postType: "Interview Experience",
    upvotes: [1, 4, 6, 7, 8, 10],
    downvotes: [],
    comments: [],
    createdAt: hoursAgo(5),
    isPinned: false
  },
  {
    id: 3,
    title: "Tips for First-Year Internships?",
    content: "I'm a first-year CS student looking for summer internships. What should I focus on? LeetCode, projects, or something else? How many problems should I solve? Any specific project ideas? Would really appreciate guidance from seniors and alumni!",
    authorId: 4,
    communityId: 3,
    companyId: null,
    postType: "Question",
    upvotes: [1, 2, 6, 8],
    downvotes: [],
    comments: [],
    createdAt: hoursAgo(9),
    isPinned: false
  },
  {
    id: 4,
    title: "Referral for Microsoft SDE?",
    content: "Looking for a referral for Microsoft SDE role. I have 2 years of experience in full-stack development (React, Node.js, PostgreSQL). Currently working at a startup. Strong DSA background (solved 300+ LeetCode). Happy to share my resume. Thanks in advance!",
    authorId: 5,
    communityId: null,
    companyId: 2,
    postType: "Question",
    upvotes: [1, 6],
    downvotes: [],
    comments: [],
    createdAt: hoursAgo(14),
    isPinned: false
  },
  {
    id: 5,
    title: "Amazon SDE Intern OA Experience",
    content: "Completed the Amazon online assessment yesterday. Sharing my experience:\n\nQuestion 1: Array manipulation - given an array, find max sum subarray with at most k distinct elements. Medium difficulty.\n\nQuestion 2: Graph problem - shortest path with constraints. Had to use modified Dijkstra's.\n\nWorkstyle Assessment: 20 questions about work preferences. Be honest!\n\nTime: 2 hours total. Managed to solve both coding questions. Waiting for results now.",
    authorId: 6,
    communityId: 1,
    companyId: 3,
    postType: "Interview Experience",
    upvotes: [1, 4, 7, 8],
    downvotes: [],
    comments: [],
    createdAt: hoursAgo(20),
    isPinned: false
  },
  {
    id: 6,
    title: "How to prepare for system design interviews?",
    content: "I have interviews coming up in 2 months with FAANG companies. What resources did you use to prepare for system design rounds? Is Grokking System Design enough? Should I also read Designing Data-Intensive Applications? Any other recommendations?",
    authorId: 7,
    communityId: 2,
    companyId: null,
    postType: "Question",
    upvotes: [1, 2, 5, 6, 8],
    downvotes: [],
    comments: [],
    createdAt: hoursAgo(30),
    isPinned: false
  },
  {
    id: 7,
    title: "Placement Committee: Resume Review Sessions This Week",
    content: "The placement committee will be conducting resume review sessions on Feb 2nd and 3rd. Book your slots on the placement portal. We'll provide feedback on:\n- ATS optimization\n- Content structure\n- Project descriptions\n- Skills section\n\nLimited slots available. Book ASAP!",
    authorId: 9,
    communityId: 3,
    companyId: null,
    postType: "Announcement",
    upvotes: [1, 4, 6, 7, 8],
    downvotes: [],
    comments: [],
    createdAt: hoursAgo(44),
    isPinned: false
  },
  {
    id: 8,
    title: "Goldman Sachs Interview - What to expect?",
    content: "I have my Goldman Sachs interview next week for the Analyst position. For those who've been through it, what should I prepare? Is it more focused on CS fundamentals or finance domain knowledge? Any specific topics I should brush up on?",
    authorId: 8,
    communityId: null,
    companyId: 4,
    postType: "Question",
    upvotes: [1, 2, 5, 10],
    downvotes: [],
    comments: [],
    createdAt: hoursAgo(56),
    isPinned: false
  },
  {
    id: 9,
    title: "Built a LeetCode Clone - Seeking Feedback",
    content: "Just deployed my LeetCode clone project! Features:\n- Code editor with syntax highlighting\n- Test case execution\n- Leaderboard\n- Discussion forum\n\nTech stack: React, Express, MongoDB, Judge0 API\nLive: [mock-link]\nGitHub: [mock-link]\n\nWould love your feedback and suggestions!",
    authorId: 1,
    communityId: 5,
    companyId: null,
    postType: "Discussion",
    upvotes: [2, 4, 6, 7, 8],
    downvotes: [],
    comments: [],
    createdAt: hoursAgo(26),
    isPinned: false
  },
  {
    id: 10,
    title: "Meta ML Engineer Interview Questions",
    content: "Sharing questions I encountered during Meta ML Engineer interviews:\n\nML Round 1:\n- Explain backpropagation in detail\n- Difference between L1 and L2 regularization\n- How to handle imbalanced datasets\n- Design a recommendation system\n\nML Round 2:\n- Code a neural network from scratch (NumPy only)\n- Optimize a given model architecture\n- Discuss production ML pipelines\n\nCoding rounds were standard LC medium/hard.\n\nHappy to discuss in detail!",
    authorId: 10,
    communityId: 2,
    companyId: 5,
    postType: "Interview Experience",
    upvotes: [1, 6, 7],
    downvotes: [],
    comments: [],
    createdAt: hoursAgo(70),
    isPinned: false
  },
  {
    id: 11,
    title: "Best YouTube channels for interview prep?",
    content: "Looking for good YouTube channels specifically for:\n- System design\n- Behavioral interviews\n- Product management concepts\n\nI already follow NeetCode and Tech Dummies. Any other recommendations?",
    authorId: 4,
    communityId: null,
    companyId: null,
    postType: "Question",
    upvotes: [1, 6, 8],
    downvotes: [],
    comments: [],
    createdAt: hoursAgo(96),
    isPinned: false
  },
  {
    id: 12,
    title: "Campus Placement Statistics 2023-24",
    content: "Final placement statistics for our batch:\n\nTotal students: 450\nPlaced: 398 (88.4%)\nAverage CTC: 12.5 LPA\nHighest CTC: 58 LPA\nMedian CTC: 10 LPA\n\nTop recruiters: Amazon (45), Microsoft (32), Google (18), Goldman Sachs (15)\n\nCongratulations to everyone!",
    authorId: 9,
    communityId: null,
    companyId: null,
    postType: "Announcement",
    upvotes: [1, 2, 4, 5, 6, 7, 8, 10],
    downvotes: [],
    comments: [],
    createdAt: hoursAgo(130),
    isPinned: true
  }
];

// Helper function to get community by id
export const getCommunityById = (id) => communities.find(c => c.id === id);

// Helper function to get company by id
export const getCompanyById = (id) => companies.find(c => c.id === id);

// A discussion platform that demos with zero comments sells itself short.
// Seeded here rather than inline so the post array above stays readable.
const seedComments = (postId, comments) => {
  const post = initialPosts.find(p => p.id === postId);
  if (post) post.comments = comments;
};

let seedId = 1000;
const c = (authorId, content, hours, upvotes = [], replies = []) => ({
  id: seedId++,
  authorId,
  content,
  createdAt: hoursAgo(hours),
  upvotes,
  downvotes: [],
  parentCommentId: null,
  replies: replies.map(r => ({ ...r, parentCommentId: seedId - 1 }))
});

seedComments(2, [
  c(1, "This is gold, thanks for writing it up. How long between the phone screen and round 2?", 4, [4, 6], [
    { id: 900, authorId: 2, content: "About 8 days. They batch the onsite rounds, so it depends on the panel.", createdAt: hoursAgo(3), upvotes: [1], downvotes: [], replies: [] }
  ]),
  c(5, "Did they let you pick the language for the coding rounds?", 3, [1]),
  c(4, "Topological sort shows up constantly at Google. Practice course schedule I and II.", 2, [1, 5, 7, 8])
]);

seedComments(4, [
  c(6, "Take the offer with the better team, not the better number. The 2 LPA gap disappears after one switch.", 10, [1, 2, 5, 7, 9]),
  c(10, "Agreed. Also check the on-call rotation before you sign anything.", 8, [1, 6])
]);

seedComments(6, [
  c(9, "Saved. The system design primer link alone was worth it.", 6, [1, 3]),
  c(3, "Adding to this: do mock interviews out loud. Reading solutions silently is not preparation.", 5, [1, 2, 5, 8, 9])
]);

seedComments(11, [
  c(2, "Gaurav Sen for system design, and Exponent for PM and behavioural.", 100, [1, 4, 5]),
  c(7, "Jeff Su has genuinely good behavioural interview content.", 90, [4])
]);
