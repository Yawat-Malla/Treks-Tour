export type CopyField = {
  key: string;
  label: string;
  help?: string;
  kind: "short" | "long";
};

export type CopyGroup = {
  id: string;
  label: string;
  help: string;
  fields: CopyField[];
};

function short(key: string, label: string, help?: string): CopyField {
  return { key, label, help, kind: "short" };
}
function long(key: string, label: string, help?: string): CopyField {
  return { key, label, help, kind: "long" };
}

export const PAGE_CATALOG: CopyGroup[] = [
  {
    id: "home",
    label: "Homepage",
    help: "The first page guests see. Start with the big title and the photos.",
    fields: [
      short("tagline", "Short line for Google and the browser tab"),
      short("meta.homeDescription", "Longer Google description"),
      short("hero.kicker", "Small line above the big title"),
      long("hero.headline", "Big title at the top of the homepage"),
      long("hero.lede", "Sentence under the big title"),
      short("intro.title", "Title of the dark blue “why us” band"),
      long("intro.body", "Paragraph in the dark blue band"),
      short("featured.kicker", "Small line above featured treks"),
      short("featured.title", "Title for featured treks"),
      short("featured.visitedTitle", "Title for popular rafting"),
      short("featured.viewAll", "Link that says “see all treks”"),
      short("featured.allRaft", "Link that says “see all rafting”"),
      short("partners.acap", "Permit badge: ACAP"),
      short("partners.tims", "Permit badge: TIMS"),
      short("partners.years", "Years badge", "Keep {count} in the text. We fill in the number."),
      short("partners.walkers", "Walkers badge", "Keep {count} in the text. We fill in the number."),
      short("partners.reply", "Replies badge"),
      short("partners.local", "Local company badge"),
      short("purpose.kicker", "Small line in the “why us” band"),
      short("purpose.whyTitle", "“Why choose us” heading"),
      short("purpose.tile1", "Square 1"),
      short("purpose.tile2", "Square 2"),
      short("purpose.tile3", "Square 3"),
      short("purpose.tile4", "Square 4"),
      short("purpose.tile5", "Square 5"),
      short("purpose.tile6", "Square 6"),
      short("purpose.tile7", "Square 7"),
      short("purpose.tile8", "Square 8"),
      short("value.oneTitle", "Reason 1 title"),
      long("value.oneBody", "Reason 1 text"),
      short("value.twoTitle", "Reason 2 title"),
      long("value.twoBody", "Reason 2 text"),
      short("value.threeTitle", "Reason 3 title"),
      long("value.threeBody", "Reason 3 text"),
      short("value.fourTitle", "Reason 4 title"),
      long("value.fourBody", "Reason 4 text"),
      short("value.fiveTitle", "Reason 5 title"),
      long("value.fiveBody", "Reason 5 text"),
      short("how.oneTitle", "How-we-work title"),
      long("how.oneBody", "How-we-work text"),
      short("voices.kicker", "Small line above guest quotes"),
      short("voices.title", "Title above guest quotes"),
      short("faq.kicker", "Small line above questions"),
      short("faq.title", "Title above questions"),
      short("ctaBanner.bookNow", "Button on the photo banner"),
      short("blogs.kicker", "Small line above news"),
      short("blogs.title", "Title above news"),
      short("blogs.readMore", "“Read more” link"),
      short("blogs.all", "“All posts” link"),
      short("rated.title", "Title in the rating band"),
      long("rated.body", "Text in the rating band", "Keep {walkers} and {years}. We fill in the numbers."),
      short("memories.title", "Title above photo memories"),
      short("associated.title", "Title above partner logos"),
    ],
  },
  {
    id: "chips",
    label: "Photo cards on the homepage",
    help: "The sliding cards under the big title. Names below; photos and counts in the boxes above.",
    fields: [
      short("heroTabs.destinations", "Tab: Destinations"),
      short("heroTabs.activities", "Tab: Activities"),
      short("heroTabs.difficulty", "Tab: Difficulty"),
      short("heroTabs.trips", "“N trips” badge", "Keep {count} in the text."),
      short("heroTabs.everest", "Everest card"),
      short("heroTabs.annapurna", "Annapurna card"),
      short("heroTabs.langtang", "Langtang card"),
      short("heroTabs.restricted", "Restricted regions card"),
      short("heroTabs.hiddenGems", "Hidden gems card"),
      short("heroTabs.allOther", "All other regions card"),
      short("heroTabs.treks", "Treks card"),
      short("heroTabs.rafting", "Rafting card"),
      short("heroTabs.air", "Air & ballooning card"),
      short("heroTabs.extreme", "Extreme card"),
      short("heroTabs.safaris", "Safaris card"),
      short("heroTabs.zip", "Zipflyer card"),
      short("heroTabs.easy", "Easy card"),
      short("heroTabs.moderate", "Moderate card"),
      short("heroTabs.challenging", "Challenging card"),
    ],
  },
  {
    id: "listings",
    label: "Trip list pages",
    help: "The titles at the top of Treks, Rafting, Activities, and Safaris.",
    fields: [
      short("featured.all", "All treks link"),
      short("featured.raftKicker", "Rafting page — small line"),
      short("featured.raftTitle", "Rafting page — title"),
      long("featured.raftLede", "Rafting page — intro"),
      short("featured.activityKicker", "Activities page — small line"),
      short("featured.activityTitle", "Activities page — title"),
      short("featured.allActivities", "All activities link"),
      long("featured.activityLede", "Activities page — intro"),
      short("featured.safariKicker", "Safaris page — small line"),
      short("featured.safariTitle", "Safaris page — title"),
      short("featured.allSafaris", "All safaris link"),
      long("featured.safariLede", "Safaris page — intro"),
    ],
  },
  {
    id: "about",
    label: "About us",
    help: "The About page. The photo at the top is not translated — it is the same in every language.",
    fields: [
      short("about.kicker", "Small line above the title"),
      short("about.title", "Big title"),
      long("about.body", "Opening paragraph"),
      short("about.baseTitle", "Our base — title"),
      long("about.baseBody", "Our base — text"),
      short("about.guidesTitle", "Guides — title"),
      long("about.guidesBody", "Guides — text"),
      short("about.licensesTitle", "Licences — title"),
      long("about.licensesBody", "Licences — text"),
      short("about.localTitle", "Local company — title"),
      long("about.localBody", "Local company — text"),
    ],
  },
  {
    id: "plan",
    label: "Plan a trip",
    help: "The Plan page that lists treks, rivers, activities, and safaris.",
    fields: [
      short("plan.kicker", "Small line above the title"),
      short("plan.title", "Big title"),
      long("plan.lede", "Intro paragraph"),
      short("plan.whoTitle", "Treks section title"),
      long("plan.whoLede", "Treks section intro"),
      short("plan.riverTitle", "Rivers section title"),
      long("plan.riverLede", "Rivers section intro"),
      short("plan.activityTitle", "Activities section title"),
      long("plan.activityLede", "Activities section intro"),
      short("plan.safariTitle", "Safaris section title"),
      long("plan.safariLede", "Safaris section intro"),
      short("plan.groupTitle", "Small group heading"),
      long("plan.groupBody", "Small group text"),
      short("plan.privateTitle", "Private trip heading"),
      long("plan.privateBody", "Private trip text"),
      short("plan.prepareCue", "Line that points to Prepare"),
      short("plan.prepareLink", "The word “Prepare” in that line"),
    ],
  },
  {
    id: "prepare",
    label: "Prepare",
    help: "Permits, packing, and fitness advice.",
    fields: [
      short("prepare.kicker", "Small line above the title"),
      short("prepare.title", "Big title"),
      long("prepare.lede", "Intro paragraph"),
      short("prepare.permitsTitle", "Permits heading"),
      long("prepare.permitsBody", "Permits text"),
      short("prepare.packingTitle", "Packing heading"),
      long("prepare.packingBody", "Packing text"),
      short("prepare.fitnessTitle", "Fitness heading"),
      long("prepare.fitnessBody", "Fitness text"),
      short("prepare.riverTitle", "River heading"),
      long("prepare.riverBody", "River text"),
      short("prepare.ctaTitle", "Box at the bottom — title"),
      long("prepare.ctaBody", "Box at the bottom — text"),
      short("prepare.cta", "Button in that box"),
    ],
  },
  {
    id: "contact",
    label: "Contact",
    help: "Hours and the welcome text. Phone numbers are under Name, logo & phone.",
    fields: [
      short("contact.kicker", "Small line above the title"),
      short("contact.title", "Big title"),
      long("contact.lede", "Intro paragraph"),
      short("contact.hours", "Opening hours"),
      long("contact.wechatHint", "Note under WeChat"),
    ],
  },
  {
    id: "legal",
    label: "Privacy, terms & footer",
    help: "Legal pages and the short paragraph in the footer.",
    fields: [
      short("legal.privacyTitle", "Privacy page title"),
      long("legal.privacyBody", "Privacy page text"),
      short("legal.termsTitle", "Terms page title"),
      long("legal.termsBody", "Terms page text"),
      long("footer.blurb", "Footer paragraph"),
    ],
  },
];

