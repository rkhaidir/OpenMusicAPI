const config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  rabbitmq: {
    server: process.env.RABBITMQ_SERVER,
  },
  redis: {
    host: process.env.REDIS_SERVER,
  },
};

module.exports = config;
