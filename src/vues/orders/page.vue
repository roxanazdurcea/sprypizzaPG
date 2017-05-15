<template>
    <f7-page>
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left">
                    <a href="#" class="back link">
                        <i class="f7-icons size-22 left-side-icon">left</i>
                        <!-- Back link text rendered only for iOS theme -->
                        <span>Back</span>
                    </a>
                </div>
                <div class="center">My Orders</div>
                <div class="right">
                    <a href="#" class="open-panel" data-panel="left"><i class="f7-icons size-22">info</i></a>
                    <a href="/login/"><i class="f7-icons size-22">person</i></a>
                </div>
            </div>
        </div>
        <!--<f7-navbar title="My Orders" back-link="Back" sliding></f7-navbar>-->
        <f7-block inner>
            <section style="padding: 10px;">
                <div id="orders-container">
                    <table-rows v-bind:rows="tableData"></table-rows>
                    <table-pagination v-bind:page="page" v-bind:total="total" v-bind:filtered="filtered"></table-pagination>
                </div>
            </section>
        </f7-block>
    </f7-page>
</template>

<script>
    import tableRows from "./rows.vue";
    import tablePagination from "./pagination.vue";
    export default {
        name: 'pageOrders',
        data() {
            return {
                rawData: [],
                sortBy: 'id',
                sort: 'desc',
                draw: 1,
                page: 5,
                total: '',
                filtered: '',
                excludeColumns: ['items', 'showItems'],
                addColumns: ['action']
            }
        },
        computed: {
            tableData() {

                var response = this.rawData;

                response = _.map(response, function(obj, index) {
                    obj['lock'] = (index === this.lockIndex) ? this.lockValue : true;
                    return obj;
                }.bind(this));

                return response;
            },
            contact_id() {
                return Store.state.contact_id;
            }
        },
        methods: {
            List: function() {
                axios.post('https://sprypizza.com/api/orders/get', {
                    contact_id: this.contact_id,
                    draw: this.draw,
                    page: this.page,
                    sortBy: this.sortBy,
                    sort: this.sort
                }).then(function(json) {
                    var response = json.data.response;
                    this.total = response.total;
                    this.filtered = response.filtered;
                    this.rawData = _.map(response.orders, function(obj, index) {
                        obj['showItems'] = false;
                        return obj;
                    });
                }.bind(this));
            },
            StrAdj: function(str) {
                var string = str.replace(/\w\S*/g, function(txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
                return string.replace('_', ' ');
            }
        },
        mounted: function() {

            this.List();

            Events.$on('showItems-ev', function(idx) {
                this.tableData[idx]['showItems'] = (this.tableData[idx]['showItems'] === true) ? false : true;
            }.bind(this));

            Events.$on('sort-ev', function(idx) {
                this.Sort(idx);
            }.bind(this));

            Events.$on('setPage-ev', function(draw) {
                this.draw = draw;
                this.List();
            }.bind(this));

            Events.$on('tableRefresh-ev', function() {
                this.List();
            }.bind(this));
        },
        components: {
            tablePagination,
            tableRows
        }
    }
</script>