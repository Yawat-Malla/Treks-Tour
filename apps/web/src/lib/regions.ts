export const TREK_REGIONS = ["annapurna", "everest", "langtang", "restricted", "hidden_gems", "other"] as const;
export type TrekRegion = (typeof TREK_REGIONS)[number];

export const DESTINATION_SLUGS = ["annapurna", "everest", "langtang", "restricted", "hidden-gems"] as const;
export type DestinationSlug = (typeof DESTINATION_SLUGS)[number];

export const REGION_LABEL: Record<TrekRegion, string> = {
  annapurna: "Annapurna",
  everest: "Everest",
  langtang: "Langtang",
  restricted: "Restricted",
  hidden_gems: "Quieter ridges",
  other: "Other",
};

export function regionToPath(region: TrekRegion): string | null {
  if (region === "other") return null;
  if (region === "hidden_gems") return "/destinations/hidden-gems";
  return `/destinations/${region}`;
}

export function pathToRegion(slug: string): TrekRegion | null {
  if (slug === "hidden-gems") return "hidden_gems";
  if (TREK_REGIONS.includes(slug as TrekRegion) && slug !== "other") return slug as TrekRegion;
  return null;
}

export function isDestinationSlug(value: string): value is DestinationSlug {
  return (DESTINATION_SLUGS as readonly string[]).includes(value);
}

const SLUG_REGION: Record<string, TrekRegion> = {
  "australian-camp-dhampus": "hidden_gems",
  "sarangkot-naudanda": "hidden_gems",
  panchase: "hidden_gems",
  "ghandruk-village": "hidden_gems",
  sikles: "hidden_gems",
  "kuri-danda": "hidden_gems",
  "ghorepani-poon-hill": "annapurna",
  "mardi-himal": "annapurna",
  "mohare-danda": "hidden_gems",
  "annapurna-base-camp": "annapurna",
  "khopra-danda": "hidden_gems",
  "annapurna-circuit": "annapurna",
  "upper-mustang": "restricted",
  "manang-village": "annapurna",
  "manaslu-circuit": "restricted",
  "tsum-valley": "restricted",
  "nar-phu-valley": "restricted",
  "round-dhaulagiri": "other",
  "langtang-valley": "langtang",
  "tilicho-frozen-lake": "annapurna",
  "everest-base-camp": "everest",
  kanchenjunga: "other",
};

export function regionForSlug(slug: string, kind = "trek"): TrekRegion {
  if (kind !== "trek") return "other";
  return SLUG_REGION[slug] ?? "other";
}

export function chipHref(chipId: string): string {
  switch (chipId) {
    case "everest":
      return "/destinations/everest";
    case "annapurna":
      return "/destinations/annapurna";
    case "langtang":
      return "/destinations/langtang";
    case "restricted":
      return "/destinations/restricted";
    case "hiddenGems":
      return "/destinations/hidden-gems";
    case "rafting":
      return "/rafting";
    case "air":
    case "extreme":
    case "zip":
      return "/activities";
    case "safaris":
      return "/safaris";
    default:
      return "/treks";
  }
}

export function chipRegion(chipId: string): TrekRegion | null {
  switch (chipId) {
    case "everest":
      return "everest";
    case "annapurna":
      return "annapurna";
    case "langtang":
      return "langtang";
    case "restricted":
      return "restricted";
    case "hiddenGems":
      return "hidden_gems";
    case "allOther":
      return "other";
    default:
      return null;
  }
}

export const REGION_COPY: Record<
  DestinationSlug,
  {
    titleKey: string;
    seoTitle: Record<string, string>;
    seoDescription: Record<string, string>;
    h1: Record<string, string>;
    lede: Record<string, string>;
    body: Record<string, string>;
    faqs: { q: Record<string, string>; a: Record<string, string> }[];
  }
