/*
 Plugin Tabs
 Data: 28/04/2013
 Autor: Renalcio Carlos
 Email: r.carlos@live.com
 Versão: 1.0
 Opções:
 -- funcao:
 Tabula um conteudo com XHTML ou HTML
 */
(function($){
    $.fn.weatherbox = function(options){
        // configurações padrão
        var config = {
            city: "Sumaré - SP",
            animate: true,
            lang: "pt"
        };
        options = $.extend(config,options);
        return this.each(function(){

            $obj = $(this);

            var today_day = '';
            var icon_type_today = icon_type_1 = icon_type_2 = icon_type_3 = icon_type_4 = "partly-cloudy-day";

            var langs = {
                    "pt" : {
                        "day" : [
                            "Dom",
                            "Seg",
                            "Ter",
                            "Qua",
                            "Qui",
                            "Sex",
                            "Sab"
                        ],
                        "search" : "Buscar cidade..."
                    },
                    "en" : {
                        "day" : [
                            "Sun",
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat"
                        ],
                        "search": "Search..."
                    }
                },
                numero = [
                    "",
                    "one",
                    "two",
                    "three",
                    "four"
                ],
                icones = {
                    "01d" : "clear-day",
                    "01n" : "clear-night",
                    "02d" : "partly-cloudy-day",
                    "02n" : "partly-cloudy-night",
                    "03d" : "cloudy",
                    "03n" : "cloudy",
                    "04d" : "cloudy",
                    "04n" : "cloudy",
                    "09d" : "rain",
                    "09n" : "rain",
                    "10d" : "sleet",
                    "10n" : "sleet",
                    "11d" : "sleet",
                    "11n" : "sleet",
                    "13d" : "snow",
                    "13n" : "snow",
                    "50d" : "wind",
                    "50n" : "wind"
                },
                icons = new Skycons(),
                list = [
                    "clear-day",
                    "clear-night",
                    "partly-cloudy-day",
                    "partly-cloudy-night",
                    "cloudy",
                    "rain",
                    "sleet",
                    "snow",
                    "wind",
                    "fog"
                ],
                ApiUrl = "http://api.openweathermap.org/data/2.5/weather?q="+options.city+"&APPID=6e01f258d5b031c3140eb7b18c4fb928&units=metric&lang="+options.lang;

            var dia = langs["en"]["day"],
                search = langs["en"]["search"];
            if(langs[options.lang]) {
                dia = langs[options.lang]["day"];
                search = langs[options.lang]["search"];
            }


            var weatherWidget = '<div class="panel-header background-primary"><h3><i class="icon-30"></i> <strong>Clima</strong></h3></div><div class="weather panel-content" class="widget-container widget-weather boxed"><div class="weather-highlighted">';
            weatherWidget += '<div class="day-0 weather-item clearfix active"><canvas id="day-0-icon" class="m-t-15" width="64" height="64"></canvas><div class="inner"><strong class="today-temp-low"></strong><span class="weather-currently"></span><span class="today-temp"></span></div></div>';
            weatherWidget += '<div class="day-1 weather-item clearfix"><canvas id="day-1-icon" class="m-t-15" width="64" height="64"></canvas><div class="inner"><strong class="1-days-temp-low"></strong><span class="one-days-text"></span><span class="1-days-temp"></span></div></div>';
            weatherWidget += '<div class="day-2 weather-item clearfix"><canvas id="day-2-icon" class="m-t-15" width="64" height="64"></canvas><div class="inner"><strong class="2-days-temp-low"></strong><span class="two-days-text"></span><span class="2-days-temp"></span></div></div>';
            weatherWidget += '<div class="day-3 weather-item clearfix"><canvas id="day-3-icon" class="m-t-15" width="64" height="64"></canvas><div class="inner"><strong class="3-days-temp-low"></strong><span class="three-days-text"></span><span class="3-days-temp"></span></div></div>';
            weatherWidget += '<div class="day-4 weather-item clearfix"><canvas id="day-4-icon" class="m-t-15" width="64" height="64"></canvas><div class="inner"><strong class="4-days-temp-low"></strong><span class="four-days-text"></span><span class="4-days-temp"></span></div></div>';
            weatherWidget += '</div><div class="weather-location clearfix"><strong></strong>';
            weatherWidget += '<div class="weather-search-form"><input type="text" name="search2" value="" id="city-form" class="weather-search-field" placeholder="'+search+'"><input type="submit" value="" class="btn weather-search-submit" name="search-send2"></div></div><ul class="weather-forecast clearfix">';
            weatherWidget += '<li class="first"><a id="day-0" class="today-day active" href="javascript:;"><strong>dd</strong><span class="today-img"></span><span class="today-temp-low"></span></a></li>';
            weatherWidget += '<li><a id="day-1" class="1-days-day" href="javascript:;"><strong></strong><span class="1-days-image"></span><span class="1-days-temp-low"></span></a></li>';
            weatherWidget += '<li><a id="day-2" class="2-days-day" href="javascript:;"><strong></strong><span class="2-days-image"></span><span class="2-days-temp-low"></span></a></li>';
            weatherWidget += '<li><a id="day-3" href="javascript:;" class="3-days-day"><strong></strong><span class="3-days-image"></span><span class="3-days-temp-low"></span></a></li>';
            weatherWidget += '<li class="last"><a id="day-4" href="javascript:;" class="4-days-day"><strong></strong><span class="4-days-image"></span><span class="4-days-temp-low"></span></a></li></ul></div>';

            //$(this).html('');
            $(this).html(weatherWidget);
            $(this).height($(this).find('.panel-header').height() + $(this).find('.weather').height() + 80);
            $(this).find('.weather').height($(this).find('.weather').height() + 90);

            // Weather
            $obj.find('.weather-forecast li a').on('click', function () {
                var day = $(this).attr('id');
                $obj.find('.weather-forecast li a, .weather-item').removeClass('active');
                $(this).addClass('active');
                $obj.find('.weather-item.' + day).addClass('active');
            });

            for(var i = 0; i == list.length; i++) {
                icons.set(list[i], list[i]);
            }

            $.ajax({
                type: "get",
                enctype: 'multipart/form-data',
                contentType: false,
                processData: false,
                url: ApiUrl
            }).done(function(data){
                //console.log(data);
                //Cidade
                $(".weather-location strong").html(data.name);
                //Frase da Temperatura
                $(".weather-currently").html(data.weather[0].description);
                //Temperatura
                $(".today-temp-low").html(data.main.temp.toMoney(0, "", "") + '°');
                //Min Max
                $(".today-temp").html(data.main.temp_min.toMoney(0, "", "") + '° / ' + data.main.temp_max.toMoney(0, "", "") + '°');
                //Forecast
                var APIForecast = "http://api.openweathermap.org/data/2.5/forecast/daily?lat="+data.coord.lat+"&lon="+data.coord.lon+"&cnt=10&mode=json&APPID=6e01f258d5b031c3140eb7b18c4fb928&units=metric&lang="+options.lang;
                $.ajax({
                    type: "get",
                    enctype: 'multipart/form-data',
                    contentType: false,
                    processData: false,
                    url: APIForecast
                }).done(function(fore){

                    var weather_description = new Array();

                    var i = 0;
                    while(i <= 5){

                        sysdt = new Date(fore.list[i].dt * 1000);

                        var strIcone = icones[fore.list[i].weather[0].icon];
                        var codeIcone = 31;
                        switch(strIcone){
                            case "snow":
                                codeIcone = 13;
                                break;
                            case "cloudy":
                                codeIcone = 25;
                                break;
                            case "rain":
                                codeIcone = 5;
                                break;
                            case "partly-cloudy-day":
                                codeIcone = 30;
                                break;
                            case "partly-cloudy-night":
                                codeIcone = 29;
                                break;
                            case "wind":
                                codeIcone = 24;
                                break;
                            case "sleet":
                                codeIcone = 18;
                                break;
                            default:
                                codeIcone = 31;
                                break;
                        }

                        //Dia
                        //$(".today-day strong").html(sysdt.getDate()+ " de "+ month[sysdt.getMonth()] + " / " + sysdt.);
                        if(i == 0) {
                            //Hoje
                            $(".today-day strong").html(dia[sysdt.getDay()]);
                            $(".today-img").html('<i class="big-img-weather icon-' + codeIcone + '"></i>');
                        }else {
                            //Dias da Semana
                            $("." + i + "-days-day strong").html(dia[sysdt.getDay()]);
                            $("." + numero[i] + "-days-text").html(fore.list[i].weather[0].description);
                            $("." + i + "-days-image").html('<i class="icon-' + codeIcone + '"></i>');
                            $("." + i + "-days-temp-low").html(fore.list[i].temp.eve.toMoney(0, "", "") + '°');
                            $("." + i + "-days-temp").html(fore.list[i].temp.min.toMoney(0, "", "") + '° / ' + fore.list[i].temp.max.toMoney(0, "", "") + '°');
                        }
                        icons.set("day-" + i + "-icon", strIcone);
                        i++;
                    }
                    if(options.animate) {
                        icons.play();
                    }
                });
            });

            /* We get city from input on change */

            $("#city-form", this).change(function (e) {
                e.preventDefault;
                cidade = $(this).val();
                options.city = cidade;
                console.log(options);
                $obj.weatherbox(options);
            });

            $(window).resize(function () {
                setTimeout(function () {
                    $obj.height($obj.find('.panel-header').height() + $obj.find('.weather').height() + 12);
                }, 100);
            });
        });
    };
})(jQuery);

//Converter Para Dinheiro (Casas, Símbolo Decimal, Símbolo de Milhar)
Number.prototype.toMoney = function (c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};