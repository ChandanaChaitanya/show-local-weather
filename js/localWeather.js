var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var cityFlag = false;
var city = "";
var latitude = "";
var longitude = "";
var temperature;

var skycons = new Skycons({"color": "black"});
//For information on icon id and description visit, http://openweathermap.org/weather-conditions
var Icons = {
    "01d": { bg :"./images/01d_ClearSkyM.jpg",
            icn : Skycons.CLEAR_DAY},
    "02d": { bg : "./images/02d_FewCloudsM.jpg",
           icn : Skycons.PARTLY_CLOUDY_DAY },
    "03d": { bg :"./images/03d_ScatteredCloudsM.jpg",
           icn :Skycons.PARTLY_CLOUDY_DAY },
    "04d": { bg :"./images/04d_BrokenCloudsM.jpg",
            icn :Skycons.CLOUDY },
    "09d": { bg : "./images/09d_ShowerRainM.jpg",
           icn :Skycons.RAIN },
    "10d": { bg : "./images/10d_RainM.jpg",
           icn :Skycons.RAIN },
    "11d": { bg : "./images/11d_ThunderstormM.jpg",
            icn :Skycons.SLEET },
    "13d": { bg : "./images/13d_SnowM.jpg",
           icn :Skycons.SNOW },
    "50d": { bg: "./images/50d_MistM.jpg",
            icn :Skycons.FOG },
    "01n": { bg: "./images/01n_ClearSkyN.jpg",
            icn :Skycons.CLEAR_NIGHT },
    "02n": { bg: "./images/02n_FewCloudsN.jpg",
            icn :Skycons.PARTLY_CLOUDY_NIGHT },
    "03n": { bg: "./images/03n_ScatteredCloudsN.jpg",
            icn :Skycons.PARTLY_CLOUDY_NIGHT },
    "04n": { bg: "./images/04d_BrokenCloudsN.jpg",
            icn :Skycons.CLOUDY },
    "09n": { bg : "./images/09n_ShowerRainN.jpg",
           icn : Skycons.RAIN },
    "10n":{ bg : "./images/10n_RainN.jpg",
           icn : Skycons.RAIN },
    "11n": { bg : "./images/11d_ThunderstormN.jpg",
            icn :Skycons.SLEET },
    "13n": { bg :"./images/13n_SnowN.jpg",
            icn :Skycons.SNOW },
    "50n":{ bg: "./images/50n_MistN.jpg",
           icn :Skycons.FOG }
  };

//Display date in format: "Thursday, 9, Apr"
var curDate = $("#date").html(curDate());
//get current date
 function curDate(){
    var d = new Date();
    dd = d.getDay();
    mm = d.getMonth();
    day = d.getDate();
	//year = d.getFullYear();
  //  return (days[dd] + ", " +months[mm] + " " + day + ", " + year);
	return (days[dd] + ", " + day + ", " + months[mm]);
}

//Get the URL
function getURL(){
	//using latitude and longitude information
	if(!cityFlag){
		return 'http://api.openweathermap.org/data/2.5/weather?lat='+latitude+'&lon='+longitude+'&appid=1535f0d263ffc6599e272fd9c9c78f87';
	}else if(cityFlag){
		return 'http://api.openweathermap.org/data/2.5/weather?q='+city+'&appid=1535f0d263ffc6599e272fd9c9c78f87';
	}else {
		return 'http://api.openweathermap.org/data/2.5/weather?lat=0&lon=0&appid=1535f0d263ffc6599e272fd9c9c78f87';
	}
}

	$.ajax({
		url:'http://ipinfo.io',
		dataType: 'json',
		success: function(data) {
			var coords = data.loc.split(",");
			latitude = coords[0];
			longitude = coords[1];
			getWeather();
		},
		error: function(err) { 
		getGeoipLoc();
		}
	});	
//trying another method to locate
function getGeoipLoc(){
	$.ajax({
		url:'https://geoip-db.com/json/geoip.php?jsonp=?',
		dataType: 'json',
		success: function(data) {
			latitude = data.latitude;
			longitude = data.longitude;
			getWeather();
		},
		error: function(err) { 
			$("#getLocation").html("Unable to find location :(");
		}
	});	
}
	
//Obtains and displays all weather information to the webpage
function getWeather() {
  $.ajax({url: getURL(), 
  dataType: 'json', 
  success: function(data){
	//converting temperature from kelvin to celcius
	temperature = data.main.temp - 273.15;
	$("#getTemp").html(Math.floor(temperature) + " &#8451"); 
//    $("#getTemp").html(Math.floor(temperature) + " &#176"); 
	$("#getLocation").html(data.name + ", " +data.sys.country);	
	$("#getCondition").html(data.weather[0].description);
	var degreeVal = $(this).find("unit-button").val();
	if (degreeVal != "F"){
		$("#celcius").hide(); 
		$("#farenheit").show();
	}else {
		$("#celcius").show();
		$("#farenheit").hide();
	}
	var icon = data.weather[0].icon;
	console.log(icon);
	setBackground(icon);
	skycons.set("getIcon",Icons[icon].icn);
  },
  error: function(error){
	console.log("Error in getting weather information");
  }
});
}
skycons.play(); 

function setBackground(icon) {
  $(".bg").css({
  'background': 'url('+ Icons[icon].bg +') no-repeat center center fixed', 'background-size': 'cover'
  });
}

//To display weather information upon clicking twitter icon
$("#getTweet").on("click", displayTweet);

function displayTweet(){
	var locationVal = $("#getLocation").text();
	var tempCelcius = $("#getTemp").text();
	var dateVal = $("#date").text();
	
	var tweetText = "Weather at " +locationVal+ " is " 
					+ tempCelcius + " on " + dateVal ;	
	var tweetLink = "https://twitter.com/intent/tweet?hashtags=weather&text=" + encodeURIComponent(tweetText);

	$(".twitterLink").attr("href", tweetLink);
}

//To get weather based on the entered city name
$("#cityInfo").on("click", getCityWeather)

function getCityWeather() {
  city = $("#cityText").val();
  cityFlag = true;
  getWeather();
}

//Temperature display as per chosen scale
	$('#celcius').click(function(){
	$("#getTemp").html(Math.floor(temperature)+ " &#8451");
	$("#celcius").hide();
	$("#farenheit").show();
});

	$('#farenheit').click(function(){
	$("#getTemp").html(Math.floor((1.8 *temperature)+32) + " &#8457");
	$("#farenheit").hide();
	$("#celcius").show();
});


