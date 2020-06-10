<template>
    <div>
        <div class="study-header">
            <aside class="time-corner">D\T</aside>
            <aside class="time-scale-table" :style="{ gridTemplateColumns: `repeat(${time.length}, 1fr)` }">
                <aside v-for="i in time" :key="i">{{ i }}</aside>
            </aside>
        </div>
        <div class="day-bar"></div>
        <div v-for="day in date" :key="day" class="day-line" :class="{ empty: CheckEmptyDay(day), intersected: CheckIntersection(day) }">
            <aside>{{ day }}.</aside>
            <aside class="day-track" :style="{ gridTemplateColumns: `repeat(${time.length * trackScale}, 1fr)` }">
                <div
                class="subject-duration"
                v-for="(callback, id) in QueryDay(day)"
                :key="id"
                :style="{ gridColumn: callback.start + '/' + callback.end, backgroundColor: callback.color }"
                @mouseenter="FocusSubject(id)"
                @mouseleave="BlurSubject"
                >{{ id }}
                </div>
            </aside>
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
            trackScale: 6,
            date: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
            time: ["7AM", "8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM"]
        };
    },
    methods: {
        CheckEmptyDay(day) {
            for (const s of this.viewedSemesterLists) {
                for (const sday in s.time) {
                    if (sday === day) return false;
                }
            }

            return true;
        },
        CheckIntersection(day) {
            const dayCourses = [], collectedIntersectedCourses = [];
            
            // gathering all courses of the day
            for (const s of this.viewedSemesterLists) {
                for (const sday in s.time) {
                    if (sday === day) {
                        let [start, end] = s.time[day].replace(/ /g, "").split("-");

                        // checking for intersecting course
                        for (const course of dayCourses) {
                            if (start < course.end && end > course.start) {
                                if (!collectedIntersectedCourses.includes(s.id)) collectedIntersectedCourses.push(s.id);
                                if (!collectedIntersectedCourses.includes(course.id)) collectedIntersectedCourses.push(course.id);
                            }
                        }

                        dayCourses.push({id: s.id, start: +start, end: +end});
                    }
                }
            }

            // finishing
            if (collectedIntersectedCourses.length) {
                eventBus.$emit("updateIntersection", [...collectedIntersectedCourses]);

                return true;
            }
            else {
                return false;
            }
        },
        QueryDay(day) {
            const res = {};
            for (const s of this.viewedSemesterLists) {
                for (const sday in s.time) {
                    if (sday === day) {
                        let startCol = 1, endCol = 1;
                        const [startTime, endTime] = s.time[day].split("-");

                        startCol += +startTime.split(".")[1] * this.trackScale / 60;
                        endCol += +endTime.split(".")[1] * this.trackScale / 60;

                        startCol += (+startTime.split(".")[0] - 7) * this.trackScale;
                        endCol += (+endTime.split(".")[0] - 7) * this.trackScale;

                        res[s.id] = {
                            "start": parseInt(startCol),
                            "end": parseInt(endCol),
                            "color": s.color
                        };
                    }
                }
            }

            return res;
        },
        FocusSubject(courseId) {
            eventBus.$emit("focusCourse", courseId);
        },
        BlurSubject() {
            eventBus.$emit("focusCourse", null);
        }
    },
    created() {
        eventBus.$on("selectCourse", data => {
            console.log(data)
        });
    }
}
</script>

<style>

/* TIME HEADER */
.study-header {
    display: grid;
    grid-template-columns: 38px 1fr;
}

.time-corner {
    border-left: 1px solid var(--dark-border-color);
    text-align: center;
    font-size: small;
    font-weight: bold;
    font-family: var(--std-monospace);
}

.time-scale-table {
    display: grid;
}

.time-scale-table > aside {
    text-align: center;
    font-family: var(--std-monospace);
    font-size: small;
    border-right: 1px solid #758184;
    border-collapse: collapse;
}

.time-scale-table > aside:first-child {
    border-left: 1px solid #758184;
}

/* DAY BAR */
.day-bar {
    height: 12px;
    background: linear-gradient(to right,#616895 0%, #FFC725 38%, #616895 90%);
}

.day-line {
    display: grid;
    grid-template-columns: 38px 1fr;

    font-size: small;
    padding: 6px 0;
    border-top: 1px solid var(--dark-border-color);
}

.day-line > aside:first-child {
    display: inline;
    text-align: center;
    border-right: 1px dashed var(--dark-border-color);
    font-family: var(--std-monospace);
}

.day-track {
    display: grid;
    grid-auto-flow: column;
}

.subject-duration {
    grid-row: 1/2;
    border-radius: 4px;
    font-size: small;
    text-align: center;
    border: 2px solid rgba(0,0,0,0.2);
    transition: opacity 0.3s;
}

.subject-duration:hover {
    opacity: 0.8;
}

.intersected {
    background-color: var(--error-color);
}

.empty {
    background-color: var(--table-hover-color);
}

.empty > aside:first-child {
    filter: grayscale(1);
}

.day-line:nth-child(3) > aside:first-child { background-color: rgba(252, 247, 186, 0.8); }
.day-line:nth-child(4) > aside:first-child { background-color: rgba(253, 226, 226, 0.8); }
.day-line:nth-child(5) > aside:first-child { background-color: rgba(168, 230, 207, 0.8); }
.day-line:nth-child(6) > aside:first-child { background-color: rgba(255, 211, 182, 0.8); }
.day-line:nth-child(7) > aside:first-child { background-color: rgba(214, 229, 250, 0.8); }
.day-line:nth-child(8) > aside:first-child { background-color: rgba(220, 214, 247, 0.8); }
.day-line:nth-child(9) > aside:first-child { background-color: rgba(230, 178, 198, 0.8); }

</style>