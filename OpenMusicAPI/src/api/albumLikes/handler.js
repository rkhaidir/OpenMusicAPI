const autoBind = require('auto-bind');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumLikesHandler {
  constructor(service, albumsService) {
    this._service = service;
    this._albumsService = albumsService;

    autoBind(this);
  }

  async postLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._albumsService.checkAlbum(albumId);
    const check = await this._service.checkAlbumLike(albumId, credentialId);

    if (check) {
      throw new InvariantError('Gagal menambahkan like.');
    }

    await this._service.addAlbumLike(albumId, credentialId);
    const response = h.response({
      status: 'success',
      message: 'Berhasil melakukan like.',
    });
    response.code(201);
    return response;
  }

  async deleteLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._albumsService.checkAlbum(albumId);
    const check = await this._service.checkAlbumLike(albumId, credentialId);

    if (!check) {
      throw new InvariantError('Gagal menghapus like.');
    }

    await this._service.deleteAlbumLike(albumId, credentialId);

    return {
      status: 'success',
      message: 'Berhasil menghapus like.',
    };
  }

  async getLikesHandler(request, h) {
    const { id: albumId } = request.params;
    await this._albumsService.checkAlbum(albumId);
    const { likes, cache } = await this._service.getAlbumLikes(albumId);
    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });

    if (cache) { response.header('X-Data-Source', 'cache'); }
    return response;
  }
}

module.exports = AlbumLikesHandler;
