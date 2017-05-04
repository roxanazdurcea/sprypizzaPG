<template>
    <form>
        <div class="form-group">
            <div  style="background-color: #f9a153; font-size: 1.2rem; color: #FAFAFA; padding: 0.4rem;">Serving Branch</div>
            <div  style="background-color: #FFFFFF; font-size: 1.2rem; color: #333; padding: 0.4rem;">{{ branch }}</div>
        </div>
        <div class="form-group">
            <div  style="background-color: #f9a153; font-size: 1.2rem; color: #FAFAFA; padding: 0.4rem;">Delivery Address</div>
            <div  style="background-color: #FFFFFF; font-size: 1.2rem; color: #333; padding: 0.4rem;">{{ address }}</div>
        </div>
        <div class="form-group">
            <div class="row-fluid" v-if="name">
                <div  style="background-color: #f9a153; font-size: 1.2rem; color: #FAFAFA; padding: 0.4rem;">Driver Name</div>
                <div  style="background-color: #FFFFFF; font-size: 1.2rem; color: #333; padding: 0.4rem;">{{ name }}</div>
            </div>
            <div class="row-fluid" v-if="mobile">
                <div  style="background-color: #f9a153; font-size: 1.2rem; color: #FAFAFA; padding: 0.4rem; border-top: 1px solid #ccc;">Driver Mobile</div>
                <div  style="background-color: #FFFFFF; font-size: 1.2rem; color: #333; padding: 0.4rem; border-top: 1px solid #ccc;">{{ mobile }}</div>
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