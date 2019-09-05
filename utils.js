const utils = {
  async createBosClientInfo(blob, url) {
    const baseInfo = {
      fileName: blob.name,
      fileType: blob.type,
      fileSize: blob.size,
      url,
    };
    const fileInfo = await utils.getFileInfo(blob);
    return Object.assign({}, baseInfo, fileInfo);
  },
  getMetaInfo(opts) {
    const { fileName } = opts;
    return {
      'Content-Disposition': `attachment;filename=${fileName}`,
    };
  },

  async getFileInfo(blob) {
    const { type } = blob;
    const isImage = /^image\/(png|jpe?g|gif)$/.test(type);

    if (isImage) {
      return utils.getImageInfo(blob);
    }
    return {};
  },

  async getImageInfo(blob) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const img = new Image();
        img.addEventListener('load', () => {
          const info = {
            imageWidth: img.width,
            imageHeight: img.height,
          };
          resolve(info);
        });
        img.src = reader.result;
      });
      reader.readAsDataURL(blob);
    });
  },
};

export default utils;
