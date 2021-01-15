import Vue from 'vue';
import Vuex from 'vuex';
import defaultState from './ config';
import UserStore from './modules/Common/UserStore';
// 通用模块
import Common from './modules/Common';

Vue.use(Vuex);
const store = {
  state: defaultState,
  modules: {
    UserStore,
    Common,
  },
};
const state = new Vuex.Store(store);

export default state;
