import { getFilePath } from "~/service/StrapiImage";

export const useMenu = async () => {
  const client = useAlgolia();
  const getTcg = await client.searchForFacetValues({
    indexName: "ecommerce",
    facetName: "tcg",
  });
  const getType = await client.searchForFacetValues({
    indexName: "ecommerce",
    facetName: "type",
  });

  if (!getTcg.facetHits.length || !getType.facetHits.length) {
    console.error("No TCG facet values found");
    return ref<MenuItemType[]>([]);
  }

  const menuItems: MenuItemType[] = [];
  for (let item of getTcg.facetHits) {
    const subItems = getType.facetHits.filter((type) => {
      return type.value.toLowerCase().includes(item.value.toLowerCase());
    });
    const obj = {
      name: item.value,
      subMenu: subItems.map((type) => ({
        label: type.value,
        image:
          "https://honorable-belief-ab1c5a7281.media.strapiapp.com/box_set_cfea8afe3e.jpg",
        to: `/${item.value.toLowerCase()}/${type.value
          .replace(item.value + " ", "")
          .toLowerCase()}`,
      })),
      isSubMenuOpen: false,
    };
    const data = await getFilePath("Pokémon Singles.jpg");
    console.log("File URL", data);
    menuItems.push(obj);
  }

  console.log("Menu items generated:", menuItems);
  return menuItems;
};

export type MenuItemType = {
  name: string;
  subMenu: any;
  isSubMenuOpen?: boolean;
  url?: string;
};
