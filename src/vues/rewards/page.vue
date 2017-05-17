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
                <div class="center">My Rewards</div>
                <login-icon></login-icon>
            </div>
        </div>
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
    </f7-page>
</template>

<script>
    import rewardsRows from "./datatable/rows.vue";
    import rewardsPagination from "./datatable/pagination.vue";
    import rewardsColumns from "./datatable/columns.vue";
    import loginIcon from "../login/pageIcon.vue";
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
            loginIcon
        }
    }
</script>