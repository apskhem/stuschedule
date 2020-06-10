<template>
    <div>
        <div id="user-header">
            <aside>
                <i class="fas fa-user-circle" id="user-icon"></i>
                <span>{{ userData.fullname | UserFilter}}</span>
            </aside>
            <aside class="app-layout-label">
                <span>Layout for: {{ userData.layout }}</span>
                <i class="fas fa-cog"></i>
                <i class="fas fa-sign-out-alt" @click="SingOut"></i>
            </aside>
        </div>
        <div v-if="Object.keys(semesters).length" id="semester-container">
            <aside
            v-for="(data, index) in semesters"
            :key="index"
            :class="{ 'sel-semester': selSemester === index }"
            @click="SelectSemester(index)"
            >{{ index }}
            </aside>
            <aside v-if="showSemesterInput" id="new-semester-input" @blur="CreateSemester" contenteditable="true"></aside>
            <aside @click="showSemesterInput = !showSemesterInput;">+</aside>
        </div>
    </div>
</template>

<script>
import { eventBus } from '../../main.js';
export default {
    props: {
        semesters: Object,
        selSemester: String,
        userData: Object
    },
    data() {
        return {
            showSemesterInput: false,
        };
    },
    methods: {
        SingOut() {
            eventBus.$emit("signOut");
        },
        SelectSemester(value) {
            eventBus.$emit("selectSemester", value);
        },
        CreateSemester(e) {
            const value = e.target.textContent;

            this.showSemesterInput = false;

            eventBus.$emit("updateCourse", "new-semester", value);
        }
    },
    filters: {
        UserFilter(value) {
            return !value ? "$USERDATA.NAME" : value;
        }
    }
}
</script>

<style scoped>

/* USER HEADRE SECTION */
#user-header {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}

.app-layout-label {
    text-align: right;
}

i {
    cursor: pointer;
    padding: 0 4px;
    transition: var(--std-transition-time);
}

i:hover {
    color: var(--sub-theme-color)
}

/* SEMESTER CONTAINER SECTION */
#semester-container {
    display: flex;
    flex-wrap: wrap;
}

#semester-container > aside {
    display: inline;
    padding: 2px 6px;
    border: 1px solid var(--dark-border-color);
    border-right: 0;
    cursor: pointer;
    transition: var(--std-transition-time);
}

#semester-container > aside:first-child {
    border-radius: 4px 0 0 4px;
    border: 1px solid var(--dark-border-color);
    border-right: 0;
}

#semester-container > aside:last-child {
    border-radius: 0 4px 4px 0;
    border: 1px solid var(--dark-border-color);
}
#semester-container > aside:not(#new-semester-input):hover {
    background-color: var(--sub-theme-color);
}

#new-semester-input {
    overflow: hidden;
    word-wrap: unset;
    width: 48px;
}

.sel-semester {
    background-color: var(--sub-theme-color);
}

</style>