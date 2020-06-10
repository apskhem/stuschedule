<template>
    <div class="content-container" v-if="showModule">
        <UserHeader :semesters="semesterLists" :selSemester="selSemester" :userData="userSettings"/>
        <template v-if="menu === 'STARTER'">
            <div class="starter-container">
                <label for="first-semester">Let's begin using StuSchedul</label>
                <input type="text" id="username" name="first-semester" placeholder="Enter your first semester." v-model="newSemester" @keypress.enter="EnterFirstSemester">
            </div>
        </template>
        <template v-else-if="menu === 'SETTING'">

        </template>
        <template v-else-if="menu === 'NORMAL'">
            <StudyingTable :viewedSemesterLists="semesterLists[selSemester]"/>
            <StudyingSchedule :viewedSemesterLists="semesterLists[selSemester]"/>
            <ExamTable :viewedSemesterLists="semesterLists[selSemester]"/>
            <ExamSchedule :viewedSemesterLists="semesterLists[selSemester]"/>
            <AssignmentTable :viewedSemesterLists="semesterLists[selSemester]"/>
        </template>
    </div>
</template>

<script>
import { eventBus, db } from '../main.js';
import UserHeader from "./content-modules/UserHeader.vue";
import StudyingTable from "./content-modules/StudyingTable.vue";
import StudyingSchedule from "./content-modules/StudyingSchedule.vue";
import ExamTable from "./content-modules/ExamTable.vue";
import ExamSchedule from "./content-modules/ExamSchedule.vue";
import AssignmentTable from "./content-modules/AssignmentTable.vue";

export default {
    components: {
        UserHeader,
        StudyingTable,
        StudyingSchedule,
        ExamTable,
        ExamSchedule,
        AssignmentTable
    },
    data() {
        return {
            newSemester: "",

            menu: "STARTER",
            showModule: false,

            userSettings: {},
            userMeta: {},
            semesterLists: {},

            selSemester: ""
        }
    },
    methods: {
        EnterFirstSemester() {
            this.menu = "NORMAL";
            this.semesterLists[this.newSemester] = [];
            this.selSemester = this.newSemester;

            db.Request("UPDATE_DATA", {
                username: this.userMeta.username,
                userData: JSON.stringify(this.semesterLists)
            });
        }
    },
    watch: {
        selSemester(val) {
            console.log(val);
        }
    },
    created() {
        eventBus.$on("navigateToContents", (userSettings, userData, userMeta)  => {
            this.semesterLists = userData;
            this.userMeta = userMeta;
            this.userSettings = userSettings;
            this.showModule = true;

            // init menu
            if (Object.keys(userData).length) {
                this.menu = "NORMAL";
                this.selSemester = Object.keys(userData)[0];
            }
        });
        eventBus.$on("selectSemester", semester => {
            this.selSemester = semester;
        });
        eventBus.$on("updateCourse", (command, params) => {
            const list = this.semesterLists[this.selSemester];

            // find course if has
            let coursePointer = null;
            if (params.course) {
                for (const course of list) {
                    if (course.id === params.course) {
                        coursePointer = course;
                        break;
                    }
                }
            }

            switch (command) {
                case "new-semester": {
                    this.semesterLists[params] = [];
                } break;
                case "delete": {
                    list.splice(params, 1);
                } break;
                case "moveup": {
                    if (!params) return;
                    list.splice(params-1, 2, list[params], list[params-1]);
                } break;
                case "movedown": {
                    if (params >= list.length - 1) return;
                    list.splice(params, 2, list[params+1], list[params]);
                } break;
                case "new": {
                    list.push(params);
                } break;
                case "exam": {
                    if (params.type !== "other") {
                        coursePointer.exam[params.type] = params.date;
                    }
                    else {
                        coursePointer.exam[params.type]
                    }
                } break;
                case "todo": {
                    console.log("test");
                } break;
            }

            db.Request("UPDATE_DATA", {
                username: this.userMeta.username,
                userData: JSON.stringify(this.semesterLists)
            });
        });
        eventBus.$on("signOut", () => {
            this.newSemester = "";

            this.menu = "STARTER";
            this.showModule = false;

            this.userSettings = {};
            this.userMeta = {};
            this.semesterLists = {};

            this.selSemester = "";
        });
    }
}
</script>

<style scoped>

.content-container {
    max-width: 800px;
    margin: 8px auto;
    padding: 8px;
    box-shadow: var(--std-container-shadow);
    background-color: var(--bg-theme-color);
}

.content-container > *:not(:first-child) {
    margin: 16px 0;
}

.starter-container {
    padding: 24px;
    background-color: var(--table-hover-color);
}

label[for="first-semester"] {
    text-align: center;
    font-size: xx-large;
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

</style>