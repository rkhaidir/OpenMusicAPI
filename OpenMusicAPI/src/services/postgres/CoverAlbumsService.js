const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');

class CoverAlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addCoverAlbum(id, image) {
    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
      values: [image, id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }
}

module.exports = CoverAlbumsService;
