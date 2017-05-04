<template>
    <div class="row-fluid" style="position: relative; width: 100%; height:50px; margin-top:10px; border-top:1px solid #F9A153; padding-top:10px;">
        <ul class="pagination" style="position: absolute; right: 10px; margin:0;">
            <li v-for="page in pages" v-on:click="SetPage(page)"><a>{{ page }}</a></li>
        </ul>
        <div id="listing" class="pull-left"><p style="font-size: 11px; padding: 10px 0 0 10px;">Showing {{ 1 + this.page * (this.setPage - 1) }} to {{ (this.setPage * this.page <= this.total) ? this.setPage * this.page : this.total }} of {{ this.total }} entries</p></div>
    </div>
</template>

<script>
    export default {
        name: 'rewardsTablePagination',
        props: ['page','total','filtered'],
        data: function () {
            return {
                setPage: 1
            }
        },
        computed: {
            pages: function() {
                return Math.ceil(this.total/this.page);
            }
        },
        methods: {
            SetPage: function(page) {
                this.setPage = page;
                Events.$emit('setPage-ev', page);
            }
        }
    }
</script>

<style lang="less">

    @orange: #F9A153;
    @red: #D12027;
    @grey: #e52525;

    .transition(@duration:0.2s, @ease:ease-out) {
        -webkit-transition: all @duration @ease;
        -moz-transition: all @duration @ease;
        -o-transition: all @duration @ease;
        transition: all @duration @ease;
    }

    .rounded(@radius: 2px) {
        -webkit-border-radius: @radius;
        -moz-border-radius: @radius;
        border-radius: @radius;
    }

    .circle() {
        .rounded(50%);
    }
    .pagination {
        padding: 0;
        margin: 25px 0 15px 0;
        list-style: none;
        font-size: 19px;
        display: block;
        text-align: center;

        li {
            margin: 0 3px;
            display: inline-block;

            &:first-child a,
            &:last-child a {
             .circle();
             }

            a {
                display: block;
                width: 35px;
                height: 35px;
                line-height: 33px;
                text-align: center;
                border: 1px #FFF solid;
                border-color: @orange;
                background: none;
                padding: 0;
                color: @orange;
                .transition();
                .circle();

                &:hover {
                     color: #FFFFFF;
                     border-color: @orange;
                     background-color: @orange;
                 }
            }
        }
    }
</style>