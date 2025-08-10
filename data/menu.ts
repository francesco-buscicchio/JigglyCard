const useMenu = async () => {
  const client = useAlgolia();
  const getMenu = await client.searchSingleIndex({
    indexName: "menu",
  });

  if (!getMenu.hits || getMenu.hits.length === 0) {
    return [];
  }

  const tempMenu: Record<
    string,
    {
      name: string;
      to: string;
      subMenu: {
        label: string;
        image?: string;
        to: string;
      }[];
      isSubMenuOpen: boolean;
    }
  > = {};

  getMenu.hits.forEach((hit) => {
    Object.entries(hit).forEach(([key, value]) => {
      if (
        typeof value === "object" &&
        value !== null &&
        "categories" in value &&
        Array.isArray(value.categories)
      ) {
        if (!tempMenu[key]) {
          tempMenu[key] = {
            name: key,
            to: `/${key.toLowerCase().replace(/\s+/g, "-")}/all`,
            subMenu: [],
            isSubMenuOpen: false,
          };
        }

        value.categories.forEach((category: any) => {
          const exists = tempMenu[key].subMenu.some(
            (item) => item.label === category.name
          );
          if (!exists) {
            tempMenu[key].subMenu.push({
              label: category.name,
              image: category.image,
              to: `/${key.toLowerCase().replace(/\s+/g, "-")}/${category.slug}`,
            });
          }
        });
      }
    });
  });

  const menuData = Object.values(tempMenu);
  return menuData;
};

export type MenuItemType = {
  name: string;
  to: string;
  subMenu: {
    label: string;
    image?: string;
    to: string;
  }[];
  isSubMenuOpen?: boolean;
};

export default useMenu;
