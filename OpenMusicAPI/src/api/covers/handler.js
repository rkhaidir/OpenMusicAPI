const autoBind = require('auto-bind');

class CoversHandler {
  constructor(storageService, coverAlbumsService, validator) {
    this._storageService = storageService;
    this._coverAlbumsService = coverAlbumsService;
    this._validator = validator;

    autoBind(this);
  }

  async postCoverImageHandler(request, h) {
    const { id } = request.params;
    const { cover } = request.payload;
    this._validator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/covers/images/${filename}`;
    const coverUrl = await this._coverAlbumsService.addCoverAlbum(id, fileLocation);

    const response = h.response({
      status: 'success',
      message: 'Cover berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = CoversHandler;
