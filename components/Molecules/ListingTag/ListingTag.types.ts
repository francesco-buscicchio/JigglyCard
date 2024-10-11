import type { TagType } from "~/components/Atoms/Tag/tag.types"

export type ListingTagProps = {
    type: TagType,
    text: string,
    code: Language | TagCondition
}
export enum Language {
    IT = "IT",
    EN = "EN",
    JP = "JP"
  }
  
  export enum TagCondition {
    NM = "NM",
    EX = "EX",
    GD = "GD",
    PL = "PL",
    PO = "PO"
  }

export type TagStructure = {
    language: Language.IT | Language.EN | Language.JP,
    conditions: (TagCondition.NM| TagCondition.EX | TagCondition.GD | TagCondition.PL | TagCondition.PO) []
  }
  
  export interface VariantDetail {
    language: Language.IT | Language.EN | Language.JP; 
    condition: TagCondition.NM | TagCondition.EX | TagCondition.GD | TagCondition.PL | TagCondition.PO;
    price: number | null;
  }