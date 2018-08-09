"use strict"


//analytics doc:
// https://developers.google.com/analytics/devguides/collection/analyticsjs/events

//screen dimensions
var _sw = $(window).width();
var _sh = $(window).height();
var _cssSw =  window.innerWidth;

var _isGearVR = false;

//is.js //https://github.com/arasatasaygin/is.js
var getArguments = function(){return arguments;};
var _arguments = getArguments();

//var _latestLength = 8;
//if (is.mobile(_arguments) || is.tablet(_arguments))_latestLength = 9;//3 columns
var _latestLength = 12;
var _latestStart = _latestLength * 3;

function domLoaded() {

	//revert touch event if on desktop
	if (is.desktop(_arguments))_clickOrTouch = "click";


	//header mobile -> done inline
	/*
	$("#menuToggle").on("click", function(){
		$("nav#mobileNav").toggleClass("menuOpen");
		$(".button.b_loginMobile3").show();
		$("#loginPopUpMobile").hide();
	});
*/
	$(".button.b_loginMobile").on("click", function(){
		$(".button.b_loginMobile").hide();
		$("#loginPopUpMobile").show();
	});



	//buttons

	//show fb login buttons
	$(".loginFB, .signUpFB").css({visibility:"visible"});

	$(".loginFB").on("click", function(){

		ga('send', 'event', {
			eventCategory: 'Login',
			eventAction: 'click',
			eventLabel: 'Login_fb',
			transport: 'beacon'
		});

		var url = $(this).attr("data-href");
		window.location = url;

	});

	$(".signUpFB").on("click", function(){

		ga('send', 'event', {
			eventCategory: 'Register',
			eventAction: 'click',
			eventLabel: 'Register_fb',
			transport: 'beacon'
		});

		var url = $(this).attr("data-href");
		window.location = url;

	});

	$("#signUpToggle").on(_clickOrTouch, function(){
		$("#signup").toggle();
	});

	//done in header
/*
	$("#b_loginToggle").on(_clickOrTouch, function(){
		$("#loginPopUp").toggle();
	});
*/
	$("#loginPopUp .b_submitlogin").on(_clickOrTouch, function(){
		login( $('#loginPopUp') );
	});

	$("#loginPopUpMobile .b_submitlogin").on(_clickOrTouch, function(){
		login( $('#loginPopUpMobile') );
	});

	$("#loginInBody .b_submitlogin").on(_clickOrTouch, function(){
		login( $('#loginInBody') );
	});

	//submit when press enter on password field
	$('#loginPopUp input[type="password"]').keypress(function(event) {
	    if (event.which == 13) {
	        event.preventDefault();
	        login( $('#loginPopUp') );
	    }
	});

	//must be click or will activate element under
	$("footer #mode .button").on("click", function(){
		$("body").addClass("directLinks").removeClass("ar");
		$("footer").hide();
	});

	//gear vr
	if ( $("body").hasClass("home") || $("body").hasClass("scenes")  )
	{
		var userAgent = (navigator && navigator.userAgent || '').toLowerCase();
		if (is.android(_arguments) && is.mobile(_arguments) && userAgent.indexOf("samsung") !== -1 && userAgent.indexOf("vr") !== -1)
		{
			//800px wide for oculus home, 640px wide for samsung internet VR

			$("body").addClass("gearVR");

			_isGearVR = true;

			//switch to VR featured
			$("#featured .tabs .button").removeClass("active");
			$('#featured .tabs .button[data-type="vr"]').addClass("active");
			var type = 'vr';
			$("#featured").attr("data-type", type).removeClass("ar vr").addClass(type);
		}
	}


	//page home
	$("#featured .tabs .button").on(_clickOrTouch, function(){
		$("#featured .tabs .button").removeClass("active");
		$(this).addClass("active");
		var type = $(this).data("type");

		//bug with using .data()
		$("#featured").attr("data-type", type).removeClass("ar vr").addClass(type);

	});

	$("#latest .tabs .button").on(_clickOrTouch, function(){
		$("#latest .tabs .button").removeClass("active");
		$(this).addClass("active");
		var type = $(this).data("type");

		//bug with using .data()
		$("#latest").attr("data-type", type).removeClass("ar vr").addClass(type);

	});

	//switch to featured VR scenes if on desktop
	/*
	if (is.desktop(_arguments))
	{
		$("#featured .tabs .button").toggleClass("active");
		var type = "vr";
		$("#featured").attr("data-type", type).removeClass("ar vr").addClass(type);
	}
*/
	//page home + scenes
	if ( $("body").hasClass("home") || $("body").hasClass("scenes") )
		setItemsClicks();

	//page: scenes
	$("#loadMore .button").on("click", function(e){
		loadMore();
	});

	//page:register
	$("#b_submitSignUpEmail").on(_clickOrTouch, function(){
		signUpEmail();
	});

	//page:forgot
	$("#b_submitForgotPassword").on(_clickOrTouch, function(){
		resetPasswordEmail();
	});
	//page:other
	$("#b_submitNewPassword").on(_clickOrTouch, function(){
		changePassword();
	});


	//$(document).on("mouseup touchend", function(e){bodyClick(e);});//bug with twitter link on _blank target
	$(document).on("click", function(e){bodyClick(e);});

	$(window).resize(function(){resizeHandler();}).trigger("resize");
	resizeHandler();

}

