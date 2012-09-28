
document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("touchmove", preventBehavior, false);

var theImage = new Object();
var random = true;
var minyears = 0;
var maxyears = 0;


function preventBehavior(e)
{
    e.preventDefault();
};


function onDeviceReady(){
    console.log("javascript works");
   

    
    if (localStorage.confirmed == "true"){
        $.mobile.changePage($('#displayimage'));
    } else {
        $.mobile.changePage($('#displayimage'));
    }
    
    
    $.mobile.loadingMessageTextVisible = true;
    $.mobile.allowCrossDomainPages = true;
    $.support.cors = true;
    $.mobile.pushStateEnabled = false;
    $.mobile.buttonMarkup.hoverDelay = 0;
    
 //   $('#registerForm').submit(registerEmail);
//    $('#loginForm').submit(checkEmail);
 //   $('#resetForm').submit(resetPassword);
    //$('#submitForm').submit(getFormValues);
    $('#tags').hide();
    $('#loginPage').hide();
    $('#reset').hide();
    
    $("#rangeslider").slider({
                             from: 1, to: 60,
                             heterogeneity: ['50/12'],
                             scale: ['1 month', '|', '|', '|', '6 months', '|', '|', '|', '1 year', '|', '|', '|', '3 years', '|', '|', '|', '5 years'],
                             dimension: '&nbsp;$' ,
                             onstatechange: function( value ){
                                                        
                             var min = value.split(";")[0];
                             var max = value.split(";")[1];
                             
                             localStorage.min = min;
                             localStorage.max = max;

                }});
    
    $("input[type='radio']").bind( "change", function(event, ui) {
                           if (this.name == "tagchoice") {
                                  var checkedBox = $("input:radio[name=tagchoice]:checked").val();
                                  console.log(checkedBox);
                                    if(checkedBox == "us"){
                                   $('#tags').show();
                                   }
                                   else if (checkedBox == "me"){
                                   $('#tags').hide();
                                   }
                           } else if (this.name == "return") {
                                  var checkedBox = $("input:radio[name=return]:checked").val();
                                  console.log(checkedBox);
                                  if(checkedBox == "choose"){
                                    console.log("choose");
                                    random = false;
                                    $('#date').show();
                                    $('#selectrandom').hide();
                                    $('#show').hide();
                                    window.plugins.datePicker.show({
                                                                 date: new Date(),
                                                                 mode: "date", //date or time or blank for both
                                                                 allowOldDates: false
                                                                 }, cb);
                                    console.log("choice");
                                  }
                                  else if (checkedBox == "random"){
                                  random = true;
                                  $("#selectrandom").show();
                                  $('#date').hide();
                                  }
                           }
                                  else if (this.name == "signin") {
                                 var checkedBox = $("input:radio[name=signin]:checked").val();
                                    console.log(checkedBox);
                                    if(checkedBox == "login"){
                                    $('#registerPage').hide();
                                    $('#loginPage').show();
                                    $('#reset').show();
                                }
                                  else if(checkedBox == "register"){
                                 console.log(checkedBox);
                                    $('#registerPage').show();
                                    $('#loginPage').hide();
                                    $('#reset').hide();
                                  }
                                  }

                           });
    
  }


function registerEmail() {
   
    localStorage.confirmed = "false";
    console.log("registering email");
    localStorage.email = $('#register_email').val();
    localStorage.password = $('#register_password').val();
    var postTo = "http://throwback.heroku.com/users/new";
        
    $.post(postTo,
           {email:localStorage.email, password:localStorage.password},
           function(data) {
           if(data == "") {
            $.mobile.hidePageLoadingMsg();
           console.log(data);
           console.log("email sent");
            navigator.notification.alert('Confirm your email address to ensure your Throwbacks return to you safely', null, 'Check your email!');
           } else {
            $.mobile.hidePageLoadingMsg();
           console.log(data);
            navigator.notification.alert( data, null, "Throwback");
           }
           });
    
}


function checkEmail() {
    var postTo = "http://throwback.heroku.com/users/check";
    localStorage.email = $('#login_email').val();
    localStorage.password = $('#login_password').val();
    console.log(localStorage.password);
    $.mobile.showPageLoadingMsg();
    $.post(postTo,
           {email: localStorage.email, password:localStorage.password},
           function(data) {
           
           if(data == "Logging in")
           {
           $.mobile.hidePageLoadingMsg();
           $.mobile.changePage($('#displayimage'));
           localStorage.confirmed = "true";
           console.log(localStorage.confirmed);
          
           } else {
            $.mobile.hidePageLoadingMsg();
           console.log(data);
           navigator.notification.alert(data, null, "Throwback");
           }
           });
}

function resetPassword(){
    localStorage.email = $('#reset_email').val();
    var postTo = "http://throwback.heroku.com/users/reset";
    console.log(localStorage.email);
    $.mobile.showPageLoadingMsg("a", "Looking up your email", false);
    $.post(postTo,
           {email:localStorage.email},
           function(data) {
           if(data == "") {
           console.log(data);
           $.mobile.hidePageLoadingMsg();
           console.log("email sent");
           $.mobile.changePage($('#register_entry'));
           navigator.notification.alert('We just sent you a link to reset your password', null, 'Check your email!');
           } else {
           console.log(data);
           $.mobile.hidePageLoadingMsg()
           $.mobile.changePage($('#register_entry'));
           navigator.notification.alert(data, null, "Whoops!");
           }
        });
}

function logOut(){
    localStorage.confirmed = "false";
    $.mobile.changePage($('#register_entry'));
    $('#registerPage').hide();
    $('#loginPage').show();
}

