import axios from 'axios';
import store from '../store';
import router from '../router';

// axios 配置
axios.defaults.timeout = 60 * 1000;
axios.defaults.baseURL = store.state.default.apiBase;
// axios.defaults.withCredentials = true;

// http request 拦截器
axios.interceptors.request.use(
  config => {
    // console.trace({config})
    // 判断是否存在token，如果存在的话，则每个http header都加上token
    const token = localStorage.getItem('jwtToken');
    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  },
);

function getErrorMessage(error) {
  let message = error.response.data;
  if (
    error.response.data &&
    typeof error.response.data.message === 'string' &&
    error.response.data.message !== ''
  ) {
    message = error.response.data.message;
  }

  if (typeof message !== 'string') {
    message = JSON.stringify(message);
  }
  return message;
}

// http response 拦截器
axios.interceptors.response.use(
  response => {
    switch (response.data.code) {
      case '400':
        break;
      case '401':
        localStorage.removeItem('jwtToken');
        router
          .replace({
            path: '/',
          })
          .catch(err => {
            console.log(err);
          });
        break;
      case '404':
        break;
      default:
        return response;
    }
  },
  error => {
    if (error.response) {
      let message = '';
      const { vue } = window;
      switch (error.response.status) {
        case 400:
          break;
        case 401: {
          localStorage.removeItem('jwtToken');
          return Promise.reject(error.response);
        }
        case 404:
          break;
        case 500:
          message = getErrorMessage(error);
          vue.$notify.error({
            title: '服务器内部错误',
            desc: message,
          });
          break;
        default:
          message = getErrorMessage(error);
          vue.$notify.error({
            title: '出错了',
            desc: `错误代码：${error.response.status}，详情：${message}`,
          });
          break;
      }
    }
    // 返回接口返回的错误信息
    return Promise.reject(error.response);
  },
);

export default axios;
