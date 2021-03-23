export default {
  method: {
    ability() {
      // eslint-disable-next-line prefer-rest-params
      const args = [...arguments];
      const permissions = this.$store.getters['SiteStore/permissions'];
      if (!permissions) {
        return false;
      }
      const result = args.filter(permission => permissions.includes(permission));
      return result.length > 0;
    },
  },
};
