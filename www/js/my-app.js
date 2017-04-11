// Initialize your app
var myApp = new Framework7({
    pushState: 'true',
    swipeBackPage:	'true',
    swipePanel: 'left',
});

// Export selectors engine
var $$ = Dom7;

// Add views
var view1 = myApp.addView('#view-1');
var view2 = myApp.addView('#view-2', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});
var view3 = myApp.addView('#view-3');
var view4 = myApp.addView('#view-4');

myApp.onPageInit('index-4', function (page) {

    console.log(11111111111);

});

var mainView = myApp.addView('.view-main', {
    domCache: true //enable inline pages
});