> = {
  annapurna: {
    titleKey: "annapurna",
    seoTitle: {
      en: "Annapurna Treks in Nepal | Routes, Difficulty & Cost from Pokhara",
      zh: "安纳普尔纳徒步 | 博卡拉出发的路线、难度与费用",
      ko: "안나푸르나 트레킹 | 포카라 출발 코스·난이도·비용",
      he: "טרקי אנאפורנה בנפאל | מסלולים מפוקרה",
    },
    seoDescription: {
      en: "Compare Annapurna treks from Pokhara: Poon Hill, Mardi Himal, Base Camp, Circuit, Manang and Tilicho. Days, altitude, difficulty and prices from a Lakeside company.",
      zh: "从博卡拉比较安纳普尔纳路线：普恩山、马尔迪、基地营、环线、马南与提里错。天数、海拔、难度与报价。",
      ko: "포카라에서 안나푸르나 코스를 비교하세요. 푼힐, 마르디, 베이스캠프, 서킷, 마낭, 틸리초.",
      he: "השוו טרקי אנאפורנה מפוקרה: פון היל, מארדי, מחנה בסיס, מעגל, מאננג וטיליצ'ו.",
    },
    h1: {
      en: "Annapurna treks from Pokhara",
      zh: "从博卡拉出发的安纳普尔纳徒步",
      ko: "포카라에서 떠나는 안나푸르나 트레킹",
      he: "טרקי אנאפורנה מפוקרה",
    },
    lede: {
      en: "The Annapurna Himalaya sits above the lake. These are the tea-house routes we actually run from Lakeside — short ridges, sanctuary, and the high pass.",
      zh: "安纳普尔纳就在湖的上方。这些是我们从湖畔真正带队的茶馆路线：短脊、圣域、高山口。",
      ko: "안나푸르나는 호수 위에 있습니다. 레이크사이드에서 실제로 운영하는 찻집 루트입니다.",
      he: "הימלאיה של אנאפורנה מעל האגם. אלה מסלולי בתי התה שאנחנו מוציאים מלייקסייד.",
    },
    body: {
      en: "Pokhara is the practical start for Annapurna. You sleep by Phewa Lake, we arrange ACAP and TIMS in town with a passport scan, and a jeep or tourist bus puts you on the trail the next morning. That is the difference between a Kathmandu flyer and a Lakeside company: the briefing, the kit check, and the first trail day happen in the same valley as the mountain.\n\nGhorepani Poon Hill is the honest four-to-five-day walk — stone stairs, rhododendron, and a 3,210 m sunrise if the cloud lifts. Mardi Himal is the quieter ridge: fewer lodges, a 4,500 m morning, and a finish that still returns you to Pokhara without a domestic flight. Annapurna Base Camp is the amphitheatre most first-timers mean when they say “Nepal trek” — Machhapuchhre, the sanctuary, and a high point around 4,130 m. The Circuit and Tilicho Lake are longer: villages, a 5,416 m pass at Thorong La, and a head for thin air. Manang is the rest town on that circuit, not a separate holiday unless you ask for it.\n\nWe pace these walks for the weather, not a brochure. Stairs on Poon Hill are honest. Altitude on Mardi and Base Camp is real. The Circuit is a different trip entirely — rain-shadow after the pass, and a finish back toward the lake. Spring (March–May) and autumn (October–November) are the stable windows. Winter is possible on Poon Hill and lower ridges; monsoon is green, slippery, and quieter.\n\nPermits for this region are ACAP plus TIMS. Restricted-area papers (Upper Mustang, Manaslu, Tsum, Nar Phu) are a different desk — see the restricted hub. Quotes from our office include the guide, porter if you want one, lodge nights on the standard itinerary, and the jeep that actually leaves Lakeside. They do not include your international flight, travel insurance, or the beer you buy at 3,500 m.\n\nIf you are unsure which Annapurna trek fits your days and legs, write a manager on WhatsApp with dates and how many nights you can walk. We will not upsell you a sanctuary you do not have time to enjoy. Compare the full Nepal table on the treks hub, or read the annual best-treks guide if you are still choosing between Mardi, Base Camp, and a short ridge.",
      zh: "博卡拉是安纳普尔纳最实际的起点。你在费瓦湖过夜，我们在城里办理 ACAP 与 TIMS，次日吉普或旅游巴士送你上路。普恩山与马尔迪适合休息周。基地营是多数第一次来尼泊尔的人说的“徒步”。环线与提里错需要更多天数，以及应对海拔的准备。",
      ko: "포카라는 안나푸르나의 현실적인 출발점입니다. 페와에서 자고, 시내에서 ACAP와 TIMS를 처리한 뒤 다음날 트레일로 갑니다. 푼힐과 마르디는 짧은 휴가에 맞고, 베이스캠프는 처음 네팔을 찾는 이들이 말하는 그 트레킹입니다.",
      he: "פוקרה היא ההתחלה המעשית לאנאפורנה. ישנים ליד פאווה, מארגנים ACAP ו־TIMS בעיר, ולמחרת עולים לשביל. פון היל ומארדי מתאימים לשבוע מנוחה. מחנה הבסיס הוא הטרק שרוב המבקרים מתכוונים אליו.",
    },
    faqs: [
      {
        q: {
          en: "Which Annapurna trek is best for beginners?",
          zh: "安纳普尔纳哪条线最适合初学者？",
          ko: "초보에게 가장 맞는 안나푸르나 트레킹은?",
          he: "איזה טרק אנאפורנה הכי מתאים למתחילים?",
        },
        a: {
          en: "Ghorepani Poon Hill if you want sunrise and stairs in four to five days. Mardi Himal if you want a quieter ridge and can handle a 4,500 m morning. Australian Camp or Ghandruk if you want a first overnight without real altitude.",
          zh: "想看日出、四到五天：戈勒帕尼普恩山。想要安静山脊并能接受约 4,500 米早晨：马尔迪。只要过夜、不要高海拔：澳大利亚营地或甘德鲁克。",
          ko: "4–5일 일출이면 고레파니 푼힐. 한적한 능선과 4,500 m 아침이면 마르디. 고도 없이 첫 1박이면 오스트레일리안 캠프나 간드룩.",
          he: "פון היל לארבעה–חמישה ימים. מארדי לרכס שקט ולבוקר של 4,500 מ'. אוסטרליאן קמפ או גנאדרוק ללילה בלי גובה אמיתי.",
        },
      },
      {
        q: {
          en: "Do I need ACAP and TIMS for Annapurna?",
          zh: "安纳普尔纳需要 ACAP 和 TIMS 吗？",
          ko: "안나푸르나에 ACAP와 TIMS가 필요합니까?",
          he: "צריך ACAP ו־TIMS לאנאפורנה?",
        },
        a: {
          en: "Yes. We process both in Pokhara with your passport scan. Restricted-area permits (Upper Mustang, Manaslu, Tsum, Nar Phu) are extra and arranged through immigration with a licensed agency.",
          zh: "需要。我们用护照扫描在博卡拉办理。上木斯塘、马纳斯卢、楚姆、纳尔普等限制区许可另计，须由持牌旅行社向移民局申请。",
          ko: "필요합니다. 여권 스캔으로 포카라에서 처리합니다. 상무스탕·마나슬루 등 제한구역 허가는 별도입니다.",
          he: "כן. מטפלים בשניהם בפוקרה. היתרי אזור מוגבל הם תוספת.",
        },
      },
    ],
  },
  everest: {
    titleKey: "everest",
    seoTitle: {
      en: "Everest Region Treks from Pokhara | EBC Itinerary, Cost & Guide",
      zh: "珠峰地区徒步 | 基地营行程、费用与向导（博卡拉出发）",
      ko: "에베레스트 지역 트레킹 | EBC 일정·비용·가이드",
      he: "טרקים באזור אוורסט מפוקרה | מחנה בסיס",
    },
    seoDescription: {
      en: "Everest Base Camp trek arranged from our Pokhara office: Lukla flights, Namche pacing, Kala Patthar, permits, and an honest quote. Local Sherpa-region logistics without a Kathmandu desk.",
      zh: "从博卡拉安排珠峰基地营：卢克拉航班、南崎配速、卡拉帕塔、许可与诚实报价。",
      ko: "포카라 사무실에서 준비하는 에베레스트 베이스캠프. 루클라 항공, 남체 페이스, 칼라파타르.",
      he: "טרק מחנה הבסיס של אוורסט מאורגן ממשרד פוקרה: טיסות לוקלה, נאמצ'ה, קאלה פאטאר.",
    },
    h1: {
      en: "Everest region treks",
      zh: "珠峰地区徒步",
      ko: "에베레스트 지역 트레킹",
      he: "טרקים באזור אוורסט",
    },
    lede: {
      en: "The Khumbu is a different mountain system. We still start the conversation in Pokhara — then fly you via Kathmandu to Lukla with pacing that protects the summit morning.",
      zh: "昆布是另一套山系。我们仍在博卡拉谈清楚，再经加德满都飞卢克拉，配速保护登顶的早晨。",
      ko: "쿰부는 다른 산맥입니다. 이야기는 포카라에서 시작하고, 카트만두를 거쳐 루클라로 갑니다.",
      he: "החומבו הוא מערכת הרים אחרת. השיחה מתחילה בפוקרה, ואז טסים דרך קטמנדו ללוקלה.",
    },
    body: {
      en: "Everest Base Camp is the name people search when they mean Nepal. It is also higher, longer, and more expensive than Annapurna Base Camp: Lukla weather delays, a 5,545 m viewpoint at Kala Patthar, and two acclimatisation days in Namche and Dingboche that we will not skip. The trailhead is not Pokhara. The conversation still is.\n\nWe are a Lakeside company. For the Khumbu that means we handle briefing, insurance questions, sleeping-bag check, and the honest quote by the lake, then connect you through Kathmandu for the domestic flight to Lukla. Budget a buffer night in Kathmandu on the way back. Cloud on that airstrip is not a rumour. Kanchenjunga is a different far-east expedition; it is not listed here as an Everest-region day walk.\n\nSagarmatha National Park permits and TIMS are arranged with your passport. The cost of EBC is lodges, flights, and altitude time — not a hidden tax at our desk. Autumn (October–November) and late spring (March–May) are the windows most walkers use. Winter is colder and quieter; monsoon is a poor time for Lukla reliability.\n\nIf your holiday is under two weeks or you have never slept above 3,000 m, we will usually steer you to Annapurna Base Camp or Mardi Himal first. Those walks start with a jeep from Pokhara and top out lower. If the Khumbu is the trip you came for, we build the itinerary around Namche rest, Dingboche rest, and a Kala Patthar morning — not a race to Gorak Shep. Write dates, passport nationality, and whether you have walked high before. We will tell you if the schedule is too tight rather than sell you a summit morning you cannot use.",
      zh: "人们搜“尼泊尔徒步”时，心里往往是珠峰基地营。它也比安纳普尔纳基地营更高、更长、更贵：卢克拉天气、卡拉帕塔 5,545 米、以及我们不会省略的两天适应。我们是博卡拉的公司——在湖边做说明与装备检查，再经加德满都衔接国内航班。",
      ko: "네팔 트레킹을 검색하면 에베레스트 베이스캠프가 나옵니다. 안나푸르나보다 높고 길고 비쌉니다. 포카라에서 브리핑과 장비를 맞춘 뒤 카트만두를 거쳐 루클라로 연결합니다.",
      he: "מחנה הבסיס של אוורסט הוא השם שאנשים מחפשים. הוא גם גבוה, ארוך ויקר יותר ממחנה הבסיס של אנאפורנה. אנחנו חברה מפוקרה — התדריך ליד האגם, ואז קטמנדו ולוקלה.",
    },
    faqs: [
      {
        q: {
          en: "Can I start Everest Base Camp from Pokhara?",
          zh: "可以从博卡拉开始珠峰基地营吗？",
          ko: "포카라에서 에베레스트 베이스캠프를 시작할 수 있나요?",
          he: "אפשר להתחיל את מחנה הבסיס של אוורסט מפוקרה?",
        },
        a: {
          en: "The trailhead is Lukla, not Pokhara. We brief and kit-check in Lakeside, then fly Kathmandu–Lukla. Budget a buffer night in Kathmandu for weather delays on the return.",
          zh: "步道起点是卢克拉，不是博卡拉。我们在湖畔做说明与装备检查，再飞加德满都—卢克拉。回程请预留加德满都缓冲夜，以防天气延误。",
          ko: "트레일헤드는 루클라입니다. 레이크사이드에서 브리핑 후 카트만두–루클라로 갑니다. 복귀 지연에 대비해 카트만두 완충 하룻밤을 잡으세요.",
          he: "ראש השביל הוא לוקלה. תדריך בלייקסייד, ואז טיסה קטמנדו–לוקלה. ליל גיבוי בקטמנדו לחזרה.",
        },
      },
    ],
  },
  langtang: {
    titleKey: "langtang",
    seoTitle: {
      en: "Langtang Valley Trek | Itinerary, Cost & Difficulty from Pokhara",
      zh: "朗塘谷徒步 | 行程、费用与难度（博卡拉安排）",
      ko: "랑탕 밸리 트레킹 | 일정·비용·난이도",
      he: "טרק עמק לנגטאנג | מסלול ועלות",
    },
    seoDescription: {
      en: "Langtang Valley trek north of Kathmandu: Tamang villages, Kyanjin Gompa, Tserko Ri. Arranged from our Pokhara office with an honest duration and altitude plan.",
      zh: "加德满都以北的朗塘谷：塔芒村落、江金寺、策尔科峰。由博卡拉办公室安排行程与海拔计划。",
      ko: "카트만두 북쪽 랑탕 밸리. 타망 마을, 캰진 곰파, 체르코 리. 포카라에서 일정과 고도를 정직하게 잡습니다.",
      he: "עמק לנגטאנג מצפון לקטמנדו. כפרי טמאנג, קיאנג'ין גומפה, צרקו רי.",
    },
    h1: {
      en: "Langtang Valley treks",
      zh: "朗塘谷徒步",
      ko: "랑탕 밸리 트레킹",
      he: "טרקי עמק לנגטאנג",
    },
    lede: {
      en: "Closer to Kathmandu than to the lake, Langtang is the valley we send people who want Himalaya without Lukla or the Annapurna stairs.",
      zh: "朗塘离加德满都比离湖更近。适合想走喜马拉雅、又不想飞卢克拉或爬安纳普尔纳台阶的人。",
      ko: "호수보다 카트만두에 가깝습니다. 루클라나 안나푸르나 계단 없이 히말라야를 원하는 이들에게 보냅니다.",
      he: "קרוב יותר לקטמנדו מאשר לאגם. לנגטאנג לעמק בלי לוקלה ובלי מדרגות אנאפורנה.",
    },
    body: {
      en: "Langtang sits north of Kathmandu toward the Tibetan border. You drive to Syabrubesi, walk a river valley through Tamang villages, and sleep at Kyanjin Gompa under Langtang Lirung. Tserko Ri is the viewpoint morning — about 4,984 m — then you reverse the same valley. Cheese factories, prayer walls, and a rebuilt trail after the 2015 earthquake are part of the walk, not a footnote.\n\nFrom Pokhara this is an overland day or a short flight to Kathmandu then a jeep. We still own the briefing, Langtang National Park permits, TIMS, and the licensed guide. It is quieter than Annapurna Base Camp in peak October weeks, closer than Everest, and culturally different from Gurung villages above Pokhara. Helambu and Gosainkunda variants exist; the trek we sell as a product is the valley to Kyanjin and the Tserko Ri morning.\n\nDays on the trail can match ABC. The high point is higher. The trail is a valley with river noise, not a sanctuary amphitheatre. Spring and autumn are the reliable seasons. Winter is possible with colder lodges; monsoon brings leeches and cloud on the viewpoint.\n\nChoose Langtang if you want Himalaya without Lukla and without the Poon Hill stair crowd, and you can spare the Kathmandu transfer. Choose ABC if you want to start and finish by the lake. Write us with dates — the quote includes the guide, lodges on the standard itinerary, and the road or flight we actually book, not a Kathmandu street-side surprise.",
      zh: "朗塘在加德满都以北、靠近西藏边境。车至夏布鲁贝西，沿河谷穿过塔芒村落，夜宿江金寺。策尔科峰是观景的早晨，约 4,984 米。从博卡拉需陆路或先飞加德满都。旺季比基地营更安静。",
      ko: "랑탕은 카트만두 북쪽, 티베트 국경 쪽입니다. 샤브루베시까지 이동해 타망 마을을 지나 캰진 곰파에서 잡니다. 포카라에서는 육로 또는 카트만두 경유입니다.",
      he: "לנגטאנג מצפון לקטמנדו. נוסעים לסיאברובסי, הולכים בעמק טמאנג, לנים בקיאנג'ין גומפה. מפוקרה זה יבשה או טיסה לקטמנדו.",
    },
    faqs: [
      {
        q: {
          en: "Is Langtang easier than Annapurna Base Camp?",
          zh: "朗塘比安纳普尔纳基地营更容易吗？",
          ko: "랑탕이 안나푸르나 베이스캠프보다 쉬운가요?",
          he: "לנגטאנג קל יותר ממחנה הבסיס של אנאפורנה?",
        },
        a: {
          en: "Days can be similar. Tserko Ri is higher than ABC. The trail is a valley rather than a sanctuary amphitheatre. Choose Langtang for culture and access from Kathmandu; choose ABC for the classic Pokhara start and Machhapuchhre.",
          zh: "天数可以相近。策尔科峰比基地营更高。朗塘是河谷，基地营是圣域剧场。想从加德满都进山选朗塘；想从博卡拉看鱼尾峰选基地营。",
          ko: "일수는 비슷할 수 있습니다. 체르코 리가 ABC보다 높습니다. 카트만두 접근이면 랑탕, 포카라와 마차푸치레면 ABC.",
          he: "הימים יכולים להיות דומים. צרקו רי גבוה מ־ABC. לנגטאנג לתרבות ולגישה מקטמנדו; ABC להתחלה מפוקרה.",
        },
      },
    ],
  },
  restricted: {
    titleKey: "restricted",
    seoTitle: {
      en: "Restricted Area Treks in Nepal | Mustang, Manaslu, Tsum & Nar Phu",
      zh: "尼泊尔限制区徒步 | 木斯塘、马纳斯卢、楚姆与纳尔普",
      ko: "네팔 제한구역 트레킹 | 무스탕, 마나슬루, 춤, 나르푸",
      he: "טרקים באזורים מוגבלים בנפאל | מוסטנג, מנאסלו, צום, נאר פו",
    },
    seoDescription: {
      en: "Upper Mustang, Manaslu Circuit, Tsum Valley and Nar Phu — restricted-area treks that still need a licensed agency and guide. Permits, costs and itineraries from Pokhara.",
      zh: "上木斯塘、马纳斯卢环线、楚姆谷与纳尔普——仍需持牌旅行社与向导的限制区线路。许可、费用与行程由博卡拉安排。",
      ko: "상무스탕, 마나슬루 서킷, 춤 밸리, 나르푸. 등록 여행사와 가이드가 필요한 제한구역. 포카라에서 허가와 일정을 맡습니다.",
      he: "אפר מוסטנג, מעגל מנאסלו, עמק צום ונאר פו — אזורים מוגבלים עם סוכנות ומדריך. היתרים מפוקרה.",
    },
    h1: {
      en: "Restricted-area treks in Nepal",
      zh: "尼泊尔限制区徒步",
      ko: "네팔 제한구역 트레킹",
      he: "טרקים באזורים מוגבלים בנפאל",
    },
    lede: {
      en: "These valleys still require a government-registered agency and a licensed guide. We file the permits in Kathmandu or Pokhara before you reach the checkpoint.",
      zh: "这些山谷仍需政府注册旅行社与持牌向导。我们在你到达检查站之前，于加德满都或博卡拉办好许可。",
      ko: "이 골짜기는 정부 등록 여행사와 면허 가이드가 필요합니다. 검문소 전에 카트만두 또는 포카라에서 허가를 냅니다.",
      he: "העמקים האלה עדיין דורשים סוכנות רשומה ומדריך מורשה. ההיתרים לפני מחסום.",
    },
    body: {
      en: "Upper Mustang is the rain-shadow kingdom: Jomsom, Kagbeni, Lo Manthang, a daily restricted-area permit, and desert light that looks nothing like the Annapurna sanctuary. You fly or jeep from Pokhara toward Jomsom, then walk a walled town that still feels like a different country. The cost is the permit days, not a secret lodge surcharge at our office.\n\nManaslu Circuit is the quieter 8,000 m neighbour: Soti Khola or Dharapani start, Larkya La around 5,106 m, and a finish toward Besisahar that can connect back to Pokhara. Tsum Valley branches into Buddhist villages and extra permit layers. Nar Phu is a side valley of stone, wind, and a restricted paper trail. These are not Poon Hill weekends.\n\nRules change. The two-person minimum on some restricted routes has been relaxed on paper; a government-registered agency and a licensed guide are still mandatory. We will not sell a DIY permit or a “just TIMS” story at the checkpoint. Dates and passport nationality go in the quote. RAP days, ACAP where it applies, TIMS, jeeps, and the flight if we use Jomsom weather, are line items you see before you pay.\n\nBest months for Mustang are often March–May and late September–November, when the rain-shadow is usable and Lo Manthang is open. Manaslu prefers the same autumn and spring windows as other high passes. Monsoon is a poor time for Larkya La. Winter is possible in Lower Mustang with closed high lodges further north.\n\nWrite a manager with how many days you have. Mustang in a rush is a jeep tour, not a trek. Manaslu in under two weeks is a compromise we will name rather than hide. Compare each product page for inclusions, then read the permits note on the prepare page before you assume a TIMS card is enough.",
      zh: "上木斯塘是雨影里的王国：乔姆松、洛曼塘、按日计的限制许可。马纳斯卢环线是更安静的八千米邻居。楚姆与纳尔普再加藏传村落与额外许可。规则会变；持牌向导仍然必须。我们不卖“自己办许可”。",
      ko: "상무스탕은 비그늘의 왕국입니다. 마나슬루 서킷은 더 한적한 8000 m 이웃. 춤과 나르푸는 허가 층이 더 있습니다. 면허 가이드는 여전히 필수입니다.",
      he: "אפר מוסטנג הוא ממלכת צל הגשם. מעגל מנאסלו הוא השכן השקט. צום ונאר פו מוסיפים היתרים. מדריך מורשה עדיין חובה.",
    },
    faqs: [
      {
        q: {
          en: "Can I trek Upper Mustang solo in 2026?",
          zh: "2026 年可以独自走上木斯塘吗？",
          ko: "2026년에 상무스탕을 혼자 걸을 수 있나요?",
          he: "אפשר ללכת באפר מוסטנג לבד ב־2026?",
        },
        a: {
          en: "The two-person minimum has been relaxed, but you still book through a registered agency and walk with a licensed guide. We apply for the restricted-area permit by the day; the cost is in the quote, not a surprise at Kagbeni.",
          zh: "两人最低限制已放宽，但仍须通过注册旅行社预订并与持牌向导同行。限制区许可按日申请，费用写在报价里，不会在卡格贝尼才突然出现。",
          ko: "2인 최소는 완화됐지만 등록 여행사와 면허 가이드는 그대로입니다. 제한구역 허가는 일수로 신청하며 견적에 포함됩니다.",
          he: "מינימום שני אנשים הוקל, אבל עדיין סוכנות ומדריך. ההיתר לפי יום, במחיר שבציטוט.",
        },
      },
    ],
  },
  "hidden-gems": {
    titleKey: "hiddenGems",
    seoTitle: {
      en: "Hidden Gem Treks near Pokhara | Panchase, Khopra, Mohare & Sikles",
      zh: "博卡拉附近的隐秘徒步 | 潘查塞、霍普拉、莫哈雷与锡克勒斯",
      ko: "포카라 근처 숨은 트레킹 | 판차세, 코프라, 모하레, 시클레스",
      he: "טרקים שקטים ליד פוקרה | פאנצ'אסה, חופרה, מוהארה, סיקלס",
    },
    seoDescription: {
      en: "Quieter treks from Pokhara: Panchase, Ghandruk, Sikles, Kuri Danda, Mohare Danda, Khopra Ridge and Australian Camp. Fewer stairs-crowds than Poon Hill, still real Himalaya.",
      zh: "博卡拉出发的更安静线路：潘查塞、甘德鲁克、锡克勒斯、库里丹达、莫哈雷、霍普拉与澳大利亚营地。比普恩山人少，仍是真喜马拉雅。",
      ko: "포카라의 한적한 코스. 판차세, 간드룩, 시클레스, 쿠리 단다, 모하레, 코프라, 오스트레일리안 캠프.",
      he: "טרקים שקטים מפוקרה: פאנצ'אסה, גנאדרוק, סיקלס, קורי דנדה, מוהארה, חופרה.",
    },
    h1: {
      en: "Quieter treks from Pokhara",
      zh: "从博卡拉出发的安静徒步",
      ko: "포카라에서 떠나는 한적한 트레킹",
      he: "טרקים שקטים מפוקרה",
    },
    lede: {
      en: "Same range, fewer people on the stairs. Community lodges, Gurung villages, and ridges that look at Dhaulagiri without the Poon Hill dawn crowd.",
      zh: "同一座山脉，台阶上人更少。社区旅舍、古隆村落，以及能看道拉吉里、却没有普恩山黎明人潮的山脊。",
      ko: "같은 산맥, 계단에 사람이 적습니다. 커뮤니티 롯지, 구룽 마을, 푼힐 새벽 인파 없이 다울라기리를 보는 능선.",
      he: "אותו רכס, פחות אנשים על המדרגות. לודג'ים קהילתיים, כפרי גורונג, ודהאולגירי בלי קהל הזריחה של פון היל.",
    },
    body: {
      en: "Not every guest needs Base Camp. Australian Camp and Dhampus are the honest first night after a long flight — a ridge above Pokhara, tea, and a view of Machhapuchhre if the haze lifts. Sarangkot to Naudanda is a half-day or overnight for people who landed yesterday. Ghandruk and Sikles are stone Gurung villages we give extra time instead of racing through on the way to a viewpoint.\n\nPanchase and Kuri Danda are ridge walks with community lodges. Mohare Danda and Khopra Ridge sit above the classic Ghorepani traffic: colder nights, fewer dawn queues, and still a look at Dhaulagiri and Annapurna South. These are the paths we recommend when you say you want Himalaya without a queue at sunrise.\n\nThey still use ACAP. They are not secret in the marketing sense. Jeeps still leave Lakeside. Stairs still exist. What you skip is the Poon Hill selfie line in late October. Difficulty ranges from gentle village paths to Khopra nights that are higher and colder than Ghorepani. “Hidden” here means quieter, not easier.\n\nSpring rhododendron and autumn clarity are the usual windows. Winter is possible on Australian Camp and Ghandruk. Monsoon is muddy and green. Quotes include the guide, lodge nights on the itinerary we send, and the jeep from Pokhara. They do not include a Base Camp you did not ask for.\n\nTell us your days and whether you want a village, a ridge, or a first overnight. We will not upsell you a sanctuary you do not have time to enjoy. The Nepal comparison table on the treks hub lists days, altitude, and price beside the classic routes so you can see the quieter options in the same grid.",
      zh: "不是每位客人都需要基地营。澳大利亚营地适合长途航班后的第一夜。甘德鲁克与锡克勒斯值得多留，而不是路过。潘查塞与库里是山脊。莫哈雷与霍普拉在戈勒帕尼人流之上，社区旅舍、夜晚更冷。仍要 ACAP。想看山、不想排日出的队，就走这些路。",
      ko: "모두가 베이스캠프가 필요한 것은 아닙니다. 오스트레일리안 캠프는 긴 비행 다음 첫날 밤. 간드룩과 시클레스는 스쳐 지나가지 않습니다. 모하레와 코프라는 고레파니 위 커뮤니티 롯지입니다.",
      he: "לא כולם צריכים מחנה בסיס. אוסטרליאן קמפ ללילה הראשון. גנאדרוק וסיקלס לכפרי אבן. מוהארה וחופרה מעל התנועה של גורפאני.",
    },
    faqs: [
      {
        q: {
          en: "Are these treks easier than Poon Hill?",
          zh: "这些线比普恩山更容易吗？",
          ko: "이 코스가 푼힐보다 쉬운가요?",
          he: "הטרקים האלה קלים יותר מפון היל?",
        },
        a: {
          en: "Australian Camp and Ghandruk are gentler. Mohare and Khopra go higher and colder than Ghorepani. “Hidden” here means quieter, not easier. We match the ridge to your fitness on WhatsApp before you pay.",
          zh: "澳大利亚营地与甘德鲁克更缓。莫哈雷与霍普拉比戈勒帕尼更高更冷。“隐秘”是人少，不是更简单。付钱前我们会在 WhatsApp 上按体能配山脊。",
          ko: "오스트레일리안 캠프와 간드룩은 더 수월합니다. 모하레와 코프라는 고레파니보다 높고 춥습니다. 숨은 길은 한적하다는 뜻이지 쉽다는 뜻이 아닙니다.",
          he: "אוסטרליאן קמפ וגנאדרוק עדינים יותר. מוהארה וחופרה גבוהים וקרים יותר. שקט, לא בהכרח קל.",
        },
      },
    ],
  },
};

export function destCopy(slug: DestinationSlug, locale: string, field: "h1" | "lede" | "body" | "seoTitle" | "seoDescription") {
  const row = REGION_COPY[slug][field];
  return row[locale] || row.en;
}

export function destFaqs(slug: DestinationSlug, locale: string) {
  return REGION_COPY[slug].faqs.map((f, i) => ({
    id: `${slug}-faq-${i}`,
    question: f.q[locale] || f.q.en,
    answer: f.a[locale] || f.a.en,
  }));
}
