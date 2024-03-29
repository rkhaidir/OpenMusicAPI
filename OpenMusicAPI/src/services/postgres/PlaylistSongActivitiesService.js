const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapPlaylistActivityDBToModel } = require('../../utils/playlistActivities');

class PlaylistSongActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistActivity(
    playlistId,
    songId,
    userId,
    action,
  ) {
    const id = `playlistActivity-${nanoid(16)}`;
    const time = new Date().toISOString();
    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Aktifitas gagal ditambahkan.');
    }

    return result.rows[0].id;
  }

  async getPlaylistActivities(playlistId) {
    const query = {
      text: `SELECT users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time FROM playlist_song_activities
      RIGHT JOIN users ON users.id = playlist_song_activities.user_id
      RIGHT JOIN songs ON songs.id = playlist_song_activities.song_id
      WHERE playlist_song_activities.playlist_id = $1 ORDER BY time`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan.');
    }

    return result.rows.map(mapPlaylistActivityDBToModel);
  }
}

module.exports = PlaylistSongActivitiesService;
