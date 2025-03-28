var is_login_ok = false;
var is_cookie_red = false;
var logincookiename = "logincookie";

fetch('https://raw.githubusercontent.com/eylulberil/encoded_key/main/keys.json')
  .then(response => response.json())
  .then(myObj => {
	encrypted_key = myObj[0];
	console.log(encrypted_key);
	
  })
  .catch(error => {
    // Handle any errors that occur during the fetch request
    console.log('Error:', error);
  });

$(document).ready(function() {

		
		
		
	if(is_login_ok) {
		$(document).keydown(function(event) {
			// When a key is pressed
			var key = event.key; // Get the key that was pressed
			buttonStateChanged(key, true);
		});

		$(document).keyup(function(event) {
			// When a key is released
			var key = event.key; // Get the key that was released
			buttonStateChanged(key, false);
		});
	}
	
	if(is_cookie_red == false) {
		logininfo = readCookie(logincookiename);
		is_cookie_red = true;
	}
	
	if(logininfo != "") {
		const parts = logininfo.split(/\|/); // | karakterini kullanarak ayır
		console.log(parts);

		logintofirebase(parts[0], parts[1]);
	}
});

function buttonStateChanged(key, bool_btn_state) {
	if(bool_btn_state) {
		if(key == 'q' && !key_pressed[0]) {
			//console.log("turning right");
			$(".manuel_control_turn_btn:not(:eq(0))").css("background", "black");
			$(".manuel_control_turn_btn:eq(0)").css("background", "#3d3d3d");
			moveRobot('q');
			key_pressed[0] = true;
		} else if(key == 'e' && !key_pressed[1]) {
			//console.log("turning left");
			$(".manuel_control_turn_btn:not(:eq(1))").css("background", "black");
			$(".manuel_control_turn_btn:eq(1)").css("background", "#3d3d3d");
			moveRobot('e');
			key_pressed[1] = true;
		} else	if(key == 'w' && !key_pressed[2]) {
			//console.log("going forward");
			$(".manuel_control_turn_btn:not(:eq(2))").css("background", "black");
			$(".manuel_control_turn_btn:eq(2)").css("background", "#3d3d3d");
			moveRobot('f');
			key_pressed[2] = true;
		} else	if(key == 'a' && !key_pressed[3]) {
			//console.log("going left");
			$(".manuel_control_turn_btn:not(:eq(3))").css("background", "black");
			$(".manuel_control_turn_btn:eq(3)").css("background", "#3d3d3d");
			moveRobot('l');
			key_pressed[3] = true;
		} else	if(key == 'd' && !key_pressed[4]) {
			//console.log("going backward");
			$(".manuel_control_turn_btn:not(:eq(4))").css("background", "black");
			$(".manuel_control_turn_btn:eq(4)").css("background", "#3d3d3d");
			moveRobot('r');
			key_pressed[4] = true;
		}else if(key == 's' && !key_pressed[5]) {
			//console.log("going right");
			$(".manuel_control_turn_btn:not(:eq(5))").css("background", "black");
			$(".manuel_control_turn_btn:eq(5)").css("background", "#3d3d3d");
			moveRobot('b');
			key_pressed[5] = true;
		}
	} else {
		let is_related = true;
		if(key == 'q') {
			key_pressed[0] = false;
			$(".manuel_control_turn_btn:eq(0)").css("background", "black");
		} else if(key == 'e') {
			key_pressed[1] = false;
			$(".manuel_control_turn_btn:eq(1)").css("background", "black");
		} else	if(key == 'w') {
			key_pressed[2] = false;
			$(".manuel_control_turn_btn:eq(2)").css("background", "black");
		} else	if(key == 'a') {
			key_pressed[3] = false;
			$(".manuel_control_turn_btn:eq(3)").css("background", "black");
		} else	if(key == 'd') {
			key_pressed[4] = false;
			$(".manuel_control_turn_btn:eq(4)").css("background", "black");
		} else if(key == 's') {
			key_pressed[5] = false;
			$(".manuel_control_turn_btn:eq(5)").css("background", "black");
		} else {
			is_related = false;
			$(".manuel_control_turn_btn").css("background", "black");
		}
		if(is_related) {
			let i = key_pressed.length;
			while(i--) {
				if(key_pressed[i]){
					break;
				} else if(i == 0) {
					moveRobot('p'); //stop
				}
			}
		}
	}
}

function mapping() {
	sendText("ksm|");
}

function stopMission() {
	sendText("kss|");
}

function startMission() {
	sendText("sk" + Math.round(new_X_coor/20) + "a" + Math.round(new_Y_coor/20) + "|");
}

