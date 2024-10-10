import {
  TagCondition,
  TagType,
  type TagStructure,
} from "~/components/Atoms/Tag/tag.types";
import type { ListingTagProps } from "~/components/Molecules/ListingTag/ListingTag.types";
import {
  availableConditions,
  availableLanguages,
  preferredLanguageOrder,
} from "~/data/const";

export const createTagLanguage = (tagsStructure: TagStructure[]) => {
  const languageMap = createLanguageMap();

  const sortedLanguages = preferredLanguageOrder
    .filter((lang) => tagsStructure.some((item) => item.language === lang))
    .map((lang) => ({
      code: lang,
      name: languageMap.get(lang) || lang,
      conditions:
        tagsStructure.find((item) => item.language === lang)?.conditions || [],
    }));

  return sortedLanguages.map((lang, index) => ({
    type: index === 0 ? TagType.ACTIVE : TagType.INACTIVE,
    text: lang.name,
  }));
};

export const createTagCondition = (
  tagsStructure: TagStructure[],
  activeConditions: TagCondition[]
) => {
  const conditionMap = createConditionMap();

  const allConditionsSet = new Set<TagCondition>();
  tagsStructure.forEach((item) => {
    item.conditions.forEach((cond) => allConditionsSet.add(cond));
  });
  const allConditions = Array.from(allConditionsSet);

  const tagsCondition = allConditions.map((cond) => {
    if (activeConditions.includes(cond)) {
      const index = activeConditions.indexOf(cond);
      return {
        type: index === 0 ? TagType.ACTIVE : TagType.INACTIVE,
        text: conditionMap.get(cond) || cond,
      };
    } else {
      return {
        type: TagType.DISABLED,
        text: conditionMap.get(cond) || cond,
      };
    }
  });

  return tagsCondition;
};

export const findActiveLanguage = (
  tagLanguage: ListingTagProps[],
  tagsStructure: TagStructure[]
) => {
  const languageMap = createLanguageMap();
  const activeLanguageCode = preferredLanguageOrder.find((lang) =>
    tagLanguage.find((tag) => tag?.text === languageMap.get(lang))
  );
  const activeLanguage = tagsStructure.find(
    (item) => item.language === activeLanguageCode
  );
  return activeLanguage;
};

const createLanguageMap = () => {
  return new Map<string, string>(
    availableLanguages.map((lang) => [lang.code, lang.name])
  );
};

const createConditionMap = () => {
  return new Map<string, string>(
    availableConditions.map((cond) => [cond.code, cond.name])
  );
};

export const activateLanguage = (
  tagLanguage: ListingTagProps[],
  text: string
) => {
  return tagLanguage.map((tag) => ({
    ...tag,
    type: tag.text === text ? TagType.ACTIVE : TagType.INACTIVE,
  }));
};
