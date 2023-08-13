const nodemailer = require('nodemailer');

class MailSender {
  constructor() {
    this._transport = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  sendEmail(targetEmail, content) {
    const message = {
      from: 'Open Music',
      to: targetEmail,
      subject: 'Export Playlist',
      text: 'Terlampir playlistmu di sini:',
      attachments: [
        {
          filename: 'playlist.txt',
          content,
        },
      ],
    };

    return this._transport.sendMail(message);
  }
}

module.exports = MailSender;
