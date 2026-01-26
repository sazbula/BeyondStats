// src/lib/whatYouCanDoBank.ts

export type Severity = "low" | "middle" | "high";
export type ActionTag =
  | "work"
  | "daily"
  | "community"
  | "money"
  | "policy"
  | "mentalHealth"
  | "relationships";

export interface ActionItem {
  id: string;
  severity: Severity;
  text: string;
  tag?: ActionTag;
}

export const WHAT_YOU_CAN_DO: ActionItem[] = [
  // =========================
  // LOW (>= 75) — small, easy
  // =========================
  {
    id: "a2",
    severity: "low",
    tag: "daily",
    text: "Call out biased language when it happens (calmly and specifically), especially in group settings.",
  },
  {
    id: "a6",
    severity: "low",
    tag: "daily",
    text: "Support women-owned businesses and creators when you can, and recommend them to others.",
  },
  {
    id: "low_1",
    severity: "low",
    tag: "work",
    text: "In group work, make credit explicit: name who did what, and avoid letting ideas get “re-assigned.”",
  },
  {
    id: "men_low_1",
    severity: "low",
    tag: "mentalHealth",
    text: "Normalize men talking about stress and mental health by checking in and responding without judgment or jokes.",
  },
  {
    id: "men_low_2",
    severity: "low",
    tag: "relationships",
    text: "Encourage healthy masculinity: praise empathy, emotional honesty, and respectful behavior—not aggression or dominance.",
  },

  // =========================
  // MIDDLE (60–74) — involved
  // =========================
  {
    id: "a1",
    severity: "middle",
    tag: "work",
    text: "In your workplace or classes, push for transparent criteria for promotions, pay, and leadership roles.",
  },
  {
    id: "a3",
    severity: "middle",
    tag: "community",
    text: "Volunteer skills (CV reviews, tutoring, interview prep) through local programs supporting women and girls.",
  },
  {
    id: "a7",
    severity: "middle",
    tag: "community",
    text: "Share practical resources (hotlines, shelters, legal aid) in your network—people often don’t know what exists.",
  },
  {
    id: "a8",
    severity: "middle",
    tag: "work",
    text: "If you lead a team or project, track speaking time and decisions so everyone is heard and credited.",
  },
  {
    id: "mid_1",
    severity: "middle",
    tag: "work",
    text: "Mentor or sponsor someone (especially early-career) and help them access opportunities, not just advice.",
  },
  {
    id: "men_mid_1",
    severity: "middle",
    tag: "mentalHealth",
    text: "Support men’s mental health access: share therapy/helpline resources and treat help-seeking as normal, not weak.",
  },
  {
    id: "men_mid_2",
    severity: "middle",
    tag: "relationships",
    text: "Model fair sharing of unpaid work (planning, chores, caregiving) and talk about it openly with friends/partners.",
  },

  // =========================
  // HIGH (< 60) — strongest
  // =========================
  {
    id: "a4",
    severity: "high",
    tag: "money",
    text: "Donate regularly—even small amounts—to vetted orgs focused on education, legal support, or safety.",
  },
  {
    id: "a5",
    severity: "high",
    tag: "policy",
    text: "Vote and advocate for policies that expand childcare access, equal pay enforcement, and protection from violence.",
  },
  {
    id: "high_1",
    severity: "high",
    tag: "policy",
    text: "Support workplace policies that materially change outcomes: paid parental leave, flexible work, and anti-harassment enforcement.",
  },
  {
    id: "high_2",
    severity: "high",
    tag: "community",
    text: "If someone is at risk, help them reach support safely (hotlines, shelters, legal aid) and stay with them through the first steps.",
  },
  {
    id: "men_high_1",
    severity: "high",
    tag: "mentalHealth",
    text: "Actively challenge stigma that blocks men from getting help (e.g., “man up” culture) and promote safer, supportive norms.",
  },
];
