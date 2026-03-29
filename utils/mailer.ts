import { createTransport } from "nodemailer"

export interface MailProp {
    to: string;
    subject: string;
    html: string;
}

export const transport = createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});


export const sendMail = async ({ to, subject, html }: MailProp) => {
  try {
    const info = await transport.sendMail({
      from: `"Expense Tracker" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent:", info.messageId);
    return info;

  } catch (error) {
    console.error("Email error:", error);
    throw error;
  }
};