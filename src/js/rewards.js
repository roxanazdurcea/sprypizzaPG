import tableColumns from "../../vues/rewards/datatable/columns.vue";
import tableRows from "../../vues/rewards/datatable/rows.vue";
import tablePagination from "../../vues/rewards/datatable/pagination.vue";

new Vue({
    el: '#rewards-container',
    http: {
        emulateJSON: true,
        emulateHTTP: true
    },
    data: {
        rawData: [],
        settings: [],
        sortBy: 'id',
        sort: 'desc',
        draw: 1,
        page: 10,
        total: '',
        filtered: '',
        excludeColumns: ['id','contact_id','updated_at'],
        addColumns: ['expiry'],
    },
    computed: {
        tableColumns: function () {
            var response = this.rawData;
            //Table columns
            var returnedKeys = [], idx = 0;
            //data keys
            var keys = _.keys(_.first(response));
            //excluded keys
            var excludeColumns = this.excludeColumns;
            keys.forEach(function (ele) {
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
        tableData: function () {
            return this.rawData;
        },
        totalPoints: function() {
            var total = 0;
            this.rawData.forEach(function(obj){
                total += parseFloat(obj.points);
            });

            return total;
        },
        pointsExpiry: function() {
            return this.settings.expiry;
        }
    },
    methods: {
        List: function() {
            this.$http.post('rewards/list', {
                contact_id: Session.UID,
                draw: this.draw,
                page: this.page,
                sortBy: this.sortBy,
                sort: this.sort
            }).then(function (json) {
                var response = json.body.response;
                this.total = response.total;
                this.filtered = response.filtered;
                this.rawData = response.rewards;
            }.bind(this));
        },
        Settings: function() {
            this.$http.post('rewards/settings', {
                company_id: Session.CID
            }).then(function (json) {
                this.settings = json.body.response
            }.bind(this));
        },
        Sort: function (idx) {

            var columns = this.tableColumns;
            var sort = columns[idx]['sort'];
            var column = columns[idx]['column'];

            switch(sort) {
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
        StrAdj: function (str) {
            var string = str.replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
            return string.replace('_', ' ');
        }
    },
    mounted: function () {

        this.List();
        this.Settings();

        Events.$on('sort-ev', function (idx) {
            this.Sort(idx);
        }.bind(this));

        Events.$on('setPage-ev', function(draw) {
            this.draw = draw;
            this.List();
        }.bind(this));

    },
    components: {
        tableColumns,
        tableRows,
        tablePagination
    }
});

function resize() {
    var leftP = window.innerHeight;
    var tableHeight = leftP - 420;
    $('.pages-table-wrapper').css('height', leftP - 60);
    $('#pages-table').css({'height': tableHeight, 'overflow-y': 'auto'});
}