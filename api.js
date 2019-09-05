import axios from 'axios';

const getBosSTSInfo = tokenUrl => axios.get(tokenUrl).then(resp => resp.data.data);

export default {
  getBosSTSInfo,
};
