<template>
    <div>
        <table>
            <thead>
                <tr>
                    <th>No.</th>
                    <th class="t-id">Course ID</th>
                    <th>Course Title</th>
                    <th class="t-section">Section Lec/Lab</th>
                    <th class="t-credit">Credit Lec/Lab</th>
                    <th>Time</th>
                </tr>
            </thead>
            <tbody>
                <!-- DATA ROW -->
                <tr
                v-for="(course, index) in viewedSemesterLists"
                :key="index"
                :class="{ focused: focusedCourse === course.id, selected: selCourse === course.id, intersected: intersectedCourses.includes(course.id) }"
                @click="SelectCourse(course.id)">
                    <td>
                        <label :for="course.id" class="list-color" :style="{ backgroundColor: course.color }">{{ index + 1 }}</label>
                        <input :id="course.id" v-model="course.color" type="color" hidden>
                    </td>
                    <td class="td-id">{{ course.id }}</td>
                    <td class="td-title">{{ course.title }}</td>
                    <td class="td-sec">
                        <div>
                            <aside contenteditable="true">{{ course.sec.split("/")[0] }}</aside>
                            <aside contenteditable="true">{{ course.sec.split("/")[1] }}</aside>
                        </div>
                    </td>
                    <td class="td-cre">
                        <div>
                            <aside contenteditable="true">{{ course.cre.split("/")[0] }}</aside>
                            <aside contenteditable="true">{{ course.cre.split("/")[1] }}</aside>
                        </div>
                    </td>
                    <td class="td-time">
                        <div>
                            <template v-for="(time, day) in course.time">
                                <aside :key="day+time">
                                    <span :class="day.toLowerCase()">{{ day }}.</span>
                                </aside>
                                <aside :key="time+day">
                                    <span contenteditable="true" @blur="ChangeTime">{{ time.split("-")[0] }}</span>
                                    <span>-</span>
                                    <span contenteditable="true" @blur="ChangeTime">{{ time.split("-")[1] }}</span>
                                </aside>
                            </template>
                        </div>
                    </td>
                </tr>
                <!-- ADDING ROW -->
                <tr id="add-list-row">
                    <td>
                        <label for="new-color" id="add-list-color" :style="{ backgroundColor: newColor }" class="list-color">+</label>
                        <input id="new-color" type="color" v-model="newColor" hidden>
                    </td>
                    <td id="input-id" contenteditable="true" @keypress.enter.prevent="FocusNextInput"></td>
                    <td id="input-title" class="td-title" contenteditable="true" @keypress.enter.prevent="FocusNextInput"></td>
                    <td id="input-sec" contenteditable="true" @keypress.enter.prevent="FocusNextInput"></td>
                    <td id="input-cre" contenteditable="true" @keypress.enter.prevent="FocusNextInput"></td>
                    <td id="input-time" contenteditable="true" @keypress.enter.prevent="CraeteNewList"></td>
                </tr>
            </tbody>
        </table>
        <div id="add-list-button">
            <i class="fas fa-trash" :class="{ active: selCourse }" @click="ActiveTool('delete')"></i>
            <i class="fas fa-chevron-circle-up" :class="{ active: selCourse }" @click="ActiveTool('moveup')"></i>
            <i class="fas fa-chevron-circle-down" :class="{ active: selCourse }" @click="ActiveTool('movedown')"></i>
            <div @click="CraeteNewList">ADD</div>
        </div>
    </div>
</template>

<script>
import { eventBus } from '../../main.js';
export default {
    props: {
        viewedSemesterLists: Array
    },
    data() {
        return {
            newColor: "",
            intersectedCourses: [],
            selCourse: null,
            focusedCourse: null
        }
    },
    methods: {
        FocusNextInput(e) {
            e.target.nextElementSibling.focus();
        },
        SelectCourse(courseId) {
            // find element
            this.selCourse = this.selCourse === courseId ? null : courseId;
        },
        ChangeTime(e) {
            console.log(e.target.textContent);
        },
        ActiveTool(command) {
            if (!this.selCourse) return;

            for (let i = 0; i < this.viewedSemesterLists.length; i++) {
                if (this.selCourse === this.viewedSemesterLists[i].id) {
                    eventBus.$emit("updateCourse", command, i);

                    if (command === "delete") this.SelectCourse(this.selCourse);
                    return;
                }
            }
        },
        CraeteNewList() {
            const newCourseInput = [
                document.getElementById("input-id"),
                document.getElementById("input-title"),
                document.getElementById("input-sec"),
                document.getElementById("input-cre"),
                document.getElementById("input-time")
            ];

            for (const input of newCourseInput) input.blur();

            const inputTime = document.getElementById("input-time").textContent.replace(/ /g, "");
            const newCourse = {
                "color": this.newColor,
                "id": document.getElementById("input-id").textContent,
                "title": document.getElementById("input-title").textContent,
                "sec": document.getElementById("input-sec").textContent,
                "cre": document.getElementById("input-cre").textContent,
                "time": {},
                "exam": {},
                "todo": {}
            }

            // check if any has empty input
            for (const input of newCourseInput) {
                if (!input.textContent) {
                    input.style.borderBottom = "2px solid red";

                    setTimeout(() => {
                        input.style.borderBottom = null;
                    }, 2000);
                    return;
                }
            }

            // format time
            for (const day of inputTime.split(",")) newCourse.time[day.slice(0, 3).toLowerCase()] = day.slice(3);

            // clear input
            this.newColor = "";
            for (const input of newCourseInput) input.textContent = "";

            eventBus.$emit("updateCourse", "new", newCourse);
        }
    },
    created() {
        eventBus.$on("focusCourse", data => this.focusedCourse = data ? data : null);
        eventBus.$on("updateIntersection", courses => this.intersectedCourses = courses);
    }
}
</script>

