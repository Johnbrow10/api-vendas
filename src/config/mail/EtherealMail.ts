import nodemailer from 'nodemailer';

interface ISendMail {
  to: string;
  body: string;
}

export default class EtherealMail {
  static async sendMail({ to, body }: ISendMail): Promise<void> {
    const account = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });

    const message = await transporter.sendMail({
      from: 'time@epivendas.com.br',
      to,
      subject: 'Recuperação de Senha',
      text: body,
    });

    console.log('message sent: %s ', message.message);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}
