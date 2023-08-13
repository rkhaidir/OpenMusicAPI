require('dotenv').config();

const amqp = require('amqplib');
const OpenMusicService = require('./OpenMusicService');
const MailSender = require('./MailSender');
const Listener = require('./listener');

const init = async () => {
  const openMusicService = new OpenMusicService();
  const mailSender = new MailSender();
  const listener = new Listener(openMusicService, mailSender);
  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();
  await channel.assertQueue('export:playlist', {
    durable: true,
  });

  channel.consume('export:playlist', listener.listen, {
    noAck: true,
  });
};

init();
