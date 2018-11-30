const TOKEN = "fenw.etsisi.upm.es.token";
const PORT = 5555;
const URL_LOGIN = `http://fenw.etsisi.upm.es:${PORT}/users/login`;

function login() {
    console.log("sending login...");
    let username = $("#elLoginFormUsuario").val();
    let password = $("#elLoginFormPassword").val();
    $.ajax(
        {
            url: `${URL_LOGIN}?username=${username}&password=${password}`,
            type: "GET"
        })
        .done(successLoginCallback)
        .fail(errorLoginCallback)
        .always(cleanLoginCallback);

    return false;
}

function cleanLoginCallback() {
    $("#elLoginFormUsuario").val("");
    $("#elLoginFormPassword").val("");
}

function errorLoginCallback(xhr, status, error) {
    console.log("Error: " + error);
    console.log("Status: " + status);
    console.dir(xhr);

    //show login error
    $("#loginErrorModalDialog").modal();
    $("#loginErrorModelDialogText").text(`${error}: ${xhr.responseText}`);
}

function successLoginCallback(data, status, xhr) {
    console.log("respuesta en callback \nStatus:" + status +
        "\nResponse:" + data
        + "\nHeaders: " + xhr.getAllResponseHeaders());

    let responseAutentication = data;
    let headerAutentication = xhr.getResponseHeader("authorization");
    if (!checkIntegrity(responseAutentication, headerAutentication)) {
        //show login error integrity
        $("#loginErrorModalDialog").modal();
        $("#loginErrorModelDialogText").text("Token de autenticación NO verificado");
    } else {
        console.log("Token almacenado en session");
        sessionStorage.setItem(TOKEN, headerAutentication);
        $("#elNavUsernameText").text($("#elLoginFormUsuario").val());

        toggleLoginElements();
    }
}

function checkIntegrity(responseAutentication, headerAutentication) {
    if (responseAutentication == headerAutentication) {
        console.log("Token de autenticación verificado")
        return true;
    }

    console.log("Token de autenticación NO verificado")
    return false;
}

function logout() {
    console.log("Token eliminado de session");
    sessionStorage.clear();

    toggleLoginElements();
}

function toggleLoginElements() {
    $("#elNavReservar").toggle();
    $("#elSectionReservar").toggle();
    $("#elNavLogout").toggle();

    $("#elNavLogin").toggle();
    $("#elNavRegistro").toggle();
    $("#elButtonInicioRegistro").toggle();
    $("#elSectionRegistro").toggle();
}

$(function () {
    //Conf navbar
    $("#elFormLogin").on("submit", () => login());
    $("#elButtonLogout").on("click", () => logout());
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
});