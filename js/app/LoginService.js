export default class LoginService {

    constructor(url) {
        this.url = url;
    }

    login(username, password, successCallback, failCallback, allwaysCallback) {
        console.log("sending login...");
        $.ajax({
            url: `${this.url}?username=${username}&password=${password}`,
            type: "GET"
        }).done(successCallback)
            .fail(failCallback)
            .always(allwaysCallback);
    }

}