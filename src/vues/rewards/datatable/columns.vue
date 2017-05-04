<template>
    <div id="table-head">
        <div v-for="(column, idx) in columns" @click="Sort(idx)">{{ column.column }}&nbsp;&nbsp;<i class="fa" :class="column.sortClass"></i></div>
    </div>
</template>

<script>

    export default {
        name: 'tableColumns',
        props: ['columns'],
        methods: {
            Sort: function (idx) {
                Events.$emit('sort-ev', idx);
            }
        }
    }
</script>

<style lang="less">
    #table-head {
        width: 100%;
        height: 27px;
        color: white;
        background-color: #F9A153;
        padding: 4px;
        margin-top: 10px;
        box-shadow: 1px 1px 1px #e5e5e5;

        div {
            float: left;
            font-size: 1.20rem !important;
            font-weight: 600;
        }

        div:nth-child(1) {width: 20%; text-align: center;}
        div:nth-child(2) {width: 20%; text-align: center;}
        div:nth-child(3) {width: 30%; text-align: center;}
        div:nth-child(4) {width: 30%; text-align: center;}
    }
</style>