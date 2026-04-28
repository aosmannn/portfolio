export interface Project {
  title: string;
  description: string;
  stack: string[];
  href: string;
  status: "live" | "coming-soon" | "open-source";
}

export const projects: Project[] = [
  {
    title: "CourseConnect AI",
    description:
      "AI-powered syllabus reader and class assistant for college students. Parses syllabi, extracts deadlines and grading policies, and provides context-aware tutoring via vector search.",
    stack: ["Next.js", "React 19", "Claude AI", "Supabase"],
    href: "https://www.courseconnectai.com",
    status: "live",
  },
  {
    title: "GaitGuard AI",
    description:
      "iOS + watchOS app that monitors gait via Apple Watch and delivers rhythmic haptic cueing for Parkinson's patients to improve movement confidence.",
    stack: ["Swift", "SwiftUI", "HealthKit", "WatchConnectivity"],
    href: "https://github.com/aosmannn/GAITGUARD",
    status: "open-source",
  },
  {
    title: "PlanDrop",
    description:
      "Friend-group activity planner with AI-generated plans and real-time claim mechanics. Integrates Google Places and live Supabase updates for a dynamic planning experience.",
    stack: ["Next.js", "Supabase", "Claude AI", "Google Places"],
    href: "https://github.com/aosmannn/PlanDrop-1",
    status: "open-source",
  },
];
