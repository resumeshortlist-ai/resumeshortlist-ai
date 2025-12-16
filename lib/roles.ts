export type Role = {
  slug: string;
  title: string;
  keywords: string[];
  exampleBullets: string[];
};

export const ROLES: Role[] = [
  {
    slug: "chief-operating-officer",
    title: "Chief Operating Officer (COO)",
    keywords: ["operating model", "P&L", "cost-to-serve", "global operations", "process optimization", "OKRs", "stakeholder management"],
    exampleBullets: [
      "Led global operating model redesign across 4 regions, improving margin by 3.2pts and reducing cycle time by 18%.",
      "Owned cost-to-serve program, eliminating $8.4M run-rate while protecting client SLAs and retention.",
      "Built performance cadence (OKRs + weekly exec dashboard) to drive execution and accountability."
    ]
  },
  {
    slug: "product-manager",
    title: "Product Manager",
    keywords: ["roadmap", "product discovery", "A/B testing", "user research", "PRD", "metrics", "cross-functional"],
    exampleBullets: [
      "Drove discovery + roadmap for X, increasing activation by 14% through onboarding experiments.",
      "Owned PRDs and stakeholder alignment across design/eng/data to deliver quarterly roadmap on time.",
      "Built KPI framework and reporting to prioritize backlog by impact and confidence."
    ]
  },
  {
    slug: "software-engineer",
    title: "Software Engineer",
    keywords: ["TypeScript", "React", "Next.js", "APIs", "performance", "testing", "CI/CD"],
    exampleBullets: [
      "Built and shipped features in Next.js/TypeScript, improving LCP by 22% via code-splitting and caching.",
      "Designed API endpoints and background jobs with observability and error budgets.",
      "Added automated tests and CI checks, reducing regressions and speeding releases."
    ]
  },
  {
    slug: "data-analyst",
    title: "Data Analyst",
    keywords: ["SQL", "dashboards", "stakeholders", "data modeling", "cohort analysis", "forecasting", "experimentation"],
    exampleBullets: [
      "Delivered stakeholder dashboards and weekly insights that improved decision speed and reduced manual reporting by 10 hours/week.",
      "Built SQL models and data quality checks to standardize metrics across teams.",
      "Ran cohort analyses to identify retention drivers and inform product priorities."
    ]
  },
  {
    slug: "account-executive",
    title: "Account Executive",
    keywords: ["pipeline", "quota", "CRM", "discovery", "negotiation", "forecasting", "enterprise sales"],
    exampleBullets: [
      "Consistently exceeded quota by 120% through tighter qualification, MEDDICC discipline, and executive alignment.",
      "Built pipeline coverage to 3.5× using targeted outbound + partner referrals.",
      "Improved forecast accuracy by implementing stage definitions and weekly deal reviews."
    ]
  },
  {
    slug: "marketing-manager",
    title: "Marketing Manager",
    keywords: ["SEO", "content", "paid media", "positioning", "conversion", "email", "analytics"],
    exampleBullets: [
      "Grew organic traffic 2.4× via SEO content + internal linking + technical fixes.",
      "Improved landing page conversion by 28% through messaging tests and friction removal.",
      "Owned lifecycle email and activation flows to increase trial-to-paid rate."
    ]
  },
  // Add more roles (25+ total)
  { slug: "operations-manager", title: "Operations Manager", keywords: ["process", "SOPs", "KPIs", "continuous improvement", "cross-functional"], exampleBullets: ["Standardized SOPs across teams, reducing errors by 26% and improving throughput.", "Implemented KPI cadence and root-cause reviews to improve SLA adherence."] },
  { slug: "project-manager", title: "Project Manager", keywords: ["delivery", "RAID logs", "stakeholders", "timeline", "budget", "risk management"], exampleBullets: ["Delivered multi-workstream program on time and under budget by tightening scope and risks.", "Built RAID + governance cadence to unblock dependencies and align stakeholders."] },
  { slug: "program-manager", title: "Program Manager", keywords: ["program governance", "OKRs", "cross-functional", "executive updates", "portfolio"], exampleBullets: ["Owned portfolio governance and executive reporting across 10+ initiatives.", "Established OKR cadence to drive predictable delivery and outcomes."] },
  { slug: "customer-success-manager", title: "Customer Success Manager", keywords: ["renewals", "health score", "onboarding", "QBR", "adoption", "churn reduction"], exampleBullets: ["Reduced churn by 18% through proactive health scoring and QBR cadence.", "Improved onboarding time-to-value by standardizing playbooks and training."] },
  { slug: "financial-analyst", title: "Financial Analyst", keywords: ["FP&A", "variance analysis", "forecasting", "budgeting", "Excel", "stakeholders"], exampleBullets: ["Improved forecast accuracy via driver-based modeling and variance analysis.", "Automated reporting to save 8 hours/week and improve decision cycles."] },
  { slug: "hr-business-partner", title: "HR Business Partner", keywords: ["talent", "workforce planning", "performance", "employee relations", "change management"], exampleBullets: ["Led workforce planning and org design to support growth while controlling costs.", "Partnered with leaders on performance and talent development programs."] },
  { slug: "ui-ux-designer", title: "UI/UX Designer", keywords: ["Figma", "user research", "prototyping", "design systems", "usability"], exampleBullets: ["Designed and tested flows that increased activation by 15% through reduced friction.", "Built design system components to speed delivery and improve consistency."] },
  { slug: "business-analyst", title: "Business Analyst", keywords: ["requirements", "process mapping", "stakeholders", "documentation", "UAT"], exampleBullets: ["Gathered requirements and mapped processes to reduce rework and clarify scope.", "Owned UAT planning and defect triage to enable clean releases."] },
  { slug: "it-manager", title: "IT Manager", keywords: ["ITIL", "service management", "security", "infrastructure", "vendor management"], exampleBullets: ["Improved incident response by implementing ITIL processes and monitoring.", "Managed vendors and budgets to improve reliability and reduce costs."] },
  { slug: "devops-engineer", title: "DevOps Engineer", keywords: ["CI/CD", "Docker", "Kubernetes", "observability", "Terraform", "AWS"], exampleBullets: ["Built CI/CD pipelines and IaC to improve deployment frequency and reliability.", "Implemented monitoring/alerts to reduce MTTR and improve uptime."] },
  { slug: "data-scientist", title: "Data Scientist", keywords: ["ML", "Python", "experiments", "feature engineering", "model evaluation"], exampleBullets: ["Built predictive models and experimentation to improve targeting and performance.", "Partnered with product to deploy models with monitoring and retraining."] },
  { slug: "management-consultant", title: "Management Consultant", keywords: ["strategy", "analysis", "stakeholders", "workstreams", "executive communication"], exampleBullets: ["Led analyses and executive narratives to support strategic decisions.", "Managed workstreams and client stakeholders to deliver outcomes on tight timelines."] },
  { slug: "legal-counsel", title: "Legal Counsel", keywords: ["contracts", "negotiation", "risk", "compliance", "stakeholder management"], exampleBullets: ["Negotiated commercial agreements to reduce risk and accelerate close cycles.", "Advised stakeholders on compliance and governance requirements."] },
  { slug: "nurse", title: "Registered Nurse", keywords: ["patient care", "triage", "documentation", "clinical", "teamwork"], exampleBullets: ["Delivered high-quality patient care with accurate documentation and safe procedures.", "Collaborated with interdisciplinary teams to improve patient outcomes."] },
  { slug: "teacher", title: "Teacher", keywords: ["curriculum", "lesson planning", "student outcomes", "assessment", "communication"], exampleBullets: ["Improved student outcomes through tailored lesson plans and assessments.", "Communicated effectively with parents and staff to support learning goals."] },
  { slug: "mechanical-engineer", title: "Mechanical Engineer", keywords: ["CAD", "design", "testing", "manufacturing", "DFM", "quality"], exampleBullets: ["Designed components and validated performance through testing and iteration.", "Partnered with manufacturing to improve yield and reduce defects."] },
  { slug: "civil-engineer", title: "Civil Engineer", keywords: ["site", "permits", "design", "construction", "codes", "project delivery"], exampleBullets: ["Managed site design and approvals while ensuring code compliance.", "Coordinated contractors to deliver projects safely and on schedule."] },
  { slug: "accountant", title: "Accountant", keywords: ["GAAP", "month-end close", "reconciliations", "audit", "controls"], exampleBullets: ["Improved close process speed and accuracy through better controls and automation.", "Prepared audit-ready schedules and reconciliations."] },
  { slug: "graphic-designer", title: "Graphic Designer", keywords: ["branding", "creative", "Adobe", "layout", "visual identity"], exampleBullets: ["Created brand assets and campaigns across digital and print.", "Improved consistency by documenting brand guidelines and templates."] },
  { slug: "operations-analyst", title: "Operations Analyst", keywords: ["process", "data", "KPIs", "insights", "optimization"], exampleBullets: ["Analyzed operational metrics to identify bottlenecks and improve throughput.", "Built dashboards and reports for ongoing performance tracking."] },
  { slug: "research-assistant", title: "Research Assistant", keywords: ["literature review", "data collection", "analysis", "documentation"], exampleBullets: ["Conducted research and analysis, maintaining accurate documentation and data integrity."] },
  { slug: "executive-assistant", title: "Executive Assistant", keywords: ["scheduling", "stakeholders", "communication", "travel", "operations"], exampleBullets: ["Managed executive calendars and stakeholders to protect priorities and time.", "Coordinated travel and meeting logistics across time zones."] },
  { slug: "recruiter", title: "Recruiter", keywords: ["sourcing", "screening", "ATS", "pipeline", "stakeholders", "offers"], exampleBullets: ["Built candidate pipelines and improved time-to-hire via structured processes.", "Partnered with hiring managers to define role requirements and evaluate candidates."] },
  { slug: "warehouse-supervisor", title: "Warehouse Supervisor", keywords: ["inventory", "safety", "shift management", "KPIs", "logistics"], exampleBullets: ["Improved pick/pack accuracy and safety compliance through training and SOPs.", "Managed shift schedules to meet throughput targets."] }
];

export function getRoleBySlug(slug: string) {
  return ROLES.find(r => r.slug === slug) || null;
}
