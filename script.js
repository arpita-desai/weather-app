$(document).ready(function(){

//For button click event, get the city from here
$("#searchBtn").on("click", function(){
    var searchCity = $("#searchCity").val().toUpperCase();
    $("#searchCity").val("");
    searchWeather(searchCity);
});

$("#resetBtn").on("click", function(e){
    e.preventDefault();
    $("#today").empty();
    $("#forecast").empty();
    localStorage.removeItem("cityList");
});

function createRow(text){
    var list = $("<li>").addClass("list-group-item list-group-item-action").text(text);
    $(".cities").append(list);
}

$(".cities").on("click", "li", function(){
    searchWeather($(this).text());
});


function searchWeather(searchCity){
    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&appid=95af7924bf5f9e3f588e6be9da8f43cd",
        method: "GET",
       
    }).then( function(data){
        
        if(cityList.indexOf(searchCity) === -1){
             cityList.push(searchCity);
             localStorage.setItem("cityList", JSON.stringify(cityList));
             createRow(searchCity);
         }
        $("#today").empty();

        var title = $("<h3>").addClass("card-title").text(data.name + "-" + new Date().toLocaleDateString());
        var card = $("<div>").addClass("card");
        var wind = $("<p>").addClass("card-text").text("Wind Speed:" + data.wind.speed + " MPH");
        var humid = $("<p>").addClass("card-text").text("Humidity:" + data.main.humidity + " %");
        var temp = $("<p>").addClass("card-text").text("Temperature:" + data.main.temp + " F");
        var cardBody = $("<div>").addClass("card-body");
        var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

        title.append(img);
        cardBody.append(title, temp, humid, wind);
        card.append(cardBody);
        $("#today").append(card);
        getForecast(searchCity);
        getUVIndex(data.coord.lat, data.coord.lon);
    });

}

function getForecast(searchCity){
    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/forecast?q=" + searchCity + "&appid=95af7924bf5f9e3f588e6be9da8f43cd",
        method: "GET",
    }).then(function(data){

        $("#forecast").html("<h3> 5-Days Weather Forecast </h3>").append("<div class=\"row\">");
        for (var i = 0; i < data.list.length; i++) {
            
            if(data.list[i].dt_txt.indexOf("12:00:00") !== -1){
            
            var col = $("<div>").addClass("col-md-2");
            var card = $("<div>").addClass("card bg-primary text-white");
            var body = $("<div>").addClass("card-body p-2");
            var title = $("<h3>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
            var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
            var t = $("<p>").addClass("card-text").text("Temp: " + data.list[i].main.temp_max + "f");
            var h = $("<p>").addClass("card-text").text("Humidity " + data.list[i].main.humidity + "%");

            col.append(card.append(body.append(title, img, t, h)));
            $("#forecast .row").append(col);

            }

        }

    });
    
}
  
function getUVIndex(lat, lon){

$.ajax({
    url: "http://api.openweathermap.org/data/2.5/uvi?appid=95af7924bf5f9e3f588e6be9da8f43cd&lat=" + lat + "&lon=" + lon,
    method: "GET",
}).then(function(data){
    var uv = $("<p>").text("UV Index: ");
    var btn = $("<span>").addClass("btn btn-sm").text(data.value);

    if(data.value < 3){
        btn.addClass("btn-success");
    }else if(data.value < 7){
        btn.addClass("btn-warning");
    }else{
        btn.addClass("btn-danger");
    }
    $("#today .card-body").append(uv.append(btn));
});

}

var cityList = JSON.parse(localStorage.getItem("cityList")) || [];

if(cityList.length > 0){
    searchWeather(cityList[cityList.length-1]);
}

for(var i=0; i < cityList.length; i++){
    createRow(cityList[i]);
}

});


