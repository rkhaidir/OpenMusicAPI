class Listener {
  constructor(openMusicService, mailSender) {
    this._openMusicService = openMusicService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(message.content.toString());
      const playlists = await this._openMusicService.getPlaylist(playlistId);
      const songs = await this._openMusicService.getPlaylistSongs(playlistId);
      const data = {
        playlist: {
          ...playlists,
          songs,
        },
      };
      const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(data));
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
