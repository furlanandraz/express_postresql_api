import * as clients from '#clients';

class Static {

    constructor(clientType = 'readonly') {

        if (!clients[clientType]) {
            throw new Error(`Client type '${clientType}' is not defined in clients.`);
        }

        this.client = clients[clientType];
    }

    static setClient(clientType) {
        return new this(clientType);
    }

}

export default Static;