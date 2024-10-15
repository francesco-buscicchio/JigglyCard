export type sendMailProps = {
  email: string;
  name: string;
  subject: string;
  contentValue: string;
};

export async function sendMail(mailData: sendMailProps) {
  const config = useRuntimeConfig();
  let msg = {
    personalizations: [
      {
        to: [
          {
            email: mailData.email,
            name: getUsernameFromMail(mailData.email),
          },
        ],
      },
    ],
    from: {
      email: config.public.ADMIN_MAIL,
      name: "Jigglycard",
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
