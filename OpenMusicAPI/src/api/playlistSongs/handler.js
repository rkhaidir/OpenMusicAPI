const autoBind = require('auto-bind');

class PlaylistSongsHandler {
  constructor(
    service,
    playlistsService,
    songsService,
    playlistSongActivitiesService,
    validator,
  ) {
    this._service = service;
    this._playlistsService = playlistsService;
    this._songService = songsService;
    this._playlistSongActivitiesService = playlistSongActivitiesService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);

    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._songService.verifySong(songId);

    await this._service.addPlaylistSong(playlistId, songId);
    await this._playlistSongActivitiesService.addPlaylistActivity(
      playlistId,
      songId,
      credentialId,
      'add',
    );

    const response = h.response({
      status: 'success',
      message: 'Berhasil menambahkan lagu ke playlist.',
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongsHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    const playlist = await this._playlistsService.getPlaylistById(playlistId);
    const songs = await this._service.getSongsByPlaylistId(playlistId);
    playlist.songs = songs;
    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deletePlaylistSongHandler(request) {
    this._validator.validatePlaylistSongPayload(request.payload);

    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.deletePlaylistSong(playlistId, songId);
    await this._playlistSongActivitiesService.addPlaylistActivity(
      playlistId,
      songId,
      credentialId,
      'delete',
    );

    return {
      status: 'success',
      message: 'Berhasil menghapus lagu dari playlist.',
    };
  }
}

module.exports = PlaylistSongsHandler;
