<template>
  <div
    :class="classList"
    :data-level="level"
    :data-id="item.id"
    :data-module="item.module"
    v-if="visible"
  >
    <a v-if="isFolder" class="nav-link nav-dropdown-toggle" href="#" @click="handleClick">
      <i :class="item.icon" />
      {{ item.name }}
    </a>
    <template v-else>
      <a
        v-if="isAbsoluteUrl"
        :href="absoluteUrl"
        class="nav-link"
        :target="item.attributes && item.attributes.target ? item.attributes.target : 'self'"
      >
        <i :class="item.icon" />
        {{ item.name }}
      </a>
      <router-link v-else :to="targetUrl" class="nav-link">
        <i :class="item.icon" />
        {{ item.name }}
      </router-link>
    </template>
    <ul v-if="isFolder" class="nav-dropdown-items">
      <z-sidebar-menuitem
        v-for="subitem in item.children"
        :key="subitem.id"
        :item="subitem"
        :level="subLevel"
      />
    </ul>
  </div>
</template>

<script>
import format from '@/core/format';

export default {
  name: 'ZSidebarMenuitem',
  props: {
    item: {
      type: Object,
      default() {
        return null;
      },
    },
    level: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    subLevel() {
      if (Number.isNaN(this.level)) {
        return 1;
      }
      return this.level + 1;
    },
    classList() {
      let className = 'nav-item';
      if (Array.isArray(this.item.children) && this.item.children.length > 0) {
        className += ' nav-dropdown';
        if (this.$route.name.indexOf(this.item.route_name) === 0) {
          className += ' open';
        }
      }
      if (this.item.route_name === this.$route.name) {
        className += ' active';
      }
      return className;
    },
    isAbsoluteUrl() {
      return /^(f|ht)tps?:\/\//i.test(this.item.url);
    },
    absoluteUrl() {
      const jwtToken = localStorage.getItem('jwtToken');
      if (this.item.attributes && jwtToken) {
        return `${this.item.url}?token=${jwtToken.substr(7)}`;
      }
      return this.item.url;
    },
    targetUrl() {
      let { url } = this.item;
      if (this.item?.attributes?.route?.query) {
        try {
          // eslint-disable-next-line no-eval
          let querystring = eval(this.item?.attributes?.route?.query)();
          if (querystring && typeof querystring === 'object') {
            querystring = Object.keys(querystring)
              .map(key => {
                return `${encodeURIComponent(key)}=${encodeURIComponent(querystring[key])}`;
              })
              .join('&');
            if (url) {
              url += url.indexOf('?') > 0 ? `&${querystring}` : `?${querystring}`;
            }
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
        }
      }
      if (url) {
        return format(url);
      }
      return '#';
    },
    isFolder() {
      // if (Array.isArray(this.item.children) && this.item.children.length > 0) {
      //   let folder = false;
      //   for (let i = 0; i < this.item.children.length; i++) {
      //     if (this.item.children[i].visible === 1) {
      //       folder = true;
      //       break;
      //     }
      //   }
      //   return folder;
      // }
      return false;
    },
    visible() {
      const name = this.item.route_name;
      const permissionList = JSON.parse(localStorage.getItem('permission'));
      const haveRoute = permissionList.filter(item => item.accessUrl === name);
      console.log(haveRoute.length > 0, 'routes');
      return haveRoute.length > 0;
    },
  },
  async created() {
    await this.$store.dispatch('UserStore/initialize', true);
  },
  methods: {
    handleClick(e) {
      e.preventDefault();
      e.target.parentElement.classList.toggle('open');
    },
    hideMobile() {
      if (document.body.classList.contains('sidebar-mobile-show')) {
        document.body.classList.toggle('sidebar-mobile-show');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.nav-link {
  cursor: pointer;
  svg {
    margin-right: 4px;
  }
}
</style>
