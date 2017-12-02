$(document).ready(function() {



    // navbar collapse initialization
    $(".button-collapse").sideNav();

    $("#logo").velocity("fadeIn", {
    duration: 3000
});
 

   // hide the navbar
   $("#handburger").hide();


      // logout function
    $('#logout').click(function() {
        console.log('logged out');

        $.ajax({
            url: '/api/logout',
            method: 'GET',
            success: function(res) {
                console.log(res);
                $('.button-collapse').sideNav('hide');
            }
        })
    })

    // logout function
    $('#logoutSide').click(function() {
        console.log('logged out');

        $.ajax({
            url: '/api/logout',
            method: 'GET',
            success: function(res) {
                console.log(res);
                $('.button-collapse').sideNav('hide');
            }
        })
    })

    // close sidenav at button click
    $('.coolside').click(function() {
        // Hide sideNav
        $('.button-collapse').sideNav('hide');

    })


    // close sidenav at button click
    $('#close').click(function() {
        // Hide sideNav
        $('.button-collapse').sideNav('hide');

    })
   
})