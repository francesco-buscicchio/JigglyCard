const TYPE_PREFIXES = [
  "Pokémon",
  "Pokemon",
  "Dragon Ball Super",
  "Dragon Ball",
  "One Piece",
  "Final Fantasy",
  "Lorcana",
];

const TYPE_PREFIX_REGEX = new RegExp(
  `^(${TYPE_PREFIXES.map(escapeRegExp).join("|")})\\s*`,
  "i"
);

const CLEAN_LEADING_CHARS = /^[-–—:\s]+/;

export function getTypeTranslationKey(value?: string | null) {
  if (!value) return "";

  let label = value.trim();
  label = label.replace(TYPE_PREFIX_REGEX, "").replace(CLEAN_LEADING_CHARS, "");
  label = label.trim();

  if (!label) return "";

  return label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
