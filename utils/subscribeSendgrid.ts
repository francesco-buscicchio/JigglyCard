export async function subscribeSendgrid(mail: string) {
  const { data } = await useFetch("/api/subscribe", {
    method: "POST",
    body: {
      mail: mail,
      name: getUsernameFromMail(mail),
    },
  });
}
