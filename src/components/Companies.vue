<template>
  <div>
    <v-container fluid grid-list-xs >
      <br>
      <v-layout class="index_header">
        <v-flex s12 md6>
          <h3 class="primary--text">Company List</h3>
        </v-flex>
        <v-flex s12 md6 class="text-xs-right">
          <v-btn @click="company_object={};add_dialog=true" outline
                 class="primary--text no_transform" flat>Add
            Company</v-btn>
        </v-flex>
      </v-layout>
      <v-data-table :headers="headers" :items="list" class="index_list" item-key="id" :loading="is_loading" :total-items="total_items" :pagination.sync="pagination" :rows-per-page-items="[10,25,50]">
        <template slot="items" slot-scope="props">
          <tr>
            <td class="accent--text">{{ props.item.name }}</td>
            <td class="accent--text">{{ props.item.address }}</td>
            <td class="accent--text">
                <span v-if="props.item.users && props.item.users.length > 0 ">
                   <v-chip v-for="user in props.item.users" >{{user.name}}</v-chip>
                </span>
                <span v-else> N/A </span>
            </td>
            <td >
              <v-btn small outline class="primary--text"
                     @click="add_user_obj(props.item)" flat>Add User</v-btn>
              <v-btn small outline class="primary--text no_transform"
                     @click="edit_obj(props.item.id)" flat>Edit</v-btn>
              <v-btn small outline class="secondary--text"
                     @click="delete_obj(props.item.id)" flat>Delete</v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
      <!--      Add Company Dialog -->
      <v-dialog v-model="add_dialog" max-width="800">
        <v-form @submit.prevent="validateBeforeSubmit('storecompany')" data-vv-scope="storecompany"
                id="storecompany" ref="form" >
          <v-card>
            <v-card-title> <h3 class="black--text">Add Company</h3></v-card-title>
            <v-card-text>
              <v-container fluid grid-list-md>
                <v-layout row wrap>
                  <v-flex s12 md6 lg6>
                    <label> Name *</label>
                    <v-text-field color="secondary" outline name="Name"
                                  v-model="company_object.name"
                                  v-validate="'required'"
                                  :error-messages="errors.collect('storeCompany.Name')" solo
                                  flat></v-text-field>
                  </v-flex>
                  <v-flex s12 md6 lg6>
                    <label> Address *</label>
                    <v-text-field color="secondary" outline name="Email"
                                  v-model="company_object.address"
                                  v-validate="'required'"
                                  :error-messages="errors.collect('storeCompany.Address')"
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
        <v-form @submit.prevent="validateBeforeSubmit('updatecompany')" data-vv-scope="updatecompany"
                id="updatecompany" ref="form" >
          <v-card>
            <v-card-title> <h3 class="black--text">Edit company</h3></v-card-title>
            <v-card-text>
              <v-container fluid grid-list-md>
                <v-layout row wrap>

                  <v-flex s12 md6 lg6>
                    <label> Name *</label>
                    <v-text-field color="secondary" outline name="Name" v-model="company_object.name"
                                  v-validate="'required'"
                                  :error-messages="errors.collect('updatecompany.Name')" solo flat></v-text-field>
                  </v-flex>
                  <v-flex s12 md6 lg6>
                    <label> Address *</label>
                    <v-text-field color="secondary" outline name="Address"
                                  v-model="company_object.address"
                                  v-validate="'required'"
                                  :error-messages="errors.collect('updatecompany.Address')"
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
            <p>Are you sure you want to delete this company?</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="delete_dialog = !delete_dialog">Cancel</v-btn>
            <v-btn color="error" flat @click="delete_company">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="add_user_dialog" max-width="800">
        <v-form @submit.prevent="validateBeforeSubmit('addUserCompany')"
                data-vv-scope="addUserCompany"
                id="addUserCompany" ref="form" >
          <v-card>
            <v-card-title> <h3 class="black--text">Add User To Company</h3></v-card-title>
            <v-card-text>
              <v-container fluid grid-list-md>
                <v-layout row wrap>
                  <v-flex s12 md6 lg6>
                    <label> User *</label>
                    <v-select
                        :items="user_list"
                        item-text="name"
                        item-value="id"
                        v-model="add_new_user_obj.users"
                        name="User"
                        v-validate="'required'"
                        :error-messages="errors.collect('addUserCompany.User')"
                        solo flat multiple chips color="secondary" outline

                    ></v-select>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat @click="add_user_dialog = !add_user_dialog">Cancel</v-btn>
              <v-btn color="primary" :loading="submit_loader" :disabled="submit_loader" type="submit">Submit</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
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
    addUserCompany:function(){
      this.add_new_user_obj.company_id = this.company_id;
      axios.post(`${process.env.VUE_APP_API_URL}/api/update-company-users`,this.add_new_user_obj).then(response=> {
        if (response.data.status == 1) {
          this.company_id = '';
          this.add_new_user_obj = {};
          this.add_user_dialog = false;
          this.snackbar_text = 'User attached to company successfully';
          this.snackbar_display = true;
          this.getList();
        }
      }).catch(error => {
        console.log(error);
        this.snackbar_text = 'Error Occurred';
        this.snackbar_display = true;
      });
    },
    getUsers:function(){
      axios.get(`${process.env.VUE_APP_API_URL}/api/get-users`).then(response=> {
        if(response.data.status == 1) {
         this.user_list = response.data.data;
        }
      }).catch(error => {
        console.log(error);
        this.snackbar_text = 'Error Occurred';
        this.snackbar_display = true;
      });
    },

    add_user_obj: function (obj) {
      this.company_id = obj.id;
      this.add_user_dialog = true;
      this.add_new_user_obj.users = obj.users;
    },
    storecompany: function () {
      axios.post(`${process.env.VUE_APP_API_URL}/api/company`,this.company_object).then(response=> {
        if (response.data.status == 1) {
          this.company_object = {};
          this.add_dialog = false;
          this.snackbar_text = 'company details added successfully';
          this.snackbar_display = true;
          this.getList();
        }
      }).catch(error => {
        console.log(error);
        this.snackbar_text = 'Error Occurred';
        this.snackbar_display = true;
      });
    },
    updatecompany: function () {
      axios.post(`${process.env.VUE_APP_API_URL}/api/company/`+this.company_object.id+`/edit`,this.company_object).then(response => {
        if (response.data.status == 1) {
          this.company_object = {};
          this.edit_dialog = false;
          this.snackbar_text = 'company details updated successfully';
          this.snackbar_display = true;
          this.getList();
        }
      }).catch(error => {
        console.log(error);
        this.snackbar_text = 'Error Occurred';
        this.snackbar_display = true;
      });

    },
    delete_company: function () {
      axios.post(`${process.env.VUE_APP_API_URL}/api/delete-company`,{ id: this.delete_id }).then(response => {
        if (response.data.status == 1) {
          this.delete_dialog = false;
          this.snackbar_text = 'company deleted successfully';
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
        this.getcompanyDetail(id);

      }
    },
    delete_obj: function (id) {
      if(id)
      {
        this.delete_id = id;
        this.delete_dialog = true;
      }
    },
    getcompanyDetail: function (company_id) {
      axios
          .get(`${process.env.VUE_APP_API_URL}/api/company/`+company_id)
          .then(response => {
            if (response.data.status == 1) {
              this.edit_id = response.data.data.id;
              this.edit_dialog = true;
              this.company_object = response.data.data;
            }
          })
          .catch(error => {
            console.log(error);
          });
    },
    getList: function () {
      axios
          .get(`${process.env.VUE_APP_API_URL}/api/companies`, {
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
    company_object:{},
    add_new_user_obj:{},
    delete_id:'',
    edit_id:'',
    company_id:'',
    pagination: { sortBy: "check_in_time", descending: true },
    list: [],
    user_list: [],
    is_loading: false,
    delete_dialog: false,
    add_dialog: false,
    edit_dialog: false,
    add_user_dialog: false,
    submit_loader: false,
    total_items: 10,
    snackbar_display: false,
    snackbar_text: "",
    headers: [
      { text: "Name", value: "mobile_no", align: "left", sortable: false },
      { text: "Address", value: "address", align: "left",sortable: false },
      { text: "Users", value: "users", align: "left",sortable: false },
      { text: "Action", value: "host", align: "left",sortable: false }
    ],
  }),
  mounted() {
    this.getUsers();

  }
}
</script>
