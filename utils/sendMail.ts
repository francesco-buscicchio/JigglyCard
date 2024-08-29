import { email } from "@formkit/icons";

export type sendMailProps = {
  email: string;
  name: string;
  subject: string;
  contentValue: string;
};

export async function sendMail(mailData: sendMailProps) {
  console.log(mailData);
  let msg = {
    personalizations: [
      {
        to: [
          {
            email: mailData.email,
            name: mailData.name,
          },
        ],
      },
    ],
    from: {
      email: "jigglycard@gmail.com",
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