function resizeHandler()
{
	_sw = $(window).width();
	_sh = $(window).height();
	_cssSw =  window.innerWidth;

//	console.log(_sw);
}

function bodyClick(event)
{

	//hide mobile menu
	if ($(event.target).is("#menuToggle") || $('#menuToggle').has(event.target).length )
	{
	}
	else
	{
		//not a click on mloginbutton
		if (!$(event.target).is(".button.b_loginMobile"))
			//not a click on the mobile login form
			if (!$(event.target).is("#loginPopUpMobile") && !$('#loginPopUpMobile').has(event.target).length )
				//not a click on modal pop up
				if (!$(event.target).is("#bgModal .button.ok") && !$(event.target).is("#bgModal") && !$('#bgModal').has(event.target).length )
					$("nav#mobileNav").removeClass("menuOpen");

	}

	//hide login popup
	if (!$(event.target).is("#b_loginToggle") && !$(event.target).is("#loginPopUp") && !$('#loginPopUp').has(event.target).length )
	{
		//console.log("hide form click body");
		$("#loginPopUp").hide();
	}

}

function setItemsClicks()
{

	if ( is.mobile(_arguments) || is.tablet(_arguments) )
	{
		$("body").addClass("mobile");
		$("body").addClass("ar");
		$("body").addClass("directLinks");

		if (_isGearVR)
		{
			$("body").removeClass("ar").addClass("vr");
		}

		var items = $(".scenes:not(.featured) .item");

		items.off("click");

		items.on("click", function(e){

			var item = $(this);
			var url = "";

			if ($("body").hasClass("ar"))
			{
				if (item.find(".ar").length > 0)url = item.find(".ar").attr("href");
			}

			if ($("body").hasClass("vr"))
			{
				if (item.find(".vr").length > 0)url = item.find(".vr").attr("href");
			}

			if (url != "")
			{
				window.location = url;
				return;
			}
			else
			{
				console.log("no url");
			}

		});

	}
}

function loadMore()
{

	var url = _rootDirectory+'d/get-latest-projects.php?s='+_latestStart+"&l="+_latestLength;

	startLoading();

	$("#loadMore").css({visibility:"hidden"});

	var jqxhr = $.ajax({
		type: 'GET',
		url: url,
		cache: false,
		dataType: "json"
	})
	.done(function(data) {

		stopLoading();

		_latestStart += _latestLength;

		if (data.p.length >= _latestLength)
			$("#loadMore").css({visibility:"visible"});

		displayMore( data.p);

	})
	.fail(function( jqXHR, textStatus ) {

		stopLoading();
		console.log("fail: load more scenes");

		//console.log(jqXHR.responseText);
	});
}

