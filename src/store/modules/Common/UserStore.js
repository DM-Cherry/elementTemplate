// eslint-disable-next-line no-unused-vars

export default {
  namespaced: true,
  state: {
    user: false,
  },
  mutations: {
    fetch(state, payload) {
      state.user = payload.user;
      // eslint-disable-next-line dot-notation
      this._vm.$storage['user'].setItem('currentUser', state.user);
    },

    reset(state) {
      state.user = null;
      // eslint-disable-next-line dot-notation
      this._vm.$storage['user'].removeItem('currentUser');
    },
  },
  actions: {
    async initialize({ state }, force) {
      if (!state.user || force) {
        // eslint-disable-next-line dot-notation
        state.user = await this._vm.$storage['user'].getItem('currentUser');
      }
    },
    fetch({ commit }, user) {
      commit('fetch', {
        user,
      });
    },
  },
  getters: {
    info: state => {
      return state.user;
    },
    user: state => state.user,
  },
};
