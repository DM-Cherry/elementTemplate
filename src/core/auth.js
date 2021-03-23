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
    const headerConfig = config;
    if (token) {
      headerConfig.headers.Authorization = `${token}`;
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
    /* eslint-disable */
    const url = response?.config?.url || '';
    return response;
  },
  error => {
    if (error.response) {
      const body = [];
      let message = '';
      const { vue } = window;
      const route = vue.$route;
      switch (error.response.status) {
        case 400:
          break;
        case 401: {
          const r = JSON.stringify({
            name: route.name,
            params: route.params,
          });
          console.warn('token过期', r); // eslint-disable-line no-console
          setTimeout(() => {
            // 返回 401 更新token信息
            store.commit('Common/Auth/refreshToken');
            router.replace({
              name: r.name,
            });
          }, 3000);
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
