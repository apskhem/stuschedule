import Vue from 'vue';
import axios from "axios";
import App from './App.vue';

export const eventBus = new Vue();

class GoogleAppsScriptDB {
    constructor(link) {
        this.link = link;
        this.callbackFunctions = {};
        this.defaultCallbackFunction = null;
        this.dataRequestForms = {};
    }

    FormatRequestURL(params, action) {
        let url = this.link + "?";

        for (const key in params) {
            let value = params[key];

            if (value instanceof Array) value = value.toString();
            else if (value instanceof Object) value = JSON.stringify(value);

            url += `${key}=${value}&`;
        }

        url += "action=" + action;
        return url;
    }

    Request(action, data, CallbackFunction) {
        let url = this.FormatRequestURL(data || this.dataRequestForms[action](), action);

        axios.get(url)
        .then(res => {
            if (CallbackFunction) {
                CallbackFunction(res.data, data || this.dataRequestForms[action]());
            }
            else if (this.callbackFunctions[action]) {
                this.callbackFunctions[action](res.data, data || this.dataRequestForms[action]());
            }
            else if (this.defaultCallbackFunction) {
                this.defaultCallbackFunction(res.data, data || this.dataRequestForms[action]());
            }
        });
    }

    Response(action, CallbackFunction) {
        if (CallbackFunction === null) {
            delete this.callbackFunctions[action];
        }
        else {
            this.callbackFunctions[action] = CallbackFunction;
        }
    }

    DefaultResponse(CallbackFunction) {
        this.defaultCallbackFunction = CallbackFunction
    }

    DataRequestForm(action, dataRequestForm) {
        if (dataRequestForm === null) {
            delete this.dataRequestForms[action];
        }
        else {
            this.dataRequestForms[action] = dataRequestForm;
        }
    }
}

export const db = new GoogleAppsScriptDB("https://script.google.com/macros/s/AKfycby-4uVdRZUORiWOfvtOOBuuluFNiGPedcxumDtQ9CqhiqRdLxM/exec");

db.Response("SIGNIN", (data, meta) => {
    if (data.err) eventBus.$emit("signInError");
    else eventBus.$emit("navigateToContents", data.userSettings, data.userData, {username: meta.username});
    
    // localStorage.setItem("user", meta.username);
})

db.Response("SIGNUP", (data) => {
    eventBus.$emit("signUpCallback", data.err);
})

db.DefaultResponse(() => {
    console.log("recieved an undetified callback from the server.");
})

Vue.config.productionTip = false;

new Vue({
    render: h => h(App),
    created() {
        
        if (localStorage.getItem("user")) {
            console.log(localStorage.getItem("user"));

            // make request
        }
    }
}).$mount('#app');
