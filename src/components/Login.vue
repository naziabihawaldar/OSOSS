<template>
  <div>
    <br>
    <v-container fluid grid-list-md>
      <v-layout row wrap>

        <v-flex xs12 sm8 offset-sm2 md4 offset-md4>
          <v-card style="background: rgba(252,252,252,0.8); position: relative" class="text-xs-center">

            <br><br> <br>
            <v-img src="/images/logo.png" width="52%" style="margin: 0 auto;"></v-img>
            <v-card-title>
              <v-flex xs12>
                  <h2 class="secondary--text">Welcome to HRMS</h2>
              </v-flex>

              <v-flex xs12>
                <br>
                <v-form @submit.prevent="validateBeforeSubmit" width="100%" class="login_form">
                  <v-text-field
                  v-model="email"
                  label="E-mail Address"
                  name="email"
                  color="secondary"
                  outline
                  solo flat
                  required></v-text-field>
                  <v-text-field
                    v-model="password"
                    :append-icon="e1 ? 'visibility' : 'visibility_off'"
                    @click:append="() => (e1 = !e1)"
                    :type="e1 ? 'password' : 'text'"
                    name="password"
                    label="Password"
                    required
                    color="secondary"
                    outline
                  ></v-text-field>

                  <v-btn
                    round
                    outline
                    style="border: 2px solid; padding: 10px 50px !important"
                    type="submit"
                    class="secondary secondary--text"
                    :loading="is_loading"
                    :disabled="is_loading"
                  >Login</v-btn>
                  <br>
                  <br>
                </v-form>
              </v-flex>

              <v-alert :value="true" outline color="error" icon="warning" v-if="error">{{ error }}</v-alert>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
export default {
  created() {},
  methods: {
    login() {
      this.is_loading = true;
      var data = {
        email: this.email,
        password: this.password
      };
      axios
        .post(`${process.env.VUE_APP_API_URL}/api/login`, data)
        .then(response => {
          if (response.data.status == 1) {
            // this.$store.dispatch('storeUser', response.data.user);
            this.$store.dispatch('storeUser', response.data.user)
                .then(() => {
                  this.$parent.$emit('permissions-fetched');
                })
            localStorage.setItem("access_token", response.data.access_token);
            localStorage.setItem("expiration", response.data.expiration);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            window.location.replace("/");
          } else {
            this.error = response.data.message;
          }
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.is_loading = false;
        });
    },

    validateBeforeSubmit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.login();
        }
        return false;
      });
    }
  },
  data() {
    return {
      e1: true,
      is_loading: false,
      email: "",
      password: "",
      emailRules: [
        v => !!v || "E-mail is required",
        v =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "E-mail must be valid"
      ],
      error: this.$route.query.error,
      formErrors: {}
    };
  },
  mounted() {}
};
</script>
<style>
body {
  background: #ecf1f4;
}
</style>
