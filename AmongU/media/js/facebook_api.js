/*!
 * Copyright 2013 AmongU
 * All rights reserved
 */

/* Functions:
 *
 * void login() - Login the user if he is not already logged in
 * void logout() - Logout the user
 *
 */

/* Custom CSS Classes to provide functionality
 *
 * .pLoginBad - Displayed if the user is not logged in
 * .pLoginWait - Displayed when the login is being processed
 * .pLoginDone - Displayed when the user is fully logged in
 * 
 * .pName - User's full name
 * .pPhotoUrl = Use it with a <img> element, sets src attribute to user's profile image
 */


var access_token = null;
var user_city = null;
var fb_user = null;

function login() {
   _login_wait();
   
   FB.login(function(response) {
      //_check_login();      
   }, {scope:'read_stream,read_insights,user_location,create_event'});
}
function logout() {
   _login_wait();
      
   FB.logout(function(response) {
      //_login_bad();
   });
}

var xhr_search = 0;
function search(query, index) {
  $('#search_feed').show();
  $('#search_term').text(query);        
  $('#btnclear_search').show();
  
  display_news_feed(encodeURIComponent(user_city) + '+' + encodeURIComponent(query), false);
  xhr_search = index;
}
function clear_search() {
  $('#search_feed').hide();        
  $('#btnclear_search').hide();
  $('#txtsearch').val('');
  
  
  display_news_feed(encodeURIComponent(user_city), false);
  
}


$(document).ready(function() {
   _hide_all_login();
});

// Additional JS functions here
window.fbAsyncInit = function() {
   FB.init({
      appId      : '522257347834600', // App ID
      channelUrl : '//localhost:8000/channel.html', // Channel File
      status     : true, // check login status
      cookie     : true, // enable cookies to allow the server to access the session
      xfbml      : true  // parse XFBML
   });

   // Additional init code here
   //_check_login();
   _login_wait();
   FB.getLoginStatus(function(response) {
      if (response.status !== 'connected') {
         _login_bad();
      }
   });
   
   FB.Event.subscribe('auth.statusChange', function(response) {
         _check_login();
         console.log(response);
   });
};

/* Helper Functions */
function _hide_all_login() {
   $('.pLoginBad').hide();
   $('.pLoginDone').hide();
   $('.pLoginWait').hide();
}
function _check_login() {
   _login_wait();
   FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
         _login_done(response);
      } 
      else {
         _login_bad();
      }
   });
}
function _login_wait() {
   _hide_all_login();
   $('.pLoginWait').show();
}
function _login_bad() {
   _hide_all_login();
   $('.pLoginBad').show();         
}
function _login_done(response) {  
   
   if (response != null)
      access_token = response.authResponse.accessToken;
      
   FB.api('/me?fields=picture,name,location', function(response) {
      fb_user = response;
      $('.pName').text(response.name);
      $('.pPhotoUrl').attr('src', response.picture.data.url);
      
      user_city = response.location.name.split(',', 1);
      $('#txtLocation').val(user_city);
      //$('#facebook-old-login').show();
      
      display_news_feed(encodeURIComponent(user_city), false);
      
      _hide_all_login();
      $('.pLoginDone').show();
   });
   
   $.ajax({url:'/api/user/login?input_token='+access_token});
   //$.ajax({url:"demo_test.txt",success:function(result){    $("#div1").html(result);  }});
   
   /*
   
   FB.api('/me/home', function(response) {
      console.log(response);
      $('#news_feed').empty();
      for (var i = 0; i < response['data'].length; i++) {
          var item = response['data'][i];
          var txt = '<div class="media"> \
                  <a class="pull-left" href="#"> \
                      <img class="media-object" src="' + item['icon'] + '"> \
                  </a> \
                  <div class="media-body">  \
                      <h4 class="media-heading"><a href="#">' + item['from']['name'] + '</a></h4>            \
                  </div> \
              </div>';
          $('#news_feed').append(txt);
      }
   });*/
}
function _fatal_error(message) {
   $('body').html('Fatal Error! Please refresh the page<br /><br />Message: ' + message);
}


// Load the SDK asynchronously
(function(d) {
   var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement('script'); js.id = id; js.async = true;
   js.src = "//connect.facebook.net/en_US/all.js";
   ref.parentNode.insertBefore(js, ref);
}(document));