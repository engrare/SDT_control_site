//Copyright 2025 Kaya Sertel & ENGRARE®. All Rights Reserved.
var spd_opts = { //https://bernii.github.io/gauge.js/
	  angle: -0.17, // The span of the gauge arc
	  lineWidth: 0.19, // The line thickness
	  radiusScale: 0.97, // Relative radius
	  staticLabels: {
		  font: "13px sans-serif",  // Specifies font
		  labels: [0, 5, 10, 15, 20, 25, 30],  // Print labels at these values
		  color: "#000000",  // Optional: Label text color
		  fractionDigits: 0  // Optional: Numerical precision. 0=round off.
	  },
	  pointer: {
		length: 0.56, // // Relative to gauge radius
		strokeWidth: 0.068, // The thickness
		color: '#000000' // Fill color
	  },
	  limitMax: false,     // If false, max value increases automatically if value > maxValue
	  limitMin: false,     // If true, the min value of the gauge will be fixed
	  colorStart: '#6FADCF',   // Colors
	  colorStop: '#8FC0DA',    // just experiment with them
	  strokeColor: '#E0E0E0',  // to see which ones work best for you
	  generateGradient: true,
	  highDpiSupport: true,     // High resolution support
	  // renderTicks is Optional
	  renderTicks: {
		divisions: 6,
		divWidth: 2.4,
		divLength: 0.67,
		divColor: '#333333',
		subDivisions: 5,
		subLength: 0.62,
		subWidth: 1,
		subColor: '#666666'
	  }
	  
	};
	
	var power_opts = {
  angle: -0.2, // The span of the gauge arc
  lineWidth: 0.2, // The line thickness
  radiusScale: 0.97, // Relative radius
  pointer: {
    length: 0.56, // // Relative to gauge radius
    strokeWidth: 0.075, // The thickness
    color: '#aaedf6' // Fill color
  },
  staticLabels: {
	  font: "13px sans-serif",  // Specifies font
	  labels: [0, 20, 40, 60, 80, 100],  // Print labels at these values
	  color: "#000000",  // Optional: Label text color
	  fractionDigits: 0  // Optional: Numerical precision. 0=round off.
  },
  limitMax: false,     // If false, max value increases automatically if value > maxValue
  limitMin: false,     // If true, the min value of the gauge will be fixed
  colorStart: '#6F6EA0',   // Colors
  colorStop: '#C0C0DB',    // just experiment with them
  strokeColor: '#ffffff00',  // to see which ones work best for you
  staticZones: [
   {strokeStyle: "#dd3232", min: 0, max: 20}, // Red from 100 to 130
   {strokeStyle: "#FFDD00", min: 20, max: 40}, // Yellow
   {strokeStyle: "#30B32D", min: 40, max: 60}, // Green
   {strokeStyle: "#30B32D", min: 60, max: 80}, // Yellow
   {strokeStyle: "#30B32D", min: 80, max: 100}  // Red
],
  generateGradient: true,
  highDpiSupport: true,     // High resolution support
  // renderTicks is Optional
  renderTicks: {
    divisions: 5,
    divWidth: 2.4,
    divLength: 0.67,
    divColor: '#333333',
    subDivisions: 0,
    subLength: 0.62,
    subWidth: 1,
    subColor: '#666666'
  }
  
};

var is_login_ok = false;
var is_cookie_red = false;
var key_pressed = [false, false, false, false, false, false];
var key_pressed_lift = [false, false];
var mission_sec = 224;
var target_spd;
var gauge_spd;
var target_pwr;
var gauge_pwr;
var selected_msn = [1, 1];
var is_html_loaded = false;

var set_spd = 80;
var logincookiename = "logincookie";

function fetchWebsiteData(apiKey) {
fetch('https://raw.githubusercontent.com/eylulberil/encoded_key/main/keys.json')
  .then(response => response.json())
  .then(myObj => {
	encrypted_key = myObj[0];
	console.log(encrypted_key);
	
  })
  .catch(error => {
    console.log('Error:', error);
  });
}



