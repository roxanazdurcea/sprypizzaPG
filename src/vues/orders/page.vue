<template>
    <f7-page>
        <!-- Material Theme Navbar -->
        <f7-navbar>
            <f7-nav-center sliding>My Orders</f7-nav-center>
            <login-icon></login-icon>
        </f7-navbar>
        <f7-block inner>
            <section style="padding: 10px;">
                <div id="orders-container">
                    <table-rows v-bind:rows="tableData"></table-rows>
                    <table-pagination v-bind:page="page" v-bind:total="total" v-bind:filtered="filtered"></table-pagination>
                </div>
            </section>
        </f7-block>

        <!-- Bottom Tabbar-->
        <div class="toolbar tabbar tabbar-labels toolbar-bottom">
            <div class="toolbar-inner bottom-padding">
                <a href="/" class="item-link"><i class="f7-icons">home</i><span class="tabbar-label">Home</span></a>
                <a href="/menu/" class="item-link"><i class="f7-icons">favorites</i><span class="tabbar-label">Menu</span></a>
                <a href="/cart/" class="item-link"><i class="f7-icons">bag</i><span class="tabbar-label">Cart</span><item-count></item-count></a>
                <a href="/track-order/" class="item-link"><i class="f7-icons">navigation_fill</i><span class="tabbar-label">Track</span></a>
            </div>
        </div>

    </f7-page>
</template>

<script>
    import tableRows from "./rows.vue";
    import tablePagination from "./pagination.vue";
    import loginIcon from "../login/pageIcon.vue";
    import itemCount from "../cart/item-count.vue";
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
            tableRows,
            loginIcon,
            itemCount
        }
    }
</script>