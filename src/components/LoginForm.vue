<template>
    <div class="form-container" v-if="showModule">
        <form :class="{ freeze: isRequesting }">
            <div class="form-content">
                <div class="form-header">Welcome to StuSchedule</div>
                <div class="h-desc">The best app for student schedule management</div>
                <div v-if="mode === 'SIGNIN'">
                    <label for="username">Username or Email</label>
                    <input type="text" id="username" name="username" placeholder="Username" v-model="inputUsername" @keypress.enter="Next" :disabled="isRequesting">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" placeholder="Password" v-model="inputPassword" @keypress.enter="SignIn" :disabled="isRequesting">
                    <div class="form-options">
                        <aside><span @click="mode = 'FORGOTPASSWORD';">Forgot Password?</span></aside>
                        <aside><span @click="mode = 'SIGNUP'">Sign Up</span></aside>
                    </div>
                    <input type="submit" @click="SignIn" value="Sign In" :disabled="isRequesting"/>
                </div>
                <div v-else-if="mode === 'SIGNUP'">
                    <label for="new-fullname">Full Name</label>
                    <input type="text" id="new-fullname" name="fullname" placeholder="Full Name" v-model="newFullname" @keypress.enter="Next" :disabled="isRequesting">
                    <label for="new-username">Username</label>
                    <input type="text" id="new-username" name="username" placeholder="Username" v-model="newUsername" @keypress.enter="Next" :disabled="isRequesting">
                    <label for="new-password">Password</label>
                    <input type="password" id="new-password" name="password" placeholder="Password" v-model="newPassword" @keypress.enter="Next" :disabled="isRequesting">
                    <label for="new-email">Email</label>
                    <input type="email" id="new-email" name="email" placeholder="Email" v-model="newEmail" @keypress.enter="SignIn" :disabled="isRequesting">
                    <label for="new-layout">Layout</label>
                    <input type="text" id="new-layout" name="layout" v-model="newLayout" disabled>
                    <div class="form-options">
                        <aside></aside>
                        <aside><span @click="mode = 'SIGNIN'">Back to Sign In</span></aside>
                    </div>
                    <input type="submit" @click="SignUp" value="Sign Up" :disabled="isRequesting"/>
                </div>
                <div  v-else-if="mode === 'FORGOTPASSWORD'">
                    <label for="recovery-email">Recovery Email</label>
                    <input type="email" id="recovery-email" name="recovery-email" placeholder="Recovery Email" v-model="recoveryEmail">
                    <div class="form-options">
                        <aside></aside>
                        <aside><span @click="mode = 'SIGNIN'">Back to Sign In</span></aside>
                    </div>
                </div>
                <li v-if="isRequesting || isError" class="status-text" :class="{ error: isError }">{{ statusText }}</li>
            </div>
        </form>
    </div>
</template>

<script>
import { eventBus, db } from '../main.js';
export default {
    name: 'LoginForm',
    data() {
        return {
            mode: "SIGNIN",
            isError: false,
            isRequesting: false,
            statusText: "Processing request...",
            showModule: true,
            inputUsername: "",
            inputPassword: "",
            newFullname: "",
            newUsername: "",
            newPassword: "",
            newEmail: "",
            newLayout: "CMU",
            recoveryEmail: ""
        };
    },
    methods: {
        Refocus() {

        },
        Next() {
            document.getElementById("password").focus();
        },
        SignIn() {
            // checking correction
            if (!this.inputUsername || !this.inputPassword) {
                this.isError = true;
                this.statusText = "Please fill the blanks before sign in.";
                return;
            }

            // pending
            if (this.isRequesting) return;

            this.statusText = "Processing request...";
            this.isError = false;
            this.isRequesting = true;

            // making request to the server
            db.Request("SIGNIN", {
                "username": this.inputUsername,
                "password": this.inputPassword
            });
        },
        SignUp() {
            // checking correction
            if (!this.newFullname || !this.newUsername || !this.newPassword || !this.newEmail || !this.newLayout) {
                this.isError = true;
                this.statusText = "Please fill the blanks before sign up.";
                return;
            }

            // pending
            if (this.isRequesting) return;

            this.statusText = "Processing request...";
            this.isError = false;
            this.isRequesting = true;

            // making request to the server
            db.Request("SIGNUP", {
                "username": this.newUsername,
                "password": this.newPassword,
                "email": this.newEmail,
                "userSettings": JSON.stringify({
                    "fullname": this.newFullname,
                    "layout": this.newLayout
                }),
                "userData": "{}"
            });
        }
    },
    watch: {
        mode() {
            this.isError = false;
        }
    },
    created() {
        eventBus.$on("navigateToContents", () => {
            this.inputUsername = "";
            this.inputPassword = "";
            this.isRequesting = false;
            this.isError = false;
            this.showModule = false;
        });
        eventBus.$on("signInError", () => {
            this.isError = true;
            this.isRequesting = false;
            this.statusText = "Username or password is incorrect.";
        });
        eventBus.$on("signUpCallback", err => {
            this.isRequesting = false;

            if (err) {
                this.isError = true;
                if (err === "username") this.statusText = "Username already used.";
                else if (err === "email") this.statusText = "Email already used.";
            }
            else {
                this.isError = false;
                this.mode = "SIGNIN";
                this.statusText = "New account was successfully created.";

                // reset form
                this.newFullname = "";
                this.newUsername = "";
                this.newPassword = "";
                this.newEmail = "";
                this.newLayout = "CMU";
            }
        });
        eventBus.$on("signOut", () => {
            this.showModule = true;
        });
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.form-container {
    display: flex;

    min-height: 100vh;
    min-width: 100%;
}

.form-header {
    font-size: xx-large;
    text-align: center;
    font-weight: bold;
}

.h-desc {
    text-align: center;
    font-size: small;
    margin-bottom: 24px;
}

form {
    display: flex;
    margin: auto;

    max-width: 500px;
    padding: var(--app-padding);
    background-color: var(--bg-theme-color);
    box-shadow: var(--std-container-shadow);
}

input[type=text], input[type=password], input[type=email] {
    width: calc(100% - var(--app-padding) * 2);
    padding: 8px 16px;
    margin: 4px 0;
    font-family: var(--std-font-family);
    border: 1px solid var(--dark-border-color);
    border-radius: 50px;
    transition: var(--std-transition-time);
}

input[type=text]:focus, input[type=password]:focus, input[type=email]:focus {
    box-shadow: 0 0 4px var(--sub-theme-color);
    border-color: var(--sub-theme-color);
}

.form-options {
    display: grid;
    grid-template-columns: repeat(2, 1fr);

    font-size: small;
}

.form-options span {
    cursor: pointer;
    transition: var(--std-transition-time);
}

.form-options span:hover {
    color: var(--sub-theme-color);
}

.form-options > :last-child {
    text-align: right;
}

input[type=submit] {
    width: 100%;
    padding: 8px 0;
    margin-top: 12px;
    background-color: white;
    font-family: var(--std-font-family);
    border: 1px solid var(--dark-border-color);
    border-radius: 50px;
    text-align: center;
    cursor: pointer;
    transition: var(--std-transition-time);
}

input[type=submit]:hover {
    background-color: var(--sub-theme-color);
}

.freeze {
    pointer-events: none;
}

.error {
    color: red;
}

.status-text {
    text-align: center;
    font-size: small;
}

</style>
