<template>
    <div id="table-head">
        <div v-for="(column, idx) in columns" @click="Sort(idx)"><p>{{ column.column }}&nbsp;&nbsp;</p><i class="fa" :class="column.sortClass"></i></div>
    </div>
</template>

<script>

    export default {
        name: 'rewardColumns',
        props: ['columns'],
        methods: {
            Sort: function (idx) {
                Events.$emit('sort-ev', idx);
            }
        }
    }
</script>

<style lang="less" scoped>
    #table-head {
        width: 100%;
        height: 27px;
        color: white;
        background-color: #F9A153;
        padding: 4px;
        margin-top: 10px;
        box-shadow: 1px 1px 1px #e5e5e5;
    }

    #table-head div {
        float: left;
        font-weight: 600;
    }

    p {
        margin: 0px;
        color: #fff;
    }

    #table-head div:nth-child(1) {
        width: 20%;
        text-align: center;
    }

    #table-head div:nth-child(2) {
        width: 20%;
        text-align: center;
    }

    #table-head div:nth-child(3) {
        width: 30%;
        text-align: center;
    }

    #table-head div:nth-child(4) {
        width: 30%;
        text-align: center;
    }

</style>