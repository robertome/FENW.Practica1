import App from './app/App.js';

$(function () {            
    const PORT = 5555,
        URL_LOGIN = `http://fenw.etsisi.upm.es:${PORT}/users/login`,
        TOKEN_KEY = "fenw.etsisi.upm.es.token";

    new App(URL_LOGIN, TOKEN_KEY);
});