function decodeBase64(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return new TextDecoder('utf-8').decode(bytes);
}

async function fetchFile() {
	const repoOwner = 'engrare';
	const repoName = 'SDT_priv';
	const filePath = 'index.html';
	const github_api = await readData("github-api");
	
    try {
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
            headers: { Authorization: `Bearer ${github_api}` },
        });
        if (!response.ok) throw new Error(`GitHub API hatası: ${response.statusText}`);
        const data = await response.json();
        return decodeBase64(data.content);
    } catch (error) {
        console.error(`Hata (${filePath}):`, error);
        return null;
    }
}

async function replaceHtmlWithUpdatedContent() {
    try {
        const htmlContent = await fetchFile();
        if (!htmlContent) {
            throw new Error("Dosya yüklenemedi.");
			return false;
        }
        console.log(htmlContent);
		
        $("#placeholder").html(htmlContent);
		openPage(1);
		target_spd = document.getElementById('speed_meter_gauge');
		gauge_spd = new Gauge(target_spd).setOptions(spd_opts);
		gauge_spd.maxValue = 30;
		gauge_spd.setMinValue(0);
		gauge_spd.animationSpeed = 24;
		gauge_spd.set(0);
		
		
		target_pwr = document.getElementById('power_meter_gauge');
		gauge_pwr = new Gauge(target_pwr).setOptions(power_opts);
		gauge_pwr.maxValue = 100;
		gauge_pwr.setMinValue(0);
		gauge_pwr.animationSpeed = 24;
		gauge_pwr.set(0);
		startObserving();
		setInterval(writeScreenData, 2000);
        console.log("HTML eklendi.");
		return true;
    } catch (error) {
		return false;
        console.error("Bir hata oluştu:", error);
    }
}



	
$(document).ready(function() {
	//openPage(1);
		
	
	
	$("#speedSlider").on("input change", function() {
		$("#speedValue").text($(this).val());
	});
	
		$(document).keydown(function(event) {
			var key = event.key;
			buttonStateChanged(key, true);
		});

		$(document).keyup(function(event) {
			var key = event.key;
			buttonStateChanged(key, false);
		});
	
	if(is_cookie_red == false) {
		logininfo = readCookie(logincookiename);
		is_cookie_red = true;
	}
	
	if(logininfo != "") {
		const parts = logininfo.split(/\|/);
		console.log(parts);

		logintofirebase(parts[0], parts[1]);
	}
	
});

let observer1, observer2;

function startObserving() {
    var element1 = document.getElementById('main_right_top_div_ID');
    var element2 = document.getElementById('main_left_div_ID');

    if (element1 && !observer1) {
        observer1 = new ResizeObserver(function(entries) {
            entries.forEach(function(entry) {
                var width = entry.contentRect.width;
                var height = entry.contentRect.height;
                $(".main_right_bottom_div").height($(".main_div").height() - $(".main_right_top_div").height() - 120);
            });
        });
        observer1.observe(element1);
        console.log("Observer 1 başlatıldı");
    }

    if (element2 && !observer2) {
        observer2 = new ResizeObserver(function(entries) {
            entries.forEach(function(entry) {
                var width = entry.contentRect.width;
                var height = entry.contentRect.height;
                $(".main_right_div").width($(".main_div").width() - $(".main_left_div").width());
            });
        });
        observer2.observe(element2);
        console.log("Observer 2 başlatıldı");
    }
}



