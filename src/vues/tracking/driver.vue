<template>
    <form class="form-horizontal">
        <div class="form-group">
            <div class="col-sm-3" style="background-color: #f9a153; font-size: 1.2rem; color: #FAFAFA; padding: 0.4rem;">Serving Branch</div>
            <div class="col-sm-9" style="background-color: #FFFFFF; font-size: 1.2rem; color: #333; padding: 0.4rem;">{{ branch }}</div>
        </div>
        <div class="form-group">
            <div class="col-sm-3" style="background-color: #f9a153; font-size: 1.2rem; color: #FAFAFA; padding: 0.4rem;">Delivery Address</div>
            <div class="col-sm-9" style="background-color: #FFFFFF; font-size: 1.2rem; color: #333; padding: 0.4rem;">{{ address }}</div>
        </div>
        <div class="form-group">
            <div class="row-fluid" v-if="name">
                <div class="col-sm-3" style="background-color: #f9a153; font-size: 1.2rem; color: #FAFAFA; padding: 0.4rem;">Driver Name</div>
                <div class="col-sm-9" style="background-color: #FFFFFF; font-size: 1.2rem; color: #333; padding: 0.4rem;">{{ name }}</div>
            </div>
            <div class="row-fluid" v-if="mobile">
                <div class="col-sm-3" style="background-color: #f9a153; font-size: 1.2rem; color: #FAFAFA; padding: 0.4rem; border-top: 1px solid #ccc;">Driver Mobile</div>
                <div class="col-sm-9" style="background-color: #FFFFFF; font-size: 1.2rem; color: #333; padding: 0.4rem; border-top: 1px solid #ccc;">{{ mobile }}</div>
            </div>
        </div>
    </form>
</template>

<script>
    export default {
        name: 'driverDetails',
        props: ['address','name','mobile','branch']
    }
</script>