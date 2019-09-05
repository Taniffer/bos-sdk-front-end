import { BosClient } from 'bce-sdk-js/baidubce-sdk.bundle';
import md5 from 'md5';
import api from './api';
import utils from './utils';

const { getBosSTSInfo } = api;
const { createBosClientInfo } = utils;

const defaultBosConfig = {
  credentials: {
    ak: '',
    sk: '',
  },
  endpoint: '',
  bucket: '',
};
export default class Upload {
  /**
   * 初始化
   * @param {string} tokenUrl
   * @param {object} bosConfig
   * @memberof Upload
   */
  constructor(tokenUrl, bosConfig) {
    const newBosConfig = Object.assign({}, defaultBosConfig, bosConfig);
    this.tokenUrl = tokenUrl;
    this.bosClient = new BosClient(newBosConfig);
    this.bosConfig = newBosConfig;
    this.retryNumber = 0;
  }

  async putObjectFromBlob(blob, key, needInfo) {
    const dotIndex = blob.name.lastIndexOf('.');
    const ext = dotIndex > -1 ? blob.name.substr(dotIndex) : '';
    const name = (+new Date()) + md5(blob.name) + ext;
    // const metaInfo = getMetaInfo({
    //   fileName: blob.name,
    // });
    try {
      await this.bosClient.putObjectFromBlob(this.bosConfig.bucket, key || name, blob);
      this.retryNumber = 0;
    } catch (err) {
      if (this.retryNumber < 2) {
        await this.updateBosConfig();
        this.retryNumber = this.retryNumber + 1;
        return this.putObjectFromBlob(blob, key, needInfo);
      }
      this.retryNumber = 0;
      throw new Error('上传失败');
    }
    const url = await this.bosClient.generateUrl(this.bosConfig.bucket, key || name);
    if (!needInfo) return url;
    return createBosClientInfo(blob, url);
  }

  async updateBosConfig() {
    const STInfo = await getBosSTSInfo(this.tokenUrl);
    const { accessKeyId, secretAccessKey, sessionToken } = STInfo;
    this.bosConfig.credentials.ak = accessKeyId;
    this.bosConfig.credentials.sk = secretAccessKey;
    this.bosConfig.sessionToken = sessionToken;
    this.bosClient = new BosClient(this.bosConfig);
  }
}
