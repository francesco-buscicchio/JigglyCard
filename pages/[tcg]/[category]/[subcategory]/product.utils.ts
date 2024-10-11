import { TagType } from "~/components/Atoms/Tag/tag.types";
import type {
  Language,
  ListingTagProps,
  TagCondition,
  TagStructure,
  VariantDetail,
} from "~/components/Molecules/ListingTag/ListingTag.types";
import {
  availableConditions,
  availableLanguages,
  preferredLanguageOrder,
} from "~/data/const";

export const createTagLanguage = (
  tagsStructure: TagStructure[]
): ListingTagProps[] => {
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
    code: findCodeByText(lang.name) as Language,
  }));
};

export const createTagCondition = (
  tagsStructure: TagStructure[],
  activeConditions: TagCondition[]
): ListingTagProps[] => {
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
        code: findCodeByText(conditionMap.get(cond) || cond) as TagCondition,
      };
    } else {
      return {
        type: TagType.DISABLED,
        text: conditionMap.get(cond) || cond,
        code: findCodeByText(conditionMap.get(cond) || cond) as TagCondition,
      };
    }
  });

  return tagsCondition;
};

export const findActiveLanguage = (
  tagLanguage: ListingTagProps[],
  tagsStructure: TagStructure[]
): TagStructure | undefined => {
  const languageMap = createLanguageMap();
  const activeLanguageCode = preferredLanguageOrder.find((lang) =>
    tagLanguage.find((tag) => tag?.text === languageMap.get(lang))
  );
  const activeLanguage = tagsStructure.find(
    (item) => item.language === activeLanguageCode
  );
  return activeLanguage;
};

export const activateLanguage = (
  tagLanguage: ListingTagProps[],
  code: string
): ListingTagProps[] => {
  const text = findTextByCode(code);
  return tagLanguage.map((tag) => ({
    ...tag,
    type: tag.text === text ? TagType.ACTIVE : TagType.INACTIVE,
  }));
};

export const createTagsStructure = (query: any): TagStructure[] => {
  const variantsDetails: VariantDetail[] = query.hits[0].variantsDetails;
  const grouped: {
    [key in TagStructure["language"]]?: Set<VariantDetail["condition"]>;
  } = {};

  variantsDetails.forEach((variant) => {
    const { language, condition } = variant;

    if (!grouped[language]) {
      grouped[language] = new Set();
    }

    grouped[language]?.add(condition);
  });

  const tagStructures: TagStructure[] = Object.entries(grouped).map(
    ([lang, conditionsSet]) => ({
      language: lang as TagStructure["language"],
      conditions: Array.from(conditionsSet!) as TagStructure["conditions"],
    })
  );

  return tagStructures;
};

const createLanguageMap = (): Map<string, string> => {
  return new Map<string, string>(
    availableLanguages.map((lang) => [lang.code, lang.name])
  );
};

const createConditionMap = (): Map<string, string> => {
  return new Map<string, string>(
    availableConditions.map((cond) => [cond.code, cond.name])
  );
};

const findCodeByText = (text: string): string | undefined => {
  const allAvailable = [...availableConditions, ...availableLanguages];
  const code = allAvailable.find((item) => item.name === text)?.code;
  return code;
};

const findTextByCode = (code: string): string | undefined => {
  const allAvailable = [...availableConditions, ...availableLanguages];
  const text = allAvailable.find((item) => item.code === code)?.name;
  return text;
};
