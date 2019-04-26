import sgMail from "@sendgrid/mail";

export function sendMessage(toSend, nickname) {
  sgMail.setApiKey(process.env.SEND_GRID_MAIL_KEY);
  const message = {
    to: toSend,
    from: "support@musicOut.com",
    subject: "MusicOut, music every where",
    text: `Dear ${nickname}.
    hello to our application
    
    `
  };
  sgMail.send(message);
}
