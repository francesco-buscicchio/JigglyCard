import type { TagCondition } from "~/enum/tagCondition.enum";
import type { Language } from "~/enum/language.enum";
import type { TagType } from "~/enum/tag.enum";

export type ListingTag = {
  type: TagType;
  text: string;
  code: Language | TagCondition;
};
