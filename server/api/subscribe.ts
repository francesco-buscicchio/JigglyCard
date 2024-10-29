export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  const sgRequest = await $fetch(
    "https://api.sendgrid.com/v3/marketing/contacts",
    {
      method: "PUT",
      url: "/v3/marketing/contacts",
      headers: {
        Authorization: `Bearer ${config.public.SENDGRID_API_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: {
        contacts: [{ email: body.mail, first_name: body.name }],
      },
    }
  );
});
