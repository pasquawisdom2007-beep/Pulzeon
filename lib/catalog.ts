export type ProductData = {
  id?: string
  title: string
  slug: string
  category: string
  shortDescription: string
  price: number
  coverImage: string
}

export function formatNaira(amount: number): string {
  return "₦" + Math.round(amount).toLocaleString("en-NG")
}

export type SeedProduct = {
  title: string
  slug: string
  category: string
  shortDescription: string
  description: string
  price: number
  coverImage: string
  fileUrl: string
  included: string[]
  featured: boolean
  premiumOnly: boolean
}

export const CATALOG: SeedProduct[] = [
  {
    title: "CV & Resume Templates Pack",
    slug: "cv-resume-templates-pack",
    category: "CV & Resume",
    shortDescription: "ATS-friendly Word & Canva CV designs with a matching cover letter template.",
    description:
      "A complete, recruiter-approved CV toolkit. Every template is optimised to pass Applicant Tracking Systems (ATS) while still looking clean and modern. Fully editable in Microsoft Word and Canva, so you can customise colours, fonts and sections in minutes.",
    price: 1500,
    coverImage: "/products/cv-resume.png",
    fileUrl: "",
    included: [
      "10 ATS-friendly CV templates (Word + Canva)",
      "Matching cover letter template",
      "Reference page template",
      "Step-by-step editing guide",
    ],
    featured: true,
    premiumOnly: false,
  },
  {
    title: "Business Plan & Pitch Deck Template",
    slug: "business-plan-pitch-deck",
    category: "Business",
    shortDescription: "Editable Word business plan + PowerPoint pitch deck with a financial projection sheet.",
    description:
      "Everything you need to plan and pitch a business. Includes a structured Word business plan document, an investor-ready PowerPoint pitch deck, and an Excel financial projection sheet with pre-built formulas.",
    price: 2500,
    coverImage: "/products/business-plan.png",
    fileUrl: "",
    included: [
      "Editable Word business plan (all sections)",
      "Investor pitch deck (PowerPoint)",
      "Excel financial projection sheet",
      "Executive summary template",
    ],
    featured: true,
    premiumOnly: false,
  },
  {
    title: "Canva Design Bundle",
    slug: "canva-design-bundle",
    category: "Design",
    shortDescription: "Social media posts, flyer templates and YouTube thumbnail packs — all in Canva.",
    description:
      "A huge bundle of ready-to-edit Canva templates for creators and small businesses. Swap your text and images and export in seconds. Perfect for Instagram, WhatsApp status, flyers and YouTube.",
    price: 2000,
    coverImage: "/products/canva-bundle.png",
    fileUrl: "",
    included: [
      "100+ social media post templates",
      "20 flyer templates",
      "30 YouTube thumbnail templates",
      "Editable in free Canva",
    ],
    featured: true,
    premiumOnly: false,
  },
  {
    title: "WAEC/JAMB/NECO Past Questions & Answers",
    slug: "waec-jamb-neco-past-questions",
    category: "Past Questions",
    shortDescription: "Subject-organised PDF packs with detailed answer explanations.",
    description:
      "Study smarter with organised past questions covering WAEC, JAMB and NECO. Each subject pack includes worked answers and explanations so you understand the 'why', not just the answer.",
    price: 1000,
    coverImage: "/products/past-questions.png",
    fileUrl: "",
    included: [
      "WAEC past questions (core subjects)",
      "JAMB CBT practice questions",
      "NECO past questions",
      "Detailed answer explanations",
    ],
    featured: true,
    premiumOnly: false,
  },
  {
    title: "Study Planner & Productivity Templates",
    slug: "study-planner-productivity",
    category: "Productivity",
    shortDescription: "Excel & Notion-style trackers to keep students organised and consistent.",
    description:
      "A productivity system built for students. Plan your study sessions, track assignments, monitor grades and build habits with clean, easy-to-use Excel and Notion-style templates.",
    price: 800,
    coverImage: "/products/study-planner.png",
    fileUrl: "",
    included: [
      "Weekly study planner",
      "Assignment & exam tracker",
      "Grade calculator (Excel)",
      "Habit tracker",
    ],
    featured: false,
    premiumOnly: false,
  },
  {
    title: "Source Code / Script Packs",
    slug: "source-code-script-packs",
    category: "Source Code",
    shortDescription: "Automation scripts, bot templates and website starter templates for developers.",
    description:
      "A developer-focused pack of practical, well-commented source code. Includes automation scripts, chatbot templates and responsive website starters you can deploy and customise for clients or personal projects.",
    price: 3500,
    coverImage: "/products/source-code.png",
    fileUrl: "",
    included: [
      "Automation scripts (Node.js/Python)",
      "WhatsApp/Telegram bot templates",
      "Responsive website starter templates",
      "Setup & deployment notes",
    ],
    featured: true,
    premiumOnly: false,
  },
  {
    title: "Social Media Growth Guide (eBook)",
    slug: "social-media-growth-guide",
    category: "eBooks",
    shortDescription: "A practical, no-fluff guide to growing a page or channel from zero.",
    description:
      "Learn the exact strategies used to grow social pages and channels — content planning, posting cadence, hooks, engagement loops and monetisation. Written for the Nigerian creator market.",
    price: 1200,
    coverImage: "/products/growth-ebook.png",
    fileUrl: "",
    included: [
      "60-page actionable eBook (PDF)",
      "Content calendar template",
      "50 viral hook ideas",
      "Monetisation checklist",
    ],
    featured: false,
    premiumOnly: false,
  },
  {
    title: "Invoice & Business Document Templates",
    slug: "invoice-business-documents",
    category: "Business",
    shortDescription: "Excel invoice generator plus receipt and business document templates.",
    description:
      "Look professional and get paid faster. This pack includes an automated Excel invoice generator, receipt templates, quotations and common business documents ready to brand as your own.",
    price: 900,
    coverImage: "/products/invoice-templates.png",
    fileUrl: "",
    included: [
      "Automated Excel invoice generator",
      "Receipt templates",
      "Quotation & proforma templates",
      "Business letter templates",
    ],
    featured: false,
    premiumOnly: false,
  },
  {
    title: "Exclusive Monthly Template Drop",
    slug: "premium-monthly-drop",
    category: "Templates",
    shortDescription: "Members-only premium template drop — not sold individually.",
    description:
      "A fresh premium template pack released every month, exclusively for Pulzeon Premium subscribers. Not available for individual purchase.",
    price: 0,
    coverImage: "/products/canva-bundle.png",
    fileUrl: "",
    included: [
      "New premium templates every month",
      "Early access before public release",
      "Members-only design assets",
    ],
    featured: false,
    premiumOnly: true,
  },
]

export const SEED_UPDATES = [
  {
    title: "Pulzeon is live!",
    description:
      "Welcome to Pulzeon. Browse digital templates, past questions and source code — or go Premium for exclusive monthly drops.",
  },
  {
    title: "New: Source Code & Script Packs",
    description: "Developer-focused automation scripts, bot templates and website starters just landed in the shop.",
  },
  {
    title: "Pulzeon Premium launched",
    description: "Subscribe for early access, an exclusive monthly template drop, a VIP group invite and 20% off shop items.",
  },
]
