const CoversHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'covers',
  version: '1.0.0',
  register: (server, { storageService, coverAlbumsService, validator }) => {
    const coversHandler = new CoversHandler(storageService, coverAlbumsService, validator);
    server.route(routes(coversHandler));
  },
};
