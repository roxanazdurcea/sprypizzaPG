import tableRows from "../vues/orders/rows.vue";
import tablePagination from "../vues/orders/pagination.vue";

new Vue({
    el: '#orders-container',
    http: {
        emulateJSON: true,
        emulateHTTP: true
    },
    data: {
        rawData: [],
        sortBy: 'id',
        sort: 'desc',
        draw: 1,
        page: 5,
        total: '',
        filtered: '',
        excludeColumns: ['items', 'showItems'],
        addColumns: ['action']
    },
    computed: {
        tableData: function () {

            var response = this.rawData;

            response = _.map(response, function (obj,index) {
                obj['lock'] = (index === this.lockIndex) ? this.lockValue : true;
                return obj;
            }.bind(this));

            return response;
        }
    },
    methods: {
        List: function() {
            this.$http.post('https://sprypizza.com/api/orders/get', {
                contact_id: "58c0312521a1d",
                draw: this.draw,
                page: this.page,
                sortBy: this.sortBy,
                sort: this.sort
            }).then(function (json) {
                var response = json.body.response;
                this.total = response.total;
                this.filtered = response.filtered;
                this.rawData = _.map(response.orders, function(obj,index) {
                    obj['showItems'] = false;
                    return obj;
                });
            }.bind(this));
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

        Events.$on('showItems-ev', function(idx) {
            this.tableData[idx]['showItems'] = (this.tableData[idx]['showItems'] === true) ? false : true;
        }.bind(this));

        Events.$on('sort-ev', function (idx) {
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
        tableRows,
        tablePagination
    }
});