function displayMore(data)
{
	var i, item, inner;
	var folder, url, previewUrl, ARUrl, VRUrl;

	var nbNotvisible = 0;

	for (i=0;i<data.length;i++)
	{
		item = data[i];

		folder = item.folder;
		url = item.url;
		previewUrl = _rootDirectory + "s/" + folder + "/" + url + "/" + item.preview;
		ARUrl = _rootDirectory + url;
		VRUrl = _rootDirectory + 'vr/' + url;
		var classes = "item displayNone";
		if (item.ar == true)classes += " ar";
		if (item.vr == true)classes += " vr";

		if ($("body").hasClass("mobile") && $("body").hasClass("vr") && item.vr == false)nbNotvisible++;
		if ($("body").hasClass("mobile") && $("body").hasClass("ar") && item.ar == false)nbNotvisible++;

		inner = '<div class="'+classes+'">';
		inner += '<div class="preview"><img src="'+previewUrl+'" alt="'+ARUrl+'"/>';
		inner += '<div class="buttons">';

		if (item.ar == true)
		{
			inner += '<a class="button ar" href="'+ARUrl+'">AR</a>';
		}
		else {
			inner += '<span class="button none">&nbsp;</span>';
		}
		if (item.vr == true)inner += '<a class="button vr" href="'+VRUrl+'">VR</a>'

		inner +='</div></div>';

		inner +='<span class="name">'+item.name+'</span></div>'+"\n";

		$("#latest .items").append(inner);

		//display with delay
		setTimeout(function(){
			$("#latest .items .displayNone").first().removeClass("displayNone");
		}, 100*i);

		setItemsClicks();
	}

	//load more results if no results visible at all
	if (nbNotvisible == data.length)
	{

		//check if there are more results to load
		if ($("#loadMore").css("visibility") == "visible")
		{
			loadMore();
		}
	}
}

function showLayerReality(item)
{
	var preview = item.find("img").attr("src");
	var urlAR = "";
	var urlVR = "";

	if (item.find(".ar").length > 0)
		urlAR = item.find(".ar").attr("href");

	if (item.find(".vr").length > 0)
		urlVR = item.find(".vr").attr("href");

	var inner = "";
	inner += '<div id="layerReality">';

	inner += '<img class="image" src="'+preview+'" alt=""/>';
	inner += '<span class="b_close"></span>';

	inner += '<div>';
	inner += '<h1>choose your reality</h1>';

	if (urlAR != "")
	{
		inner += '<div class="ar">';
		inner += '<h2>augmented reality</h2>';
		inner += '<p>with your phone camera</p>';
		inner += '</div>';
	}

	if (urlVR != "")
	{
		inner += '<div class="vr">';
		inner += '<h2>virtual reality</h2>';
		inner += '<p>with a VR headset</p>';
		inner += '</div>';
	}

	inner += '</div></div>';

	$("body").addClass("layerOpen");
	$("body").append(inner);

	$("#layerReality .b_close").on("click", function(e){
		$("body").removeClass("layerOpen");
		$("#layerReality").remove();
	});

	$("#layerReality .ar").on("click", function(e){
		$("#layerReality").html("");
		window.location = urlAR;
	});

	$("#layerReality .vr").on("click", function(e){
		$("#layerReality").html("");
		window.location = urlVR;
	});

}

function login(loginForm)
{
	ga('send', 'event', {
		eventCategory: 'Login',
		eventAction: 'click',
		eventLabel: 'Login_mail',
		transport: 'beacon'
	});

	var url = "https://xr.plus/auth/login.php";
	var fData = new FormData();
	var email = loginForm.find('input[name="email"]').val();
	var loginRedirection = loginForm.find('input[name="loginRedirection"]').val();

	if (!validateEmail(email))
	{
		openModal("This is not a valid email");
		return;
	}


	fData.append( 'email', email );
	fData.append( 'password', loginForm.find('input[name="password"]').val() );
	//if(loginRedirection != undefined)fData.append( 'loginRedirection', loginRedirection );

	loginForm.find(".b_submitlogin").css({visibility:"hidden"});

	$.ajax({
		url: url,
		type: 'POST',
		data: fData,
		cache: false,
		dataType: 'json',
		processData: false,
	   contentType: false,
		success: function(data, textStatus, jqXHR)
		{
			loginForm.find(".b_submitlogin").css({visibility:"visible"});

			if (data.error)
			{
				openModal(data.error);
				return;
			}

			if(loginRedirection != undefined)
			{
				window.location = loginRedirection;
			}
			else
			{
				window.location = "https://xr.plus/edit/";
			}

		},
		error: function(jqXHR, textStatus, errorThrown)
		{
			openModal("error");

			//console.log(jqXHR.responseText );

			loginForm.find(".b_submitlogin").css({visibility:"visible"});
		}
	});
}

