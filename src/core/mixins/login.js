export default {
  methods: {
    /* eslint-disable no-unused-vars */
    async fetchUserInfo(token) {
      //  await this.$store.dispatch('Common/Auth/login', token);
      await Promise.all([this.$store.dispatch('UserStore/fetch')]);
    },
  },
};
