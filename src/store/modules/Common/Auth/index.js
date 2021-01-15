export default {
  namespaced: true,
  state: {},
  mutations: {
    login(state, jwtToken) {
      localStorage.setItem('jwtToken', jwtToken);
    },
    logout(state) {
      console.log('state', state);
    },
    refresh(state, jwtToken) {
      localStorage.setItem('jwtToken', jwtToken);
    },
    reset(state) {
      console.log('state', state);
      localStorage.removeItem('jwtToken');
    },
  },
  actions: {
    login({ commit }, jwtToken) {
      commit('login', jwtToken);
    },
    logout({ commit }) {
      this._vm
        .$axios('/web/auth/logout/')
        .then(() => {
          console.log('用户退出登录'); // eslint-disable-line no-console
        })
        .catch(error => {
          console.error(error); // eslint-disable-line no-console
        })
        .then(() => {
          commit(
            'SiteStore/reset',
            {},
            {
              root: true,
            },
          );
          commit(
            'UserStore/reset',
            {},
            {
              root: true,
            },
          );
          localStorage.clear();
          commit('logout');
        });
    },
    // 更新口令牌
    async refreshToken({ commit }) {
      // eslint-disable-next-line dot-notation
      const user = await this._vm.$storage['user'].getItem('currentUser');
      console.log(user, 'user');
      const url = `/getToken?userName=${user.userName}`;
      await this._vm
        .$axios(url)
        .then(response => {
          commit('refresh', response.data.token);
        })
        .catch(error => {
          console.error(error); // eslint-disable-line no-console
        });
    },
  },
  getters: {
    token: () => localStorage.getItem('jwtToken'),
  },
};
