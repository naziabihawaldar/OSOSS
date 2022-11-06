<template>
  <div>
    <v-container fluid grid-list-xs >
      <br>
      <v-layout class="index_header">
        <v-flex s12 md6>
          <h3 class="primary--text">Users</h3>
        </v-flex>
        <v-flex s12 md6 class="text-xs-right">
          <v-btn @click="user_object={};add_dialog=true" outline class="primary--text no_transform"
                 flat>Add
            User</v-btn>
        </v-flex>
      </v-layout>
          <v-data-table :headers="headers" :items="list" class="index_list" item-key="id" :loading="is_loading" :total-items="total_items" :pagination.sync="pagination" :rows-per-page-items="[10,25,50]">
            <template slot="items" slot-scope="props">
              <tr>
                <td class="accent--text">{{ props.item.name }}</td>
                <td class="accent--text">{{ props.item.email }}</td>
                <td >

                  <v-btn small outline class="primary--text no_transform"
                         @click="edit_obj(props.item.id)" flat>Edit</v-btn>
                  <v-btn small outline class="secondary--text"
                         @click="delete_obj(props.item.id)" flat>Delete</v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
<!--      Add USer Dialog -->
      <v-dialog v-model="add_dialog" max-width="800">
        <v-form @submit.prevent="validateBeforeSubmit('storeUser')" data-vv-scope="storeUser"
                id="storeUser" ref="form" >
          <v-card>
            <v-card-title> <h3 class="black--text">Add User</h3></v-card-title>
            <v-card-text>
              <v-container fluid grid-list-md>
                <v-layout row wrap>

                  <v-flex s12 md6 lg6>
                    <label> Name *</label>
                    <v-text-field color="secondary" outline name="Name" v-model="user_object.name"
                                  v-validate="'required'"
                                  :error-messages="errors.collect('storeUser.Name')" solo
                                  flat></v-text-field>
                  </v-flex>
                  <v-flex s12 md6 lg6>
                    <label> Email *</label>
                    <v-text-field color="secondary" outline name="Email" v-model="user_object.email"
                                  v-validate="'required'"
                                  :error-messages="errors.collect('storeUser.Email')"
                                  solo flat></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat @click="add_dialog = !add_dialog">Cancel</v-btn>
              <v-btn color="primary" :loading="submit_loader" :disabled="submit_loader" type="submit">Submit</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>


      <!--Edit Dialog-->
      <v-dialog v-model="edit_dialog" max-width="800">
        <v-form @submit.prevent="validateBeforeSubmit('updateUser')" data-vv-scope="updateUser"
                id="updateUser" ref="form" >
        <v-card>
          <v-card-title> <h3 class="black--text">Edit User</h3></v-card-title>
          <v-card-text>
            <v-container fluid grid-list-md>
              <v-layout row wrap>

              <v-flex s12 md6 lg6>
                <label> Name *</label>
                <v-text-field color="secondary" outline name="Name" v-model="user_object.name"
                              v-validate="'required'"
                               :error-messages="errors.collect('updateUser.Name')" solo flat></v-text-field>
              </v-flex>
              <v-flex s12 md6 lg6>
                <label> Email *</label>
                <v-text-field color="secondary" outline name="Email" v-model="user_object.email"
                              v-validate="'required'"
                              :error-messages="errors.collect('updateUser.Email')"
                              solo flat></v-text-field>
              </v-flex>
            </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="edit_dialog = !edit_dialog">Cancel</v-btn>
            <v-btn color="primary" :loading="submit_loader" :disabled="submit_loader" type="submit">Submit</v-btn>
          </v-card-actions>
        </v-card>
        </v-form>
      </v-dialog>
      <!--Delete Dialog-->
      <v-dialog v-model="delete_dialog" max-width="400">
        <v-card>
          <v-card-text>
            <p>Are you sure you want to delete this user?</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="delete_dialog = !delete_dialog">Cancel</v-btn>
            <v-btn color="error" flat @click="delete_user">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
    <v-snackbar v-model="snackbar_display" top right>
      {{snackbar_text}}
      <v-btn flat color="primary" @click.native="snackbar_display = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>
<script>
export default {
  watch: {
    pagination: {
      handler() {
        this.getList();
      }
    },
  },
  methods:{
    storeUser: function () {
      axios.post(`${process.env.VUE_APP_API_URL}/api/user`,this.user_object).then(response => {
        if (response.data.status == 1) {
          this.user_object = {};
          this.add_dialog = false;
          this.snackbar_text = 'User details added successfully';
          this.snackbar_display = true;
          this.getList();
        }
      }).catch(error => {
        console.log(error);
        this.snackbar_text = 'Error Occurred';
        this.snackbar_display = true;
      });
    },
    updateUser: function () {
      axios.post(`${process.env.VUE_APP_API_URL}/api/user/`+this.user_object.id+`/edit`,this.user_object).then(response => {
        if (response.data.status == 1) {
          this.user_object = {};
          this.edit_dialog = false;
          this.snackbar_text = 'User details updated successfully';
          this.snackbar_display = true;
          this.getList();
        }
      }).catch(error => {
        console.log(error);
        this.snackbar_text = 'Error Occurred';
        this.snackbar_display = true;
      });

    },
    delete_user: function () {
      axios.post(`${process.env.VUE_APP_API_URL}/api/delete-user`,{ id: this.delete_id }).then(response => {
        if (response.data.status == 1) {
            this.delete_dialog = false;
          this.snackbar_text = 'User deleted successfully';
          this.snackbar_display = true;
            this.getList();
        }
      }).catch(error => {
        console.log(error);
        this.snackbar_text = 'Error Occurred';
        this.snackbar_display = true;
      });
    },
    edit_obj: function (id) {
      if(id)
      {
        this.getUserDetail(id);

      }
    },
    delete_obj: function (id) {
      if(id)
      {
        this.delete_id = id;
        this.delete_dialog = true;
      }
    },
    getUserDetail: function (user_id) {
      axios
          .get(`${process.env.VUE_APP_API_URL}/api/user/`+user_id)
          .then(response => {
            if (response.data.status == 1) {
              this.edit_id = response.data.data.id;
              this.edit_dialog = true;
              this.user_object = response.data.data;
            }
          })
          .catch(error => {
            console.log(error);
          });
    },
    getList: function () {
      axios
          .get(`${process.env.VUE_APP_API_URL}/api/users`, {
            params: this.pagination
          })
          .then(response => {
            if (response.data.status == 1) {
              this.list = response.data.data.data;
              this.total_items = response.data.data.total;
            }
          })
          .catch(error => {
            console.log(error);
          });
    },
    validateBeforeSubmit: function(scope) {
      this.$validator.validateAll(scope).then(result => {
        if (result) {
          this[scope]();
        }
      });
    }
  },
  data: () => ({
    user_object:{},
    delete_id:'',
    edit_id:'',
    pagination: { sortBy: "check_in_time", descending: true },
    list: [],
    is_loading: false,
    delete_dialog: false,
    add_dialog: false,
    edit_dialog: false,
    submit_loader: false,
    total_items: 10,
    snackbar_display: false,
    snackbar_text: "",
    headers: [
      { text: "Name", value: "mobile_no", align: "left", sortable: false },
      { text: "Email", value: "company", align: "left" },
      { text: "Action", value: "host", align: "left" }
    ],
  }),
  mounted() {

  }
}
</script>
