export default class Upload {
  constructor(tokenUrl:string, bosConfig:bosConfig){
  }
  putObjectFromBlob(blob: Blob, key: string): string
  putObjectFromBlob(blob: Blob, key: string, needInfo: boolean): fileInfo

}

interface bosConfig{
  bucket: string,
  credentials: {
    ak: string,
    sk: string,
  },
  sessionToken: string,
  endpoint: string,
}
interface fileInfo{
  
}

interface config{
  needFileInfo: boolean,
}