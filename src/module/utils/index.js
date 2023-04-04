const EXPLOIT_VULNERABILITY_ACTION_ID =
  "Compendium.pf2e.actionspf2e.fodJ3zuwQsYnBbtk";
const MORTAL_WEAKNESS_EFFECT_SOURCEID = "Item.plf15q5mFglgWG8w";
const MORTAL_WEAKNESS_EFFECT_UUID =
  "Compendium.pf2e-thaum-vuln.thaumaturge-effects.N0jy0FFGS7ViTvs9";
const PERSONAL_ANTITHESIS_EFFECT_SOURCEID = "Item.Ug14iErZQ2h2y7B2";
const PERSONAL_ANTITHESIS_EFFECT_UUID =
  "Compendium.pf2e-thaum-vuln.thaumaturge-effects.EGY7Rxcxwv1aEyHL";
const FLAT_FOOTED_EFFECT_UUID =
  "Compendium.pf2e-thaum-vuln.thaumaturge-effects.Xuwb7a6jCWkFS0lI";
const MORTAL_WEAKNESS_TARGET_SOURCEID = "Item.8z4Q1PuKb13GJMPR";
const MORTAL_WEAKNESS_TARGET_UUID =
  "Compendium.pf2e-thaum-vuln.thaumaturge-effects.q2TMJ31MwLNJV1jA";
const PERSONAL_ANTITHESIS_TARGET_SOURCEID = "Item.5QgPHAdpsUHJmCkX";
const PERSONAL_ANTITHESIS_TARGET_UUID =
  "Compendium.pf2e-thaum-vuln.thaumaturge-effects.dNpf1EDKJ6fgNL42";
const BREACHED_DEFENSES_SOURCEID = "Compendium.pf2e.feats-srd.5EzJVhiHQvr3v72n";
const BREACHED_DEFENSES_EFFECT_SOURCEID = "Item.9ZJclirw6zHSkk0n";
const BREACHED_DEFENSES_EFFECT_UUID =
  "Compendium.pf2e-thaum-vuln.thaumaturge-effects.FMw5IpJdA6eOgtv1";
const BREACHED_DEFENSES_TARGET_UUID =
  "Compendium.pf2e-thaum-vuln.thaumaturge-effects.E38yjK1tdr579dJy";
const BREACHED_DEFENSES_TARGET_SOURCEID = "Item.aasC0M4NDDjR84UI";
const DIVERSE_LORE_SOURCEID = "Compendium.pf2e.feats-srd.KlqKpeq5OmTRxVHb";
const ESOTERIC_WARDEN_EFFECT_UUID =
  "Compendium.pf2e-thaum-vuln.thaumaturge-effects.fufcXy1CEMvxmgWt";
const ESOTERIC_WARDEN_EFFECT_SOURCEID = "Item.uKh4kjbl4arTnzC4";
const CURSED_EFFIGY_UUID =
  "Compendium.pf2e-thaum-vuln.thaumaturge-effects.s0NI9gKZygLUunOg";
const CURSED_EFFIGY_SOURCEID = "Item.XDXJA884X2AYJ0RO";

const SupportedActions = [
  "exploit-vulnerability",
  "share-weakness",
  "cursed-effigy",
  "twin-weakness",
];

//Might not be useful anymore
/*
const HelpfulEffectSourceIDs = new Array(
  MORTAL_WEAKNESS_EFFECT_SOURCEID,
  PERSONAL_ANTITHESIS_EFFECT_SOURCEID,
  BREACHED_DEFENSES_EFFECT_SOURCEID
);*/

const TargetEffectSourceIDs = new Array(
  PERSONAL_ANTITHESIS_TARGET_SOURCEID,
  MORTAL_WEAKNESS_TARGET_SOURCEID,
  BREACHED_DEFENSES_TARGET_SOURCEID,
  CURSED_EFFIGY_SOURCEID
);

const ADJUSTMENT_TYPES = {
  materials: {
    propLabel: "materials",
    data: CONFIG.PF2E.preciousMaterials,
  },
  traits: {
    propLabel: "traits",
    data: CONFIG.PF2E.damageTraits,
  },
  "weapon-traits": {
    propLabel: "weapon-traits",
    data: CONFIG.PF2E.weaponTraits,
  },
  "property-runes": {
    propLabel: "property-runes",
    data: CONFIG.PF2E.runes.weapon.property,
  },
};

export {
  SupportedActions,
  ADJUSTMENT_TYPES,
  EXPLOIT_VULNERABILITY_ACTION_ID,
  MORTAL_WEAKNESS_EFFECT_SOURCEID,
  MORTAL_WEAKNESS_TARGET_SOURCEID,
  MORTAL_WEAKNESS_EFFECT_UUID,
  PERSONAL_ANTITHESIS_EFFECT_SOURCEID,
  PERSONAL_ANTITHESIS_EFFECT_UUID,
  FLAT_FOOTED_EFFECT_UUID,
  MORTAL_WEAKNESS_TARGET_UUID,
  PERSONAL_ANTITHESIS_TARGET_SOURCEID,
  PERSONAL_ANTITHESIS_TARGET_UUID,
  BREACHED_DEFENSES_EFFECT_SOURCEID,
  BREACHED_DEFENSES_EFFECT_UUID,
  BREACHED_DEFENSES_SOURCEID,
  BREACHED_DEFENSES_TARGET_SOURCEID,
  BREACHED_DEFENSES_TARGET_UUID,
  DIVERSE_LORE_SOURCEID,
  ESOTERIC_WARDEN_EFFECT_SOURCEID,
  ESOTERIC_WARDEN_EFFECT_UUID,
  CURSED_EFFIGY_SOURCEID,
  CURSED_EFFIGY_UUID,
  TargetEffectSourceIDs,
};
