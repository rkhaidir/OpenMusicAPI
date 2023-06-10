require('dotenv').config();

const Hapi = require('@hapi/hapi');

// album
const album = require('./api/albums');
const AlbumService = require('./services/postgres/AlbumsService');
const AlbumValidator = require('./validator/albums');

// song
const song = require('./api/songs');
const SongService = require('./services/postgres/SongsService');
const SongValidator = require('./validator/songs');

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: album,
      options: {
        service: albumService,
        songService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: song,
      options: {
        service: songService,
        validator: SongValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
