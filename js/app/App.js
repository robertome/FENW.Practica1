import LoginService from './LoginService.js';
import TokenService from './TokenService.js';

export default class App {

    constructor(urlLogin, tokenKey) {
        this._loginService = new LoginService(urlLogin);
        this._tokenService = new TokenService(tokenKey);

        //Conf navbar
        $("#elFormLogin").on("submit", () => this.login());
        $("#elButtonLogout").on("click", () => this.logout());
        $("#elNavReservar").hide();
        $("#elSectionReservar").hide();
        $("#elNavLogout").hide();

        //Conf datepicker
        $("#elFormRegistroFechaNacimiento").datepicker($.datepicker.regional["es"]);

        // Smooth scrolling to all links in navbar
        $(".navbar a, #elButtonInicioRegistro, #elAnchorToTop").on('click', function (event) {
            if (this.hash !== "") {
                var hash = this.hash;
                $('html, body').animate({
                    scrollTop: $(hash).offset().top
                }, 900, function () {
                });
            }
        });

    }

    login() {
        let username = $("#elLoginFormUsuario").val();
        let password = $("#elLoginFormPassword").val();

        this._loginService.login(username, password,
            (data, status, xhr) => this._successLoginCallback(data, status, xhr),
            (xhr, status, error) => this._failLoginCallback(xhr, status, error),
            () => this._cleanLoginCallback());

        return false;
    }

    _cleanLoginCallback() {
        $("#elLoginFormUsuario").val("");
        $("#elLoginFormPassword").val("");
    }

    _failLoginCallback(xhr, status, error) {
        console.log("Error: " + error);
        console.log("Status: " + status);
        console.dir(xhr);

        this._showLoginError(`${error}: ${xhr.responseText}`);
    }

    _successLoginCallback(data, status, xhr) {
        console.log("respuesta en callback \nStatus:" + status +
            "\nResponse:" + data
            + "\nHeaders: " + xhr.getAllResponseHeaders());

        let responseAutentication = data;
        let headerAutentication = xhr.getResponseHeader("authorization");
        if (!this._checkIntegrity(responseAutentication, headerAutentication)) {
            this._showLoginError("Token de autenticación NO verificado");
        } else {
            this._toggleLoginElements();
            this._tokenService.store(headerAutentication);
        }
    }

    _showLoginError(message) {
        $("#loginErrorModalDialog").modal();
        $("#loginErrorModelDialogText").text(message);
    }

    _checkIntegrity(responseAutentication, headerAutentication) {
        if (responseAutentication == headerAutentication) {
            console.log("Token de autenticación verificado");
            return true;
        }

        console.log("Token de autenticación NO verificado");
        return false;
    }

    logout() {        
        this._toggleLoginElements();
        this._tokenService.destroy();
    }

    _toggleLoginElements() {
        $("#elNavReservar").toggle();
        $("#elSectionReservar").toggle();
        $("#elNavLogout").toggle();

        $("#elNavLogin").toggle();
        $("#elNavRegistro").toggle();
        $("#elButtonInicioRegistro").toggle();
        $("#elSectionRegistro").toggle();
    }
}