function moveRobot(inputText) {
	sendText("ks" + inputText + "|");
}
  
function sendText(inputText) {
	
}

function openPageRequest(pagenum) {
	if(is_login_ok) {
		openPage(pagenum);
	} else {
		openPage(0);
	}
}

function openPage(pagenum) {
	
	switch (pagenum) {
		case 0:
			$(".main_menu_outer_div").css("display", "none");
			$(".main_container_login").css("display", "");
			$(".fixed_menu_buttons_left:eq(0)").attr("onclick","");
			$(".fixed_menu_buttons_left:eq(0) > p").text("Giriş Yap");
			$(".fixed_menu_buttons_left").removeClass("fixed_menu_button_selected");
			$(".fixed_menu_buttons_left:eq(0)").addClass("fixed_menu_button_selected");
			break;
		case 1:
			$(".main_menu_outer_div").css("display", "none");
			$(".main_container_login").css("display", "none");
			$(".main_page_1").css("display", "");
			$(".fixed_menu_buttons_left").removeClass("fixed_menu_button_selected");
			$(".fixed_menu_buttons_left:eq(1)").addClass("fixed_menu_button_selected");
			$(".main_container_login").css("display", "none");
			$(".fixed_menu_buttons_left:eq(0)").attr("onclick","signoutfirebase()");
			$(".fixed_menu_buttons_left:eq(0) > p").text("Çıkış Yap");
			
			break;
		case 2:
			$(".main_container_login").css("display", "none");
			$(".main_menu_outer_div").css("display", "none");
			$(".main_page_2").css("display", "");
			
			$(".fixed_menu_buttons_left:eq(0)").attr("onclick","signoutfirebase()");
			$(".fixed_menu_buttons_left:eq(0)").text("Çıkış Yap");
	  
			break;
		case 3:
			$(".main_container_login").css("display", "none");
			$(".main_menu_outer_div").css("display", "none");
			$(".main_page_3").css("display", "");
			$(".fixed_menu_buttons_left:eq(0)").attr("onclick","signoutfirebase()");
			$(".fixed_menu_buttons_left:eq(0)").text("Çıkış Yap");
	  
			break;
		case 4:
			$(".main_container_login").css("display", "none");
			$(".main_menu_outer_div").css("display", "none");
			$(".main_page_4").css("display", "");
			$(".fixed_menu_buttons_left:eq(0)").attr("onclick","signoutfirebase()");
			$(".fixed_menu_buttons_left:eq(0)").text("Çıkış Yap");
	  
			break;
	}
	
}


var ismenuopen = false;
	var is_mobile_phone = ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) ? true : false;
	function goMainPage() {
		var url = window.location.href;
		var result = url.indexOf(".com") + 4;
		window.open(url.slice(0, result), '_self');
		
	}
	
	function openLeftMenu() {
	$(".fixed_menu_all_buttons_cont").stop();
	$(".menu_closer").stop();
	$('.fixed_menu_all_buttons_cont').animate(
		{ left: ismenuopen ? -200 : 0 }, 200);
	if(ismenuopen) {
		$(".menu_closer").fadeOut(200);
		$(".menu_opener").addClass('fa-bars');
		$(".menu_opener").addClass('fa');
		
		$(".menu_opener").removeClass('fa-regular');
		$(".menu_opener").removeClass('fa-solid');
		$(".menu_opener").removeClass('fa-xmark');
		
		$("html body").css("overflow-y", "auto");
		if(!is_mobile_phone) {
			$(".main_div").css("width", "100%");
			$(".fixed_menu_right_cont").css("width", parseInt($( ".fixed_menu_right_cont" ).width()) - 14);
		}
		//console.log(is_mobile_phone);
	}
	else {
		$(".menu_closer").fadeIn(200);
		$(".menu_opener").removeClass('fa-bars');
		$(".menu_opener").removeClass('fa');
		
		$(".menu_opener").addClass('fa-regular');
		$(".menu_opener").addClass('fa-solid');
		$(".menu_opener").addClass('fa-xmark');
		
		$("html body").css("overflow-y", "hidden");
		if(!is_mobile_phone) {
			$(".main_div").css("width", "calc(100% - 14px)");
			$(".fixed_menu_right_cont").css("width", parseInt($( ".fixed_menu_right_cont" ).width()) + 14.5);
		}
	}
	//fa-regular fa-solid fa-xmark

	ismenuopen = !ismenuopen;

	//overflow: hidden;
}

function deleteCookie(cookieName) {
    document.cookie = cookieName + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function readCookie(cookieName) {
    var name = cookieName + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
