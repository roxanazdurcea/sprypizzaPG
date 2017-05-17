<template>
    <div>
        <div id="listing" class="pull-left">
            <p style="font-size: 11px; padding: 10px 0 0 10px;">Showing {{ 1 + this.page * (this.setPage - 1) }} to {{ (this.setPage * this.page <= this.total) ? this.setPage * this.page : this.total }} of {{ this.total }} entries</p>
        </div>
        <div class="row" style="padding: 3% 0;">
            <p class="col-50">
                <a href="#" class="button button-big color-orange" v-on:click="Previous" v-bind:disabled=" setPage == 1 ">Previous</a>
            </p>
            <p class="col-50">
                <a href="#" class="tab-link button button-big color-orange" v-on:click="Next" v-bind:disabled=" setPage == pages ">Next</a>
            </p>
        </div>
        <!--<div style="position: relative; width: 100%; height:50px; margin-top:10px; border-top:1px solid #F9A153; padding-top:10px;">-->
        <!--<ul class="pagination" style="position: absolute; right: 10px; margin:0;">-->
        <!--<li v-for="page in pages" v-on:click="SetPage(page)"><a>{{ page }}</a></li>-->
        <!--</ul>-->
        <!---->
        <!--</div>-->
    </div>
</template>

<script>
    export default {
        name: 'rewardsPagination',
        props: ['page', 'total', 'filtered'],
        data: function () {
            return {
                setPage: 1,
                previousDisabled: false,
                nextDisabled: false
            }
        },
        computed: {
            pages: function () {
                return Math.ceil(this.total / this.page);
            }
        },
        methods: {
            SetPage: function (page) {
                this.setPage = page;
                Events.$emit('setPage-ev', page);
            },
            Previous: function() {
                if (this.setPage >= 2) {
                    this.setPage--;
                    Events.$emit('setPage-ev', this.setPage);
                }
            },
            Next: function() {
                if (this.setPage < this.pages) {
                    this.setPage++;
                    Events.$emit('setPage-ev', this.setPage);
                }
            }
        }
    }
</script>

<style scoped>

    .pagination {
        padding: 0;
        margin: 25px 0 15px 0;
        list-style: none;
        font-size: 19px;
        display: block;
        text-align: center;
    }

    .pagination li {
        margin: 0 3px;
        display: inline-block;

    }

    .pagination li a {
        display: block;
        width: 35px;
        height: 35px;
        line-height: 33px;
        text-align: center;
        border: 1px #F9A153 solid;
        background: none;
        padding: 0;
        color: #F9A153;
    }

    .pagination li a:hover {
        color: #FFFFFF;
        border-color: #F9A153;
        background-color: #F9A153;
    }

</style>