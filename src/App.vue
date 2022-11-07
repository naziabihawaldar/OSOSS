<template>
  <v-app>
    <div >
    <v-toolbar :clipped-left="$vuetify.breakpoint.lgAndUp" class="cstm_toolbar">
      <v-toolbar-title style="max-width: 300px" class="ml-0">
        <a onclick="window.location.replace('/users');">
          <v-img src="/images/logo.png" width="150"></v-img>
        </a>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="is_logged_in">
        <v-btn to="/users" color="secondary" flat class="ma-0">User</v-btn>
        <v-btn to="/companies" color="secondary" flat class="ma-0">Companies</v-btn>

        <v-menu offset-y left>
          <v-btn icon color="white" large slot="activator" class="table_opacity_8">
              <span class="profile_avatar" >
                <v-avatar>
                <v-img src="/images/default_user.png" width="50"></v-img></v-avatar>
              </span>
          </v-btn>
        <v-list>
          <v-list-tile @click="logout">
            <v-list-tile-title>Logout</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </div>

    </v-toolbar>

    <v-content style="padding-top: 0px !important">
      <router-view :key="$route.fullPath"></router-view>
    </v-content>

  </div>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "App",
  watch:{
  },
  computed: {
    ...mapGetters(["get_user", "get_permissions"]),

  },
  methods: {
    openDialog() {
      this.dialog = true;
      this.change_dialog = true;
    },

    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('user');
        window.location.replace("/login");
    },
    validateBeforeSubmit:function(scope) {
      this.$validator.validateAll(scope).then(result => {
        if(result){
          this[scope]();
        }
      });
    }
    },
  data() {
    return {
      is_logged_in: false,
      dialog:false,
      change_dialog:false,

    };
  },
  mounted() {
    if(localStorage.getItem('access_token') !== null) {
      this.is_logged_in = true;
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('access_token');
    }
    this.moment.tz.setDefault('UTC');
  }
}
</script>
