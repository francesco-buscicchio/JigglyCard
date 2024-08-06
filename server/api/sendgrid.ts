import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const sgRequest = await $fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
            Authorization: `Bearer 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`,
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(body)
    }).then((val) => {
        return val;
    }).catch((error) => {
        console.log(error);
        return error;
    });

    return sgRequest;
});
