<template>
    <div>
        <table>
            <thead>
                <th class="t-id">Course Id</th>
                <th>Assignments</th>
                <th class="t-due-date">Due Date</th>
            </thead>
            <tbody>
                <tr v-for="(list, index) in viewedSemesterLists" :key="index">
                    <td>{{ list.id }}</td>
                    <td>
                        <div v-if="!Object.keys(list.todo).length" class="no-assignment">No assignment for this course.</div>
                        <div v-for="(todo, index) in list.todo" :key="index">
                            <input type="checkbox">
                            <div>{{ todo.name }}</div>
                        </div>
                    </td>
                    <td>
                        <div v-for="(todo, index) in list.todo" :key="index">{{ todo.dueDate }}</div>
                    </td>
                </tr>
            </tbody>
        </table>
        <select name="assignment-option" id="assignment-options" v-model="selOption">
            <option v-for="(list, index) in viewedSemesterLists" :key="index" :value="index">{{ list.id }}</option>
        </select>
    </div>
</template>

<script>
export default {
    props: {
        viewedSemesterLists: Array
    },
    data() {
        return {
            selOption: "",
        };
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

table .t-due-date {
    width: 160px;
}

.no-assignment {
    color: lightgray;
}

</style>