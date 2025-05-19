import type { Language } from "~/enum/language.enum";
import type { TagCondition } from "~/enum/tagCondition.enum";

export type TagStructure = {
  language: Language.IT | Language.EN | Language.JP;
  conditions: (
    | TagCondition.NM
    | TagCondition.EX
    | TagCondition.GD
    | TagCondition.PL
    | TagCondition.PO
  )[];
};
