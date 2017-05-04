<template>
    <div id="table-rows">
        <table class="table" style="width: 100%;">
            <tbody>
            <tr v-for="(row, idx) in formattedRows">
                <div class="tr-reward" style=" display: table; width: 100%; border-top: 1px solid #ffe4b2;">
                    <div><p>{{ row.order_id }}</p></div>
                    <div><p>{{ row.points }}</p></div>
                    <div><p>{{ row.created_at }}</p></div>
                    <div><p>{{ row.validity }}</p></div>
                </div>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import moment from 'moment';

    export default {
        name: 'rewardsRows',
        props: ['rows', 'expiry'],
        computed: {
            formattedRows: function () {
                return this.rows.map(function (row) {
                    return {
                        order_id: row.order_id,
                        points: row.points,
                        created_at: moment(row.created_at, 'YYYY-MM-DD HH:mm:ss').format('MMMM Do YYYY'),
                        validity: moment(row.created_at, 'YYYY-MM-DD HH:mm:ss').add(this.expiry, 'days').fromNow()
                    };
                }.bind(this));
            }
        }
    }
</script>

<style lang="less" scoped>
    #table-rows {
        width: 100%;
        overflow-y: auto;
    }
    p {
        margin: 0.5em 0;
        font-size: 0.8rem;
    }
    /*#table-rows div {*/
    /*font-size: 1.2rem !important;*/
    /*padding: 4px;*/
    /*}*/

    #table-rows .tr-reward div:nth-child(1) {
        width: 20%;
        text-align: center;
        display: table-cell;
    }

    #table-rows .tr-reward div:nth-child(2) {
        width: 20%;
        text-align: center;
        display: table-cell;
    }

    #table-rows .tr-reward div:nth-child(3) {
        width: 30%;
        text-align: center;
        display: table-cell;
    }

    #table-rows .tr-reward div:nth-child(4) {
        width: 30%;
        text-align: center;
        display: table-cell;
    }


</style>