export const COPY_KEYS = PAGE_CATALOG.flatMap((g) => g.fields.map((f) => f.key));

export type ChipCard = {
  id: string;
  tab: "destinations" | "activities" | "difficulty";
  href: "/treks" | "/rafting" | "/activities" | "/safaris";
  image: string;
  count: number;
  titleKey: string;
};

export type AssociationLogo = { url: string; alt: string };

export const DEFAULT_ASSOCIATIONS: AssociationLogo[] = [
  { url: "/associations/1.svg", alt: "Emblem of Nepal" },
  { url: "/associations/2.svg", alt: "Nepal Tourism Board" },
  { url: "/associations/3.svg", alt: "Nepal Mountaineering Association" },
  { url: "/associations/4.svg", alt: "Trekking Agencies' Association of Nepal" },
];

export const DEFAULT_CHIPS: ChipCard[] = [
  { id: "everest", tab: "destinations", href: "/treks", count: 3, titleKey: "everest", image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=80" },
  { id: "annapurna", tab: "destinations", href: "/treks", count: 7, titleKey: "annapurna", image: "https://images.unsplash.com/photo-1571401835393-8c5f35328320?auto=format&fit=crop&w=2000&q=80" },
  { id: "langtang", tab: "destinations", href: "/treks", count: 2, titleKey: "langtang", image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=2000&q=80" },
  { id: "restricted", tab: "destinations", href: "/treks", count: 3, titleKey: "restricted", image: "https://images.unsplash.com/photo-1758701320941-89f86492c1ef?auto=format&fit=crop&w=2000&q=80" },
  { id: "hiddenGems", tab: "destinations", href: "/treks", count: 7, titleKey: "hiddenGems", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2000&q=80" },
  { id: "allOther", tab: "destinations", href: "/treks", count: 9, titleKey: "allOther", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80" },
  { id: "treks", tab: "activities", href: "/treks", count: 18, titleKey: "treks", image: "https://images.unsplash.com/photo-1571401835393-8c5f35328320?auto=format&fit=crop&w=2000&q=80" },
  { id: "rafting", tab: "activities", href: "/rafting", count: 3, titleKey: "rafting", image: "https://images.pexels.com/photos/1732278/pexels-photo-1732278.jpeg?auto=compress&cs=tinysrgb&w=2000" },
  { id: "air", tab: "activities", href: "/activities", count: 2, titleKey: "air", image: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=2000&q=80" },
  { id: "extreme", tab: "activities", href: "/activities", count: 4, titleKey: "extreme", image: "https://images.unsplash.com/photo-1559677624-3c956f10d431?auto=format&fit=crop&w=2000&q=80" },
  { id: "safaris", tab: "activities", href: "/safaris", count: 3, titleKey: "safaris", image: "https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=2000" },
  { id: "zip", tab: "activities", href: "/activities", count: 3, titleKey: "zip", image: "https://images.unsplash.com/photo-1696940389431-b6a2f2e1b784?auto=format&fit=crop&w=2000&q=80" },
  { id: "easy", tab: "difficulty", href: "/treks", count: 8, titleKey: "easy", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80" },
  { id: "moderate", tab: "difficulty", href: "/treks", count: 9, titleKey: "moderate", image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=2000&q=80" },
  { id: "challenging", tab: "difficulty", href: "/treks", count: 7, titleKey: "challenging", image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=2000&q=80" },
];
