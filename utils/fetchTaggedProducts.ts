type TaggedProductOptions = {
  hitsPerPage?: number;
  filters?: string;
  indexName?: string;
};

export const fetchTaggedProducts = (
  client: any,
  tag: string,
  options: TaggedProductOptions = {}
) => {
  const {
    hitsPerPage = 5,
    filters = "available:true",
    indexName = "ecommerce",
  } = options;

  return client.searchSingleIndex({
    indexName,
    searchParams: {
      query: tag,
      hitsPerPage,
      filters,
    },
  });
};
