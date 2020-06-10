<template>
  <div>
      <table>
          <thead>
              <tr>
                  <th class="t-id">Course Id</th>
                  <th>Midterm</th>
                  <th>Final</th>
                  <th>Other</th>
              </tr>
          </thead>
          <tbody>
              <tr v-for="(list, index) in viewedSemesterLists" :key="index">
                  <td>{{ list.id }}</td>
                  <td>
                      <div contenteditable="true" @blur="UpdateValue" @keypress.enter.prevent="">{{ list.exam.mid }}</div>
                  </td>
                  <td>
                       <div contenteditable="true" @blur="UpdateValue" @keypress.enter.prevent="">{{ list.exam.final }}</div>
                  </td>
                  <td>
                       <div contenteditable="true" @blur="UpdateValue" @keypress.enter.prevent="">
                           <div v-for="otherTime of list.exam.other" :key="otherTime">{{ otherTime }}</div>
                       </div>
                  </td>
              </tr>
          </tbody>
      </table>
      <div v-if="!viewedSemesterLists.length" class="no-course">No course added to manipulate examination schedule.</div>
  </div>
</template>

<script>
import { eventBus } from '../../main';
export default {
    props: {
        viewedSemesterLists: Array
    },
    methods: {
        UpdateValue(e) {
            const value = e.target.textContent.replace(/ /g, "");
            const courseId = e.target.parentElement.parentElement.children[0].textContent;

            // syntax checking
            if (value.split(",").length !== 1) {
                return;
            }

            // processing
            let i = 0;
            let el = e.target;
            while (el) {
                el = el.previousElementSibling;
                i++;
            }

            let type = "";
            switch (i) {
                case 1: type = "mid"; break;
                case 2: type = "final"; break;
                case 3: type = "other"; break;
            }

            eventBus.$emit("updateCourse", "exam", { course: courseId, type: type, date: value });

            console.log(value, courseId, i);
        }
    }
}
</script>

<style scoped>

table > tbody {
    font-family: var(--std-monospace);
}

table .t-id {
    width: 90px;
}

table [contenteditable]:empty:not(:focus):before {
    content: "None";
    color: lightgray;
    pointer-events: none;
}

table [contenteditable] {
    font-size: small;
}

.no-course {
    padding: 4px 0;
    text-align: center;
    background-color: var(--table-hover-color);
}

</style>