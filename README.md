# bos-sdk-front-end

### 安装
````
 npm install bos-sdk-js-front-end
````

### 使用

#### 基础

````js
import Upload from 'bos-sdk-front-end';

const upload = new Upload(tokenUrl, {
  credentials: {
    ak: '', // require
    sk: '', // require
  },
  endpoint: '', // require
  sessionToken: '', // require
  bucket: '',
})

const url = await upload.putObjectFromBlob(file)// endpoint + bucket + hashname
````
#### 指定文件hashname

````js
const url = await upload.putObjectFromBlob(file, key)// endpoint + bucket + key
````

#### 得到文件详细信息

````js
const fileInfo = await upload.putObjectFromBlob(file, key, true)
````

### 最佳使用方式

````
  从后端获取时效性sessinoToken，前端使用sessionToken上传，防止前端ak，ak泄漏
````
