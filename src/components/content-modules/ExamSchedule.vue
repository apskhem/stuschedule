<template>
  <div>
        <div class="exam-header">
            <aside class="time-corner">D/T</aside>
            <aside class="time-scale-table" :style="{ gridTemplateColumns: `repeat(${time.length}, 1fr)` }">
                <aside v-for="i in time" :key="i">{{ i }}</aside>
            </aside>
        </div>
        <div class="day-bar"></div>
        <div v-if="Object.keys(QueryExamDate()).length">
            <div v-for="(examTimes, date) in QueryExamDate()" :key="date" class="exam-line">
                <aside>{{ date }}</aside>
                <aside class="exam-track" :style="{ gridTemplateColumns: `repeat(${time.length * trackScale}, 1fr)` }">
                    <div
                    class="subject-duration"
                    v-for="(data, index) in examTimes"
                    :key="index"
                    :style="{ gridColumn: data.start + '/' + data.end, backgroundColor: data.color }"
                    >{{ data.id }}
                    </div>
                </aside>
            </div>
        </div>
        <div v-else class="no-course">No course added to view examination schedule.</div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            trackScale: 6,
            time: ["7AM", "8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM"]
        };
    },
    props: {
        viewedSemesterLists: Array
    },
    methods: {
        QueryExamDate() {
            const data = {};
            for (const course of this.viewedSemesterLists) {
                for (const examType in course.exam) {
                    if (examType === "other") {
                        for (const otherTime of course.exam.other) {
                            this.PushData(data, course, ...otherTime.split(","));
                        }
                    }
                    else {
                        this.PushData(data, course, ...course.exam[examType].split(","));
                    }
                }
            }

            return data;
        },
        PushData(data, course, date, time) {
            // format number
            let startCol = 1, endCol = 1;
            const [startTime, endTime] = time.split("-");

            startCol += +startTime.split(".")[1] * this.trackScale / 60;
            endCol += +endTime.split(".")[1] * this.trackScale / 60;

            startCol += (+startTime.split(".")[0] - 7) * this.trackScale;
            endCol += (+endTime.split(".")[0] - 7) * this.trackScale;

            // date is not existed, create it
            if (!data[date]) data[date] = [];

            data[date].push({
                id: course.id,
                start: parseInt(startCol),
                end: parseInt(endCol),
                color: course.color
            });
        }
    },
}
</script>

<style>

.exam-header {
    display: grid;
    grid-template-columns: 86px 1fr;
}

.no-course {
    padding: 4px 0;
    text-align: center;
    background-color: var(--table-hover-color);
}

.exam-line {
    display: grid;
    grid-template-columns: 86px 1fr;

    font-size: small;
    padding: 6px 0;
    border-top: 1px solid var(--dark-border-color);
}

.exam-line > aside:first-child {
    display: inline;
    text-align: center;
    border-right: 1px dashed var(--dark-border-color);
    font-family: var(--std-monospace);
}

.exam-track {
    display: grid;
    grid-auto-flow: column;
}

</style>