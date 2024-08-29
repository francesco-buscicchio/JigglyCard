export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const sgRequest = await $fetch(
    "https://api.sendgrid.com/v3/marketing/contacts",
    {
      method: "PUT",
      url: "/v3/marketing/contacts",
      headers: {
        Authorization:
          "Bearer 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",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: {
        contacts: [{ email: body.mail, first_name: body.name }],
      },
    }
  );
});
