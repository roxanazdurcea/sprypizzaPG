<template>
    <f7-page>
        <!-- Material Theme Navbar -->
        <f7-navbar>
            <f7-nav-center sliding>Login</f7-nav-center>
            <login-icon></login-icon>
        </f7-navbar>
        <f7-block inner>
            <section style="padding: 10px;">
                <div>
                    <div>
                        <h1>Welcome Back!</h1>
                        <p style="margin: 0px;">Sign In To Your Account to See What’s Cooking.</p>
                    </div>
                    <form id="login_Form" class="list-block" method="post">
                        <ul>
                            <li>
                                <div class="item-content">
                                    <div class="item-inner">
                                        <div class="item-title label">Country</div>
                                        <countries-listing :country_id="country_id"></countries-listing>
                                    </div>
                                </div>
                            </li>

                            <li class="item-content">
                                <div class="item-inner">
                                    <div class="item-input">
                                        <input class="form-control" name="mobile_number" placeholder="Mobile Number" v-model="mobile_number" autocomplete="off"/>
                                    </div>
                                </div>
                            </li>

                            <li>
                                <div class="item-content">
                                    <div class="item-inner">
                                        <div class="item-input">
                                            <button type="button" name="sendSMS" class="button button-big color-orange" autocomplete="off" @click="Send()" v-bind:disabled="isDisabled" style="width:100%;">
                                                Get pin
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            </li>
                            <login-errors :error="error" :pin="pin"></login-errors>

                            <li>
                                <div class="item-content">
                                    <div class="item-inner">
                                        <div class="item-input">
                                            <input class="form-control" name="pin_number" placeholder="PIN" autocomplete="off" v-model="pin_number" />
                                        </div>
                                    </div>
                                </div>
                            </li>

                            <li>
                                <div class="item-content">
                                    <div class="item-inner">
                                        <div class="item-input">
                                            <label style="padding-left: 5px;" name="rememberMe">Remember me</label>&nbsp;
                                            <input style="float: left; font-weight: normal;" type="checkbox" name="rememberMe" checked="checked"/>
                                        </div>
                                    </div>
                                </div>
                            </li>

                            <li>
                                <div class="item-content">
                                    <div class="item-inner">
                                        <div class="item-input">
                                            <button type="button" class="button button-big color-orange" style="width: 100%;" v-on:click="Login">
                                                Login
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </li>

                            <li>
                                <div class="item-content">
                                    <div class="item-inner">
                                        <div class="item-input">
                                            <button type="button" class="button button-big color-blue" style="width: 100%;">
                                                Facebook Login
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </li>

                        </ul>
                    </form>


                    <a href="/register/" class="item-link" style="color: #6e6e6e; margin-bottom:3%;">
                        <p style="text-align: center;">New here? <span style="color: #ff9500;">Register an account</span></p></a>
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
    import loginErrors from "./errors.vue";
    import countriesListing from "./countries.vue";
    import loginIcon from "../login/pageIcon.vue";
    import itemCount from "../cart/item-count.vue";
    export default {
        name: 'pageLogin',
        data() {
            return {
                mobile_number: '',
                pin_number: '',
                country_id: '40',
                isDisabled: false,
                pin: '',
                error: ''
            }
        },
        methods: {
            Send() {
                axios.post('https://sprypizza.com/api/sms/send', {
                    mobile: this.mobile_number,
                    country_id: this.country_id
                }).then(function(data) {

                    this.error = this.pin = '';

                    if (data.data.error) {
                        this.error = data.data.error;
                    }
                    else if (data.data.pin) {
                        this.isDisabled = true;
                        this.pin = data.data.pin;
                    }
                }.bind(this));
            },
            Login() {

                axios.post("https://sprypizza.com/api/login", {
                    mobile_number: this.mobile_number,
                    country_id: this.country_id,
                    pin_number: this.pin_number,
                    rememberMe: true,
                }).then((response) => {
                    var data = response.data;
                    if (data.user_id) {
                        Store.commit('setIsLoggedIn', true);
                        Store.commit('setContactId', data.user_id);
                        Store.commit('setCompanyId', data.company_id);
                        //Remove remember_token
                        var query = {};
                        query['remember_token'] = {$exists: true};
                        window.db.spryDB.remove(query, {multi: true});
                        //Save remember_token to DB
                        window.db.spryDB.insert({remember_token: data.remember_token});
                        //Route to home
                        window.f7.views[1].loadPage('/');
                    } else {
                        Store.commit('setIsLoggedIn', false);
                        //Clear existing token
                        var query = {};
                        query['remember_token'] = {$exists: true};
                        window.db.spryDB.remove(query, {multi: true});
                    }
                });
            }
        },
        mounted() {
            Events.$on('setCountry-ev', function(country_id) {
                this.country_id = country_id;
            }.bind(this));
        },
        components: {
            loginErrors,
            countriesListing,
            loginIcon,
            itemCount
        }
    }
</script>