<style scoped>

table tbody {
    font-family: var(--std-monospace);
}

table th:first-child,
table td:first-child {
    width: 36px;
    font-weight: bold;
}

table .t-id {
    width: 90px;
}

table .t-section,
table .t-credit {
    width: 72px;
}

table .td-title {
    text-align: left;
}

table .td-sec > div,
table .td-cre > div {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}

table .td-time > div {
    display: grid;
    grid-template-columns: 1fr 2fr;
}

table > tbody > tr:not(#add-list-row):hover {
    background-color: var(--table-hover-color);
}

table > tbody > tr.intersected:not(#add-list-row):hover {
    background-color: #CD6155;
}

/* ADDING LIST SECTION */

#add-list-row > td {
    transition: border-bottom 0.1s;
}

#add-list-color {
    transition: var(--std-transition-time);
}

#add-list-color:hover {
    opacity: 0.8;
}

#input-id[contenteditable=true]:empty:not(:focus):before {
    content: "XXXXXX";
    color: lightgray;
    pointer-events: none;
}

#input-title[contenteditable=true]:empty:not(:focus):before {
    content: "Course Title";
    color: lightgray;
    pointer-events: none
}

#input-sec[contenteditable=true]:empty:not(:focus):before,
#input-cre[contenteditable=true]:empty:not(:focus):before {
    content: "003/-";
    color: lightgray;
    pointer-events: none
}

#input-time[contenteditable=true]:empty:not(:focus):before {
    content: "EX. Mon 8.00-9.30, ...";
    color: lightgray;
    pointer-events: none
}

#add-list-button {
    display: grid;
    grid-template-columns: repeat(3, 1fr) 16fr;
    overflow: hidden;

    text-align: center;
    margin: 12px 0;
    border: 1px solid var(--dark-border-color);
    border-radius: 50px;
    transition: var(--std-transition-time);
}

#add-list-button > :not(:last-child) {
    align-self: center;
    border-right: 1px solid var(--dark-border-color);
    transition: var(--std-transition-time);
    color: rgba(0,0,0,0.5);
    pointer-events: none;
}

#add-list-button > .active:not(:last-child) {
    align-self: center;
    color: rgba(0,0,0,1);
    pointer-events: auto;
    cursor: pointer;
}

#add-list-button > .active:not(:last-child):hover {
    color: var(--sub-theme-color);
}

#add-list-button > :last-child:hover {
    cursor: pointer;
    background-color: var(--sub-theme-color);
}

/* CLASSES */

.selected > td:first-child > div {
    border-color: var(--selected-color);
    box-shadow: 0 0 3px rgba(0,0,0,0.5);
}

.intersected {
    background-color: var(--error-color);
}

.focused {
    background-color: var(--table-hover-color);
}

.list-color {
    display: block;
    margin: 0 auto;
    border-radius: 50%;
    border: 2px solid white;
    width: 25px;
    transition: var(--std-transition-time);
    cursor: pointer;
}

span.mon { background-color: rgba(252, 247, 186, 0.8); }
span.tue { background-color: rgba(253, 226, 226, 0.8); }
span.wed { background-color: rgba(168, 230, 207, 0.8); }
span.thu { background-color: rgba(255, 211, 182, 0.8); }
span.fri { background-color: rgba(214, 229, 250, 0.8); }
span.sat { background-color: rgba(220, 214, 247, 0.8); }
span.sun { background-color: rgba(230, 178, 198, 0.8); }

</style>