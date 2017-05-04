<template>
    <div id="table-rows">
        <table class="table table-striped">
            <tbody>
                <tr v-for="(row, idx) in formattedRows">
                    <div class="tr-reward" style=" display: table; width: 100%; border-top: 1px solid #ffe4b2;">
                        <div>{{ row.order_id }}</div>
                        <div>{{ row.points }}</div>
                        <div>{{ row.created_at }}</div>
                        <div>{{ row.validity }}</div>
                    </div>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import moment from 'moment';

    export default {
        name: 'rewardsTableRows',
        props: ['rows','expiry'],
        computed: {
            formattedRows: function() {
                return this.rows.map(function(row){
                   return {
                        order_id: row.order_id,
                        points: row.points,
                        created_at: moment(row.created_at, 'YYYY-MM-DD HH:mm:ss').format('MMMM Do YYYY'),
                        validity: moment(row.created_at, 'YYYY-MM-DD HH:mm:ss').add(this.expiry,'days').fromNow()
                   };
                }.bind(this));
            }
        }
    }
</script>

<style lang="less">
    #table-rows {
        width: 100%;
        overflow-y: auto;

        div {
            font-size: 1.2rem !important;
            padding: 4px;
        }

        .tr-reward {
            div:nth-child(1) {width: 20%; text-align: center; display: table-cell;}
            div:nth-child(2) {width: 20%; text-align: center; display: table-cell;}
            div:nth-child(3) {width: 30%; text-align: center; display: table-cell;}
            div:nth-child(4) {width: 30%; text-align: center; display: table-cell;}
        }
    }
</style>