// Client Data Service
import http from '../http-common'
import authHeader from "@/services/auth-header";

class ClientDataService {
    getClients() {
        const accountId = localStorage.getItem('id');
        return http.get(`api/accounts/${accountId}/clients/`, {
            headers: authHeader()});
    }

    saveClient(accountId, data) {
        return http.post(`api/accounts/${accountId}/clients/`, data, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
    }

    getClientByAccountIdAndId(id) {
        const accountId = localStorage.getItem('id');
        return http.get(`api/accounts/${accountId}/clients/${id}/`, {
            headers: authHeader()});
    }

    updateClient(clientId, data) {
        const accountId = localStorage.getItem('id')
        return http.patch(`api/accounts/${accountId}/clients/${clientId}/`, data, {
            headers: authHeader()
        });
    }
}

export default new ClientDataService();
