import axios, { Axios } from 'axios';

class NetworkRequest {
    axios: Axios;

    constructor() {
        this.axios = axios;
    }

    public async send(url: string, method?: string, payload?: { [key: string]: any }) {
        const options = {
            url: url,
            method: method || "GET",
            data: {}
        }

        if (payload) {
            options.data = payload;
        }

        try {
            const result = await axios(options);

            return result.data;
        } catch (error: any) {
            throw error.message;
        }

    }
}

const networkRequest =  new NetworkRequest();

export default networkRequest;