function signUpEmail()
{
	ga('send', 'event', {
		eventCategory: 'Register',
		eventAction: 'click',
		eventLabel: 'Register_mail',
		transport: 'beacon'
	});

	var url = "https://xr.plus/auth/signup.php";

	var fData = new FormData();

	var email = $('#signUpForm input[name="email"]').val();
	var username = $('#signUpForm input[name="username"]').val();
	var passwordLength = $('#signUpForm input[name="password"]').val().length;

	if (!validateEmail(email))
	{
		openModal("Please enter a valid email address");
		return;
	}

	if (username.length <4)
	{
		openModal("your name must be at least 4 letters long");
		return;
	}

	if (passwordLength < 6)
	{
		openModal("your password should be at least 6 characters long");
		return;
	}

	fData.append( 'email', email );
	fData.append( 'username', username );
	fData.append( 'password', $('#signUpForm input[name="password"]').val() );

	$('#signUpForm .loading').show();
	$("#b_submitSignUpEmail").hide();

	$.ajax({
		url: url,
		type: 'POST',
		data: fData,
		cache: false,
		dataType: 'json',
		processData: false,
	   contentType: false,
		success: function(data, textStatus, jqXHR)
		{
			$("#b_submitSignUpEmail").show();
			$('#signUpForm .loading').hide();

			if (data.error)
			{
				openModal(data.error);
				return;
			}

			openModal("Thank you,\n\ncheck your inbox for to verify your email")

		},
		error: function(jqXHR, textStatus, errorThrown)
		{
			openModal("error");

			//console.log(jqXHR.responseText );

			$("#b_submitSignUpEmail").show();
			$('#signUpForm .loading').hide();
		}
	});
}

function resetPasswordEmail()
{
	var url = "https://xr.plus/auth/forgot.php";

	var fData = new FormData();

	var email = $('#forgotForm input[name="email"]').val();

	if (!validateEmail(email))
	{
		openModal("This is not a valid email");
		return;
	}

	//loading info
	$("#forgotForm").append('<p>Please wait</p>');

	fData.append( 'email', email );

	$("#b_submitForgotPassword").hide();

	$.ajax({
		url: url,
		type: 'POST',
		data: fData,
		cache: false,
		dataType: 'json',
		processData: false,
	   contentType: false,
		success: function(data, textStatus, jqXHR)
		{
			//remove loading info
			$("#forgotForm p").remove();
			$("#b_submitForgotPassword").show();

			if (data.error)
			{
				openModal("error " + data.error);
				return;
			}

			openModal("Thank you,\n\ncheck your inbox for a link to reset your password")

		},
		error: function(jqXHR, textStatus, errorThrown)
		{
			openModal("something went wrong, try again");

			//console.log(jqXHR.responseText );

			//remove loading info
			$("#forgotForm p").remove();
			$("#b_submitForgotPassword").show();
		}
	});
}

function changePassword()
{
	var url = "https://xr.plus/auth/change-password.php";

	var fData = new FormData();

	var token = $('#changePasswordForm input[name="token"]').val();
	var selector = $('#changePasswordForm input[name="selector"]').val();
	var passwordLength = $('#changePasswordForm input[name="password"]').val().length;


	if (passwordLength < 6)
	{
		openModal("your password should be at least 6 characters long");
		return;
	}

	fData.append( 'token', token );
	fData.append( 'selector', selector );
	fData.append( 'password', $('#changePasswordForm input[name="password"]').val() );

	$("#b_submitNewPassword").hide();

	$.ajax({
		url: url,
		type: 'POST',
		data: fData,
		cache: false,
		dataType: 'json',
		processData: false,
		contentType: false,
		success: function(data, textStatus, jqXHR)
		{
			$("#b_submitNewPassword").show();

			if (data.error)
			{
				openModal("error " + data.error);
				return;
			}
			window.location = "https://xr.plus/edit/";

		},
		error: function(jqXHR, textStatus, errorThrown)
		{
			openModal("error");

			console.log(jqXHR.responseText );

			$("#b_submitNewPassword").show();
		}
	});
}

function scrollToDiv(domID)
{
	var target = $("#" + domID);
	var scrollTop = target.offset().top;// - 60;

	$('html, body').animate({scrollTop: scrollTop}, 400);
}

function alertModal(t)
{
	alert(t);
}

function openModal(message)
{
	var inner = '<div id="bgModal"><div id="alertModal"><p>'+message+'</p><div class="buttons"><span class="button ok">ok</span></div></div></div>';
	$( "body" ).append( inner );

	$("#alertModal .button.ok").on("click", function(){
		$( "#bgModal" ).remove();
	});

}
/*
function isMobileVRSupported()
{

	if ( 'getVRDisplays' in navigator ) {
		return true;
	} else {
		return false;
	}

}
*/
