const { Pool } = require('pg');

class OpenMusicService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylist(id) {
    const query = {
      text: 'SELECT id, name FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getPlaylistSongs(id) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer FROM playlist_songs
      JOIN songs ON playlist_songs.song_id = songs.id
      WHERE playlist_songs.playlist_id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = OpenMusicService;
