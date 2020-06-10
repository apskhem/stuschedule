<template>
    <div id="app">
        <LoginForm/>
        <Contents/>
    </div>
</template>

<script>
import LoginForm from './components/LoginForm.vue'
import Contents from './components/Contents.vue'
export default {
    name: 'App',
    components: {
        LoginForm,
        Contents
    }
}
</script>

<style>
:root {
    --body-bg-color: #29323C;
    --bg-theme-color: #F8F9F9;
    --sub-theme-color: #A3E4D7;
    --selected-color: #00abf5;
    --table-hover-color: #dddddd;
    --dark-border-color: #34495E;
    --error-color: #f99;
    --std-transition-time: 0.3s;
    --std-font-family: "Cabin";
    --std-monospace: "Fira Code", monospace;
    --std-container-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
    --app-padding: 16px;
}

html, body {
    font-family: var(--std-font-family);
	margin: 0;
	padding: 0 8px;
    line-height: 1.5;
    background-color: var(--body-bg-color);

    overflow-x: hidden;

	box-sizing: border-box;
	-ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
}

*:not(input) {
    user-select: none; /* supported by Chrome and Opera */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
}

a {
    text-decoration: none;
    color: black;
}

[hidden] { display: none; }

li { list-style-type: none; }

input:focus, button:focus { outline: none; }

input::-webkit-inner-spin-button { -webkit-appearance: none; }

h1, h2, h3, h4, h5, h6 { text-align: center; }

/* CUSTOMS FOR APP */

table {
    width: 100%;
    table-layout: fixed;
}

table, th, td {
    padding: 0 6px;
    text-align: center;
    border-right: 1px solid #758184;
    border-left: 1px solid #758184;
    border-collapse: collapse;
}

table > tbody > tr:not(#add-list-row):hover {
    background-color: var(--table-hover-color);
}

</style>
