export async function subscribeSendgrid(mail: string) {
  await useFetch("/api/subscribe", {
    method: "POST",
    body: {
      mail: mail,
      name: getUsernameFromMail(mail),
    },
  });
}
