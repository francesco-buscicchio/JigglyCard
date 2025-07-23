export const getFilePath = async (fileName: string) => {
  const result = await fetch(
    "https://honorable-belief-ab1c5a7281.media.strapiapp.com/api/upload/files"
  );
  console.log(JSON.stringify(result.text()));

  return "";

  //   const response = await fetch(
  //     `https://honorable-belief-ab1c5a7281.media.strapiapp.com/api/upload/files?${query}`,
  //     {
  //       headers: {
  //         Authorization: `bearer ${token}`,
  //       },
  //     }
  //   );

  //   console.log("Response status:", response.status);

  //   // Try to parse as JSON, but handle non-JSON responses
  //   let files;
  //   try {
  //     files = await response.json();
  //   } catch (e) {
  //     const text = await response.text();
  //     console.error("Non-JSON response:", text);
  //     throw new Error("Failed to parse JSON response from Strapi");
  //   }

  //   // Strapi 5 returns an array, not { data: [...] }
  //   if (!Array.isArray(files) || files.length === 0) {
  //     return "";
  //   }
  //   // Use .url directly from the file object
  //   const filesUrls = files.map((file: any) => file.url);
  //   return filesUrls[0];
};
