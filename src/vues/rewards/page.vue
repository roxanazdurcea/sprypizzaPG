<template>
    <f7-page>
        <!-- Material Theme Navbar -->
        <f7-navbar>
            <f7-nav-center sliding>My Rewords</f7-nav-center>
            <login-icon></login-icon>
        </f7-navbar>
        <f7-block inner>
            <section style="padding: 10px;">
                <div id="rewards-container">
                    <h1 style="margin-bottom: 0px;">Your Total Rewards</h1>
                    <p style="margin-top: 0px;">You earned  {{ totalPoints }} points</p>
                    <!-- Nav tabs -->
                    <div>
                        <rewards-columns v-bind:columns="tableColumns"></rewards-columns>
                        <rewards-rows v-bind:rows="tableData" v-bind:expiry="pointsExpiry"></rewards-rows>
                        <rewards-pagination v-bind:page="page" v-bind:total="total" v-bind:filtered="filtered"></rewards-pagination>
                    </div>
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
    import rewardsRows from "./datatable/rows.vue";
    import rewardsPagination from "./datatable/pagination.vue";
    import rewardsColumns from "./datatable/columns.vue";
    import loginIcon from "../login/pageIcon.vue";
    import itemCount from "../cart/item-count.vue";
    export default {
        name: 'pageRewards',
        data() {
            return {
                rawData: [],
                settings: [],
                sortBy: 'id',
                sort: 'desc',
                draw: 1,
                page: 10,
                total: '',
                filtered: '',
                excludeColumns: ['id', 'contact_id', 'updated_at'],
                addColumns: ['expiry'],
            }
        },
        computed: {
            tableColumns: function() {
                var response = this.rawData;
                //Table columns
                var returnedKeys = [], idx = 0;
                //data keys
                var keys = _.keys(_.first(response));
                //excluded keys
                var excludeColumns = this.excludeColumns;
                keys.forEach(function(ele) {
                    if (excludeColumns.indexOf(ele) < 0) {
                        var key = this.StrAdj(ele);
                        returnedKeys[idx] = {
                            'column': key,
                            'sort': (key !== this.sortBy) ? "none" : this.sort,
                            'sortClass': (key !== this.sortBy) ? "fa-sort" : "fa-sort-" + this.sort
                        };
                        idx++;
                    }
                }.bind(this));
                //additional keys
                for (var i = 0; i < this.addColumns.length; i++) {
                    returnedKeys[idx] = {
                        'column': this.StrAdj(this.addColumns[i]),
                        'sort': "none",
                        'sortClass': "fa-sort"
                    };
                    idx++;
                }

                return returnedKeys;
            },
            tableData: function() {
                return this.rawData;
            },
            totalPoints: function() {
                var total = 0;
                this.rawData.forEach(function(obj) {
                    total += parseFloat(obj.points);
                });

                return total;
            },
            pointsExpiry: function() {
                return this.settings.expiry;
            },
            contact_id() {
                return Store.state.contact_id;
            },
            company_id() {
                return Store.state.company_id;
            }
        },
        methods: {
            List: function() {
                axios.post('https://sprypizza.com/api/rewards/list', {
                    contact_id: this.contact_id,
                    draw: this.draw,
                    page: this.page,
                    sortBy: this.sortBy,
                    sort: this.sort
                }).then(function(json) {

                    var response = json.data.response;
                    this.total = response.total;
                    this.filtered = response.filtered;
                    this.rawData = response.rewards;
                }.bind(this));
            },
            Settings: function() {
                axios.post('https://sprypizza.com/api/rewards/settings', {
                    company_id: this.company_id
                }).then(function(json) {
                    this.settings = json.data.response
                }.bind(this));
            },
            Sort: function(idx) {

                var columns = this.tableColumns;
                var sort = columns[idx]['sort'];
                var column = columns[idx]['column'];

                switch (sort) {
                    case "none":
                        sort = "asc";
                        break;
                    case "asc":
                        sort = "desc";
                        break;
                    case "desc":
                        sort = "asc";
                        break;
                }

                //Assign to store
                this.sort = sort;
                this.sortBy = column;
                //Refresh data
                this.List();
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
            this.Settings();

            Events.$on('sort-ev', function(idx) {
                this.Sort(idx);
            }.bind(this));

            Events.$on('setPage-ev', function(draw) {
                this.draw = draw;
                this.List();
            }.bind(this));
        },
        components: {
            rewardsPagination,
            rewardsRows,
            rewardsColumns,
            loginIcon,
            itemCount
        }
    }
</script>