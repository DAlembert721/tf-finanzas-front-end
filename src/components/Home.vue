<template>
  <v-container fluid class="py-0 px-0">
    <Slidebar></Slidebar>
    <v-row>
      <v-col class="col-sm-3">
        <v-row no-gutters class="d-flex justify-center pt-10">
          <h3>Bienvenido, {{ account.first_name }}</h3>
        </v-row>
        <v-row class="mx-auto d-flex justify-center py-6">
          <v-img max-width="50%" max-height="50%" src="@/assets/bodega.png"></v-img>
        </v-row>
        <v-row class="mx-auto d-flex justify-center">
          <h3>{{ account.organization }}</h3>
        </v-row>
        <v-row class="mx-auto d-flex justify-center">
          <h3>RUC: {{ account.ruc }}</h3>
        </v-row>
      </v-col>
      <v-col class="col-sm-9">
        <v-card>
          <v-card-title>
            Clientes
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line
                          hide-details>
              <v-dialog slot="append" v-model="addClientDialog" max-width="60%">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn class="md12 hidden-sm-and-down" color="green accent-2" v-bind="attrs"
                         v-on="on">+ Agregar cliente
                  </v-btn>
                  <v-btn class="sm12 hidden-md-and-up" color="green accent-2" v-bind="attrs"
                         v-on="on" small>+
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>Agregar cliente</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col class="col-sm-5">
                        <v-row>
                          <v-text-field v-model="client.first_name"
                                        label="Nombre"></v-text-field>
                        </v-row>
                        <v-row>
                          <v-text-field v-model="client.last_name"
                                        label="Apellidos"></v-text-field>
                        </v-row>
                        <v-row>
                          <v-text-field v-model="client.phone" label="Celular"></v-text-field>
                        </v-row>
                        <v-row>
                          <v-text-field v-model="client.dni" label="DNI"></v-text-field>
                        </v-row>
                      </v-col>
                      <v-spacer></v-spacer>
                      <v-col class="col-sm-5">
                        <v-row>
                          <v-col>
                            <v-text-field v-model="client.email"
                                          label="Email"></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col>
                            <v-text-field v-model="client.address"
                                          label="Dirección"></v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col>
                            <v-text-field v-model="client.credit_total"
                                          :rules="numberRule"
                                          error-count="2"
                                          type="number"
                                          label="Línea de crédito"
                                          prefix="S/"></v-text-field>
                          </v-col>
                          <v-col>
                            <v-select :items="currencies" v-model="client.currency"
                                      label="Moneda"></v-select>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col>
                            <v-text-field v-model="client.maintenance" label="Mantenimiento"
                                          :rules="numberRule"
                                          error-count="2"
                                          type="number"
                                          prefix="S/"></v-text-field>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field v-model="client.compensatory_value"
                                      :rules="numberRule"
                                      error-count="2"
                                      type="number"
                                      label="Tasa de interés" suffix="%"></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field v-model="client.moratorium_value"
                                      :rules="numberRule"
                                      error-count="2"
                                      type="number"
                                      label="Tasa de interés con mora"
                                      suffix="%"></v-text-field>
                      </v-col>
                      <v-col>
                        <v-select :items="rates"
                                  v-model="rateChose"
                                  item-text="combined"
                                  item-value="id"
                                  label="Tipo tasa"
                                  return-object></v-select>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green accent-2" @click="saveClient()">Agregar</v-btn>
                    <v-btn color="green accent-2" @click="addClientDialog = false">Cancelar</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-text-field>
          </v-card-title>
          <v-data-table
              :headers="headers"
              :items="clients"
              :search="search"
              :footer-props="{
                'items-per-page-text': 'Clientes por página:'
              }">
            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="goToClient(item)">
                mdi-account-details
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Slidebar from "@/components/Slidebar";
import ClientDataService from "@/services/ClientDataService";
import AccountDataService from "@/services/AccountDataService";
import RateDataService from "@/services/RateDataService";

export default {
  name: "Home",
  components: {Slidebar},
  data: () => ({
    headers: [
      {text: 'Nombre', align: 'start', sortable: true, value: 'fullName'},
      {text: 'Línea de crédito', value: 'creditLine', sortable: false},
      {text: 'DNI', value: 'dni', sortable: false},
      {text: 'Número telefónico', value: 'phone', sortable: false},
      {text: 'Email', value: 'email', sortable: false},
      {text: 'Detalles', value: 'actions', sortable: false}
    ],
    id: 0,
    account: {
      email: '',
      first_name: '',
      last_name: '',
      dni: '',
      phone: '',
      address: '',
      organization: '',
      ruc: '',
      location: ''
    },
    client: {
      first_name: '',
      last_name: '',
      email: '',
      address: '',
      phone: '',
      dni: '',
      credit_total: 0,
      compensatory_value: 0,
      moratorium_value: 0,
      currency: '',
      rate_id: '',
      quotation: 1,
      maintenance: 0
    },
    payday: 1,
    addClientDialog: false,
    currencies: ['Soles', 'Dolares'],
    rateChose: null,
    rates: [],
    clients: [],
    search: null,
    numberRule: [v => !isNaN(parseFloat(v)) && parseFloat(v) >= 0 || 'El numero debe de ser positivo'],
  }),
  mounted() {
    this.id = localStorage.getItem('id')
    this.getClientsByAccount();
    this.getUserById(this.id);
    this.getRates();
  },
  created() {
    if (!localStorage.getItem('token')) {
      this.$router.push('/login')
    }
  },
  methods: {
    getUserById(id) {
      AccountDataService.getAccountById(id).then(response => {
        this.account = response.data;
      }).catch(e => {
        console.log(e);
      });
    },
    getClientsByAccount() {
      ClientDataService.getClients()
          .then(response => {
            const values = response.data;
            values.forEach(value => {
              const val = {
                id: value.id,
                fullName: value.first_name + ' ' + value.last_name,
                email: value.email,
                address: value.address,
                phone: value.phone,
                dni: value.dni,
                creditLine: value.credit_total,
                compensatoryValue: value.compensatory_value,
                moratoriumValue: value.moratorium_value,
                rateName: value.rate_name,
                openDate: value.open_date,
                quotation: value.quotation,
                maintenance: value.maintenance
              }
              this.clients.push(val);
            })
            console.log(this.clients);
          })
          .catch(e => {
            console.log(e);
          })
    },
    getRates() {
      this.clients = [];
      RateDataService.getRates().then(response => {
        const values = response.data;
        values.forEach(value => {
          const val = {id: value.id, combined: value.name + ' ' + value.type,}
          this.rates.push(val);
        })
        this.rateChose = this.rates[1];
      }).catch(e => {
        console.log(e);
      });
    },
    saveClient() {
      this.client.rate_id = this.rateChose.id;
      console.log(this.client);
      ClientDataService.saveClient(this.id, this.client).then(response => {
        console.log(response);
        this.client = {
          first_name: '',
          last_name: '',
          email: '',
          address: '',
          phone: '',
          dni: '',
          credit_total: 0,
          compensatory_value: 0,
          moratorium_value: 0,
          currency: '',
          rate_id: '',
          quotation: 1,
          maintenance: 0
        }
        this.getClientsByAccount();
        this.addClientDialog = false;
      }).catch(e => {
        console.log(e);
      });
    },
    goToClient(client) {
      this.$router.push(`/client/${client.id}`)
    }
  },

}
</script>

<style scoped>

</style>