function buttonStateChanged(key, bool_btn_state) {
	
	if(bool_btn_state) {
		if(key == 'q' && !key_pressed[0]) {
			//console.log("turning right");
			$(".manuel_control_turn_btn:not(:eq(0))").css("background", "black");
			$(".manuel_control_turn_btn:eq(0)").css("background", "#3d3d3d");
			moveRobot(-set_spd, set_spd);
			key_pressed[0] = true;
		} else if(key == 'e' && !key_pressed[1]) {
			//console.log("turning left");
			$(".manuel_control_turn_btn:not(:eq(1))").css("background", "black");
			$(".manuel_control_turn_btn:eq(1)").css("background", "#3d3d3d");
			moveRobot(set_spd, -set_spd);
			key_pressed[1] = true;
		} else	if(key == 'w' && !key_pressed[2]) {
			//console.log("going forward");
			$(".manuel_control_turn_btn:not(:eq(2))").css("background", "black");
			$(".manuel_control_turn_btn:eq(2)").css("background", "#3d3d3d");
			moveRobot(set_spd, set_spd);
			key_pressed[2] = true;
		} else	if(key == 'a' && !key_pressed[3]) {
			//console.log("going left");
			$(".manuel_control_turn_btn:not(:eq(3))").css("background", "black");
			$(".manuel_control_turn_btn:eq(3)").css("background", "#3d3d3d");
			moveRobot(set_spd/2, set_spd);
			key_pressed[3] = true;
		} else if(key == 'd' && !key_pressed[4]) {
			//console.log("going backward");
			$(".manuel_control_turn_btn:not(:eq(4))").css("background", "black");
			$(".manuel_control_turn_btn:eq(4)").css("background", "#3d3d3d");
			moveRobot(set_spd, set_spd/2);
			key_pressed[4] = true;
		} else if(key == 's' && !key_pressed[5]) {
			//console.log("going right");
			$(".manuel_control_turn_btn:not(:eq(5))").css("background", "black");
			$(".manuel_control_turn_btn:eq(5)").css("background", "#3d3d3d");
			moveRobot(-set_spd, -set_spd);
			key_pressed[5] = true;
		}
		
		if(key == 'r' && !key_pressed_lift[0]) {
			$(".manuel_control_turn_btn:not(:eq(6))").css("background", "black");
			$(".manuel_control_turn_btn:eq(6)").css("background", "#3d3d3d");
			moveLift(100);
			key_pressed_lift[0] = false;
		} else if(key == 'f' && !key_pressed_lift[1]) {
			$(".manuel_control_turn_btn:not(:eq(7))").css("background", "black");
			$(".manuel_control_turn_btn:eq(7)").css("background", "#3d3d3d");
			moveLift(-100);
			key_pressed_lift[1] = false;
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
		
		if(key == 'r') {
			if(key_pressed_lift[1]) {
				moveLift(-100);
			} else {
				moveLift(0);
			}
			key_pressed_lift[0] = false;
			$(".manuel_control_turn_btn:eq(6)").css("background", "black");
		} else if(key == 'f') {
			if(key_pressed_lift[0]) {
				moveLift(100);
			} else {
				moveLift(0);
			}
			key_pressed_lift[1] = false;
			$(".manuel_control_turn_btn:eq(7)").css("background", "black");
		}
		
		if(is_related) {
			let i = key_pressed.length;
			while(i--) {
				if(key_pressed[i]){
					break;
				} else if(i == 0) {
					moveRobot(0, 0); //stop
				}
			}
		}
	}
}

async function mapping() {
	console.log("mapping e bastın.");
	//writeData("manuel_data", "deger");
}

async function stopMission() {
	console.log("stop a bastın.");
	//writeData("manuel_data", "deger");
}

async function startMission() {
	console.log("start a bastın.");
	if(is_login_ok)
		writeData("otonomus_data", "1|34|25|9|27");
}

async function openCloseLED() {
	console.log("LED e bastın.");
	if(is_login_ok) {
		var red_data = await readData("SDTdata/client/led");
		writeData("led", !red_data);
	}
}

async function openCloseBuzzer() {
	console.log("Buzzer a bastın.");
	if(is_login_ok) {
		var red_data = await readData("SDTdata/client/buzzer");
		writeData("buzzer", !red_data);
	}
}

async function openClosePower() {
	console.log("Power a bastın.");
	if(is_login_ok) {
		var red_data = await readData("SDTdata/client/main_power");
		writeData("main_power", !red_data);
	}
}

async function selectScenario(scenario_type, mapping_or_weight) {
	console.log("senerioya a bastın.");
	$(".scenario_selector_div").removeClass("scenario_selector_div_selected");
	$(".scenario_selector_div:eq(" + (mapping_or_weight == 1 ? scenario_type - 1 : scenario_type + 3) + ")").addClass("scenario_selector_div_selected");
	if(is_login_ok) {
		//var red_data = await readData("SDTdata/client/main_power");
		//writeData("main_power", !red_data);
	}
}

function moveRobot(left_spd, right_spd) {
	var manuel_data_str = left_spd + "|" + right_spd;
	if(is_login_ok)
		writeData("manuel_data", manuel_data_str);
}

function moveLift(lift_spd) {
	if(is_login_ok)
		writeData("lift_data", lift_spd);
}

function openPageRequest(pagenum) {
	if(is_login_ok) {
		openPage(pagenum);
	} else {
		openPage(0);
	}
}

async function writeScreenData() {
	if(is_login_ok) {//if(is_login_ok && await checkUserOnline("")) {
		mission_sec++;
		var red_data = await readData("SDTdata/robot1");
		//var states[7] = {"Hazır Değil", "Beklemede", "Arıza", "Manuel", "Haritalandırma", "Yük Taşıma", "Şarj"};
		if (red_data) {
			$(".div_charge_bar_inner").css("width", red_data.battery_percent + "%");
			$(".battery_power_perc").text(red_data.battery_percent + "%");
			$(".text_data_value_text:eq(0)").text("Bağlı");
			$(".text_data_value_text:eq(1)").text(red_data.state);
			$(".text_data_value_text:eq(2)").text(Math.floor(mission_sec / 60).toString().padStart(2, '0') + ":" + (mission_sec % 60).toString().padStart(2, '0'));
			$(".text_data_value_text:eq(3)").text(red_data.temp + "°C");
			$(".text_data_value_text:eq(4)").text(red_data.battery_current + " Amper");
			$(".text_data_value_text:eq(5)").text(red_data.battery_voltage + " Volt");
			$(".text_data_value_text:eq(6)").text(red_data.weight + " kg");
			const str = red_data.qr_data;
			const numbers = str.split('|').filter(Boolean);
			const lastNumber = numbers[numbers.length - 1];
			$(".text_data_value_text:eq(7)").text(lastNumber);
			
			gauge_spd.set((red_data.speed_left + red_data.speed_right) / 2);
			gauge_pwr.set(red_data.battery_percent);
			//console.log("Okunan veri:", red_data);
		} else {
			console.log("Veri okunamadı.");
		}
	} else {
		$(".text_data_value_text:not(:eq(0))").text("-");
		$(".text_data_value_text:eq(0)").text("Bağlı Değil");
		
		gauge_spd.set(0);
		gauge_pwr.set(0);
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
			$(".fixed_menu_buttons_left").removeClass("fixed_menu_button_selected");
			$(".fixed_menu_buttons_left:eq(2)").addClass("fixed_menu_button_selected");
			
			$(".fixed_menu_buttons_left:eq(0)").attr("onclick","signoutfirebase()");
			$(".fixed_menu_buttons_left:eq(0) > p").text("Çıkış Yap");
	  
			break;
		case 3:
			$(".main_container_login").css("display", "none");
			$(".main_menu_outer_div").css("display", "none");
			$(".main_page_3").css("display", "");
			$(".fixed_menu_buttons_left").removeClass("fixed_menu_button_selected");
			$(".fixed_menu_buttons_left:eq(3)").addClass("fixed_menu_button_selected");
			$(".fixed_menu_buttons_left:eq(0)").attr("onclick","signoutfirebase()");
			$(".fixed_menu_buttons_left:eq(0)").text("Çıkış Yap");
	  
			break;
		case 4:
			$(".main_container_login").css("display", "none");
			$(".main_menu_outer_div").css("display", "none");
			$(".main_page_4").css("display", "");
			$(".fixed_menu_buttons_left").removeClass("fixed_menu_button_selected");
			$(".fixed_menu_buttons_left:eq(4)").addClass("fixed_menu_button_selected");
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
