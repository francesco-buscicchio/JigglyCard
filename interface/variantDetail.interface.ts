import type { Language } from "~/enum/language.enum";
import type { TagCondition } from "~/enum/tagCondition.enum";

export interface VariantDetail {
  language: Language.IT | Language.EN | Language.JP;
  condition:
    | TagCondition.NM
    | TagCondition.EX
    | TagCondition.GD
    | TagCondition.PL
    | TagCondition.PO;
  price: number | null;
}
