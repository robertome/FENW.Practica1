export default class TokenService {

    constructor(tokenKey) {
        this._tokenKey = tokenKey;
    }

    store(token) {
        console.log("Token almacenado en session");
        sessionStorage.setItem(this._tokenKey, token);
    }

    getToken() {
        return sessionStorage.getItem(this._tokenKey);
    }

    destroy() {
        console.log("Token eliminado de session");
        sessionStorage.clear();
    }

}
