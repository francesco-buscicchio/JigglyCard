import { algoliasearch } from "algoliasearch";

export default function useAlgolia() {
  const config = useRuntimeConfig();
  const client = algoliasearch(
    config.public.ALGOLIA_APPLICATION_ID,
    config.public.ALGOLIA_API_KEY
  );

  return client;
}
