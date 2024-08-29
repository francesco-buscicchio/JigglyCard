import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const sgRequest = await $fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization:
        "Bearer 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",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  }).catch((error) => {
    console.log(error);
    return error;
  });
  return sgRequest;
});

/*
export default defineEventHandler(async (event) => {
  console.log(event);
  const body = await readBody(event);

  const sgRequest = await $fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer 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`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((val) => {
      return val;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });

  return sgRequest;
});
*/
