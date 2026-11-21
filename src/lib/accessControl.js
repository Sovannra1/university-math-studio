export const ADMIN_EMAIL = "loeur.sovannra1@gmail.com";

export const FEATURE_LABELS = [
  { id: "slides", labelKh: "ស្លាយបង្រៀន (Slides)" },
  { id: "reading", labelKh: "ឯកសារអានលម្អិត (Reading)" },
  { id: "practice", labelKh: "លំហាត់អនុវត្តន៍ (Practice)" },
  { id: "video", labelKh: "វីដេអូបង្រៀន (Video)" },
  { id: "challenge", labelKh: "លំហាត់សំយោគបញ្ចប់មេរៀន (Challenge)" },
  { id: "pdfExport", labelKh: "នាំចេញស្លាយជា PDF (Export PDF)" },
];

export const DEFAULT_ACCESS_CONFIG = {
  // Currently true so all signed-in users can study freely; Admin can toggle off anytime
  freeLaunchMode: true,
  proPriceUsd: 15,
  defaultSubjectPriceUsd: 5,
  trialEnabled: false,
  trialDays: 7,
  abaAccountName: "LOEUR SOVANNRA",
  abaAccountNumber: "000 000 000",
  abaPayLink: "",
  subjectAccess: {},
  subjectPrices: {},
  featureAccess: {
    slides: "free",
    reading: "free",
    practice: "free",
    video: "free",
    challenge: "free",
    pdfExport: "free",
  },
};

export function isAdminEmail(email) {
  return String(email || "").trim().toLowerCase() === ADMIN_EMAIL;
}

export function isTrialActive(user) {
  if (!user?.trialEndsAt) return false;
  return Number(user.trialEndsAt) > Date.now();
}

export function getSubjectPrice(accessConfig, subjectId) {
  const custom = accessConfig?.subjectPrices?.[subjectId];
  if (custom !== undefined && custom !== null && !Number.isNaN(Number(custom))) {
    return Number(custom);
  }
  return Number(accessConfig?.defaultSubjectPriceUsd ?? 5);
}

export function canUserAccess({
  user,
  accessConfig = DEFAULT_ACCESS_CONFIG,
  subjectId,
  featureKey,
}) {
  if (isAdminEmail(user?.email)) {
    return { allowed: true, reason: "admin" };
  }

  const subjectRule = subjectId
    ? accessConfig?.subjectAccess?.[subjectId] || "free"
    : "free";

  if (subjectRule === "hidden") {
    return { allowed: false, reason: "hidden" };
  }

  // Free launch mode unlocks all non-hidden subjects & features
  if (accessConfig?.freeLaunchMode !== false) {
    return { allowed: true, reason: "free-launch" };
  }

  if (user?.plan === "pro") {
    return { allowed: true, reason: "pro-user" };
  }

  if (accessConfig?.trialEnabled && isTrialActive(user)) {
    return { allowed: true, reason: "trial" };
  }

  if (
    subjectId &&
    Array.isArray(user?.purchasedSubjects) &&
    user.purchasedSubjects.includes(subjectId)
  ) {
    return { allowed: true, reason: "purchased-subject" };
  }

  if (subjectRule === "pro") {
    return { allowed: false, reason: "pro-subject" };
  }

  const featureRule = featureKey
    ? accessConfig?.featureAccess?.[featureKey] || "free"
    : "free";

  if (featureRule === "pro") {
    return { allowed: false, reason: "pro-feature" };
  }

  return { allowed: true, reason: "free" };
}
