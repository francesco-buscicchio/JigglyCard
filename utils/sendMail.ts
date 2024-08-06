
export type sendMailProps = {
    email: string,
    name: string,
    subject: string
    contentValue: string
}

export async function sendMail(mailData: sendMailProps) {
    let msg = {
        personalizations: [
            {
                to: [
                    {
                        email: useRuntimeConfig().public.NEWSLETTER_TO_MAIL,
                        name: useRuntimeConfig().public.NEWSLETTER_TO_NAME
                    },
                ],
            },
        ],
        from: {
            email: mailData.email,
            name: mailData.name,
        },
        subject: mailData.subject,
        content: [
            {
                type: "text/plain",
                value: "Test message",
            },
            {
                type: "text/html",
                value: mailData.contentValue,
            },
        ],
    };
    const { data } = await useFetch("/api/sendgrid", {
        method: "POST",
        body: msg,
    });
}