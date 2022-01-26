import Vue from 'vue';
import Vuex from 'vuex';
import SiteStore from '@/store/modules/Common/SiteStore';
import defaultState from './ config';
import UserStore from './modules/Common/UserStore';
// 通用模块
import Common from './modules/Common';

Vue.use(Vuex);
const store = {
  state: defaultState,
  modules: {
    SiteStore,
    UserStore,
    Common,
  },
};
const state = new Vuex.Store(store);

export default state;