function cameraButton(){
    $.mobile.showPageLoadingMsg();
    setTimeout(function() {captureImage();},100);
}

function albumButton(){
     $.mobile.showPageLoadingMsg();
     setTimeout(function() {pickImage();},100);
}

function pickImage(){
    $.mobile.hidePageLoadingMsg();
    navigator.camera.getPicture(captureSuccess,
                                onFail,
                                {
                                quality: 50,
                                destinationType: navigator.camera.DestinationType.FILE_URI,
                                sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM
                                });
    
}

function captureImage() {
    
     $.mobile.hidePageLoadingMsg();
    // allowing user to capture up to 2 images
    // console.log(localStorage.getItem("email"));
    //  navigator.device.capture.captureImage(captureSuccess, captureError, {limit: 2});
    navigator.camera.getPicture(captureSuccess,
                                onFail,
                                {
                                quality: 50,
                                destinationType: navigator.camera.DestinationType.FILE_URI,
                                saveToPhotoAlbum: false
                                });
    
}

function onFail(error) {
    alert("Fail when getting image. Code = " = error.code);
}


function captureSuccess(imageURI) {
    console.log(imageURI);
    filename =  imageURI.substr(imageURI.lastIndexOf('/')+1);
    theImage = imageURI;

    var largeImage = document.getElementById('largeImage');
    largeImage.style.display = 'block';
    largeImage.src = imageURI+ "?" + (new Date()).getTime();
    $.mobile.changePage($("#displayimage"));
    }

// Upload files to server

function getFormValues(){

    $.mobile.showPageLoadingMsg("b","Uploading");
    localStorage.tags = $('#tag_email').val();
    localStorage.caption = $('#message').val()
    if (random == true){
        generateDate();
    }
    else{
        console.log(localStorage.returnDate);
    }
    uploadFile();
  //  document.getElementById("caption_entry").reset();
    
}
function generateDate() {
    var d = new Date();
    console.log("current date:" + d.toString());
    var min = localStorage.min;
    console.log("low range: " + min);
    var max = localStorage.max;
    console.log("high range: " + max);
    var one_month_milli=1000*60*60*24*30;
    var min_milli = min * one_month_milli;
    var max_milli = max * one_month_milli;
    var today = d.getTime();
    console.log("today in millis" + today);
    var time_to_add= Math.floor(Math.random()*(max_milli - min_milli+1)+min_milli);
    console.log("time to add:" + time_to_add);
    var  new_date = Math.round(today) + Math.round(time_to_add);
    console.log("new time to add in millis: " + new_date);
    d.setTime(new_date);
    localStorage.returnDate = d.toDateString();
    console.log("new date to string" + d.toString());
}


function uploadFile() {
 
 console.log("upload started");
 theEmail = localStorage.email;
 theDate = localStorage.returnDate;
 theCaption = localStorage.caption;
 var options = new FileUploadOptions();
 options.fileKey = "file";
 options.fileName = theImage.substr(theImage.lastIndexOf('/')+1);
 options.mimeType="image/jpeg";
 
 var params = new Object();
 params.email =theEmail;
 params.date = theDate;
 params.caption = theCaption;
 params.tags = localStorage.tags;
 options.params = params;
 
 options.chunkedMode = true;
 console.log(params);
 
 var ft = new FileTransfer();
 
 ft.upload(theImage,"http://throwback.heroku.com/capsules", win, fail, options);
 
    setTimeout(function() {
               media.pause();
               }, 10000);

}
 
 function cameraSuccess() {
 console.log("Camera cleanup success.")
 }
 
 function cameraError(message) {
 alert('Failed because: ' + message);
 }
 
 
 function win(r) {
     $('.clearit').val("");
     localStorage.tags = "";
     localStorage.returnDate = "";
     localStorage.caption = "";
     document.getElementById("date").innerHTML = "";
     navigator.camera.cleanup( cameraSuccess, cameraError );
     $.mobile.hidePageLoadingMsg();
     $.mobile.changePage($('#home'));
     console.log('Upload success: ' + r.responseCode);
     console.log(r.bytesSent + ' bytes sent');
     navigator.notification.vibrate();
     navigator.notification.alert('Sent to your future self', null, 'Success!');
 }
 
 function fail(error) {
 $.mobile.hidePageLoadingMsg();
 $.mobile.changePage($('#home'));
 console.log('Error uploading file : ' + error.code);
     navigator.notification.confirm(
                                    'Try Again?',  // message
                                    uploadFile,              // callback to invoke with index of button pressed
                                    'Upload Error',            // title
                                    'Cancel,Yes'          // buttonLabels
                                    );
 }

function cancel(){
    
    navigator.notification.confirm(
                                   'Your Throwback will not be sent',  // message
                                   onConfirm,              // callback to invoke with index of button pressed
                                   'Are you sure you want to delete your photo?',            // title
                                   'Cancel,Yes'          // buttonLabels
                                   );
  
    
    
}



function onConfirm(buttonIndex){
    if (buttonIndex == 2){
        navigator.camera.cleanup( cameraSuccess, cameraError );
        var largeImage = document.getElementById('largeImage');
        largeImage.src = "";
        $.mobile.changePage($('#home'));
    }
}

var cb = function(date) {
    console.log(date.toString());
    localStorage.returnDate = date.toDateString();
    document.getElementById("date").innerHTML = "Return date: " + date.toDateString();
  }

var show = function(mode) {
    window.plugins.datePicker.show({
                                   date: new Date(),
                                   mode: mode, //date or time or blank for both
                                   allowOldDates: false
                                   }, cb);
}


