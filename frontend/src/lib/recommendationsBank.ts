// src/lib/recommendationsBank.ts

export type Front = "economic" | "social" | "physical";
export type Severity = "low" | "middle" | "high";

export interface RecItem {
  id: string;
  front: Front;
  severity: Severity;
  text: string;
}

export const REC_BANK: RecItem[] = [
  // ECONOMIC — LOW (>= 60)
  {
    id: "econ_low_1",
    front: "economic",
    severity: "low",
    text: "Focus on the remaining gaps in career progression (promotions, senior roles, leadership pipelines), not just participation.",
  },
  {
    id: "econ_low_2",
    front: "economic",
    severity: "low",
    text: "Track pay and income differences by sector and age to catch small but persistent gaps early.",
  },
  {
    id: "econ_low_3",
    front: "economic",
    severity: "low",
    text: "Target support to groups that often lag behind national averages (rural workers, migrants, single parents).",
  },

  // ECONOMIC — MIDDLE (30–59)
  {
    id: "econ_mid_1",
    front: "economic",
    severity: "middle",
    text: "Reduce barriers to stable work, especially childcare costs, transport constraints, and dependence on informal jobs.",
  },
  {
    id: "econ_mid_2",
    front: "economic",
    severity: "middle",
    text: "Expand access to upskilling for higher-paying sectors (digital, technical, trades) and measure job placement outcomes.",
  },
  {
    id: "econ_mid_3",
    front: "economic",
    severity: "middle",
    text: "Improve enforcement and reporting for workplace discrimination and pay practices to reduce unexplained gaps.",
  },

  // ECONOMIC — HIGH (< 30)
  {
    id: "econ_high_1",
    front: "economic",
    severity: "high",
    text: "Increase access to safe, paid work through local employment programs and basic worker protections.",
  },
  {
    id: "econ_high_2",
    front: "economic",
    severity: "high",
    text: "Address major constraints directly: legal restrictions, childcare availability, and safety risks that limit participation.",
  },
  {
    id: "econ_high_3",
    front: "economic",
    severity: "high",
    text: "Scale financial inclusion where it is a bottleneck: basic accounts, credit access, and accessible digital payments.",
  },

  // SOCIAL — LOW (>= 60)
  {
    id: "soc_low_1",
    front: "social",
    severity: "low",
    text: "Monitor outcomes for subgroups where gaps can be hidden in national averages (minorities, migrants, rural communities).",
  },
  {
    id: "soc_low_2",
    front: "social",
    severity: "low",
    text: "Ensure policies are applied consistently across regions, especially for services and administrative access.",
  },
  {
    id: "soc_low_3",
    front: "social",
    severity: "low",
    text: "Use early signals (dropout increases, reduced service access) to prevent backsliding.",
  },

  // SOCIAL — MIDDLE (30–59)
  {
    id: "soc_mid_1",
    front: "social",
    severity: "middle",
    text: "Reduce exclusion by tackling practical barriers: cost, travel distance, and safety around schools and services.",
  },
  {
    id: "soc_mid_2",
    front: "social",
    severity: "middle",
    text: "Improve access to core administrative services that gate participation (IDs, registration, benefits).",
  },
  {
    id: "soc_mid_3",
    front: "social",
    severity: "middle",
    text: "Expand community support services (local centers, referral networks) and track coverage and uptake.",
  },

  // SOCIAL — HIGH (< 30)
  {
    id: "soc_high_1",
    front: "social",
    severity: "high",
    text: "Keep girls connected to education and services through direct cost support and safe access routes.",
  },
  {
    id: "soc_high_2",
    front: "social",
    severity: "high",
    text: "Remove administrative barriers by simplifying registration and expanding outreach delivery.",
  },
  {
    id: "soc_high_3",
    front: "social",
    severity: "high",
    text: "Strengthen protection and inclusion for high-risk groups with clear referral pathways and accountability.",
  },

  // PHYSICAL — LOW (>= 60)
  {
    id: "phys_low_1",
    front: "physical",
    severity: "low",
    text: "Focus on remaining health access gaps by region, income, and migration status.",
  },
  {
    id: "phys_low_2",
    front: "physical",
    severity: "low",
    text: "Improve preventive care uptake and continuity (screening, follow-ups) to reduce long-run differences in outcomes.",
  },
  {
    id: "phys_low_3",
    front: "physical",
    severity: "low",
    text: "Track equity in service quality (waiting times, outcomes) so strong averages do not hide unequal experiences.",
  },

  // PHYSICAL — MIDDLE (30–59)
  {
    id: "phys_mid_1",
    front: "physical",
    severity: "middle",
    text: "Expand primary care coverage in underserved areas and reduce travel and availability barriers.",
  },
  {
    id: "phys_mid_2",
    front: "physical",
    severity: "middle",
    text: "Strengthen maternal and reproductive care access with clear coverage targets and follow-through.",
  },
  {
    id: "phys_mid_3",
    front: "physical",
    severity: "middle",
    text: "Reduce affordability barriers (fees, transport, essential medicines) that limit access even when services exist.",
  },

  // PHYSICAL — HIGH (< 30)
  {
    id: "phys_high_1",
    front: "physical",
    severity: "high",
    text: "Prioritize essential healthcare access (maternal care, emergency care, basic medicines) in underserved communities.",
  },
  {
    id: "phys_high_2",
    front: "physical",
    severity: "high",
    text: "Address safety barriers to care access, including mobility constraints and facility security risks.",
  },
  {
    id: "phys_high_3",
    front: "physical",
    severity: "high",
    text: "Use outreach delivery (mobile clinics, community health workers) where fixed service coverage is limited.",
  },
];
