var ChallengeClass = function () {
    var self = this;

    const REQUEST_URL = 'https://xavijam.carto.com/api/v2/sql?q=SELECT%20*%20FROM%20ne_10m_populated_places_simple&format=GeoJSON';

    const THEME_ELEMENT = 'theme';
    const POP_MAX = 'popMax';

    this.initialize = function () {
        self.getMapData(self.successCallback);
        var w = window.innerWidth;
        var h = window.innerHeight;
        document.getElementById("map").style.width = (w - 60) + "px";
        document.getElementById("map").style.height = h + "px";
    };

    this.getMapData = function (successCallback) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.addEventListener("load", successCallback);
        httpRequest.addEventListener("error", function () {
            window.location.href = window.location.href.replace("index", "404");
        });
        httpRequest.open("GET", REQUEST_URL);
        httpRequest.send(null);
    };

    this.successCallback = function (event) {
        var data = JSON.parse(event.target.responseText);
        Map.buildMap(data);
        self.initValues();
        self.addCitiesToSearcher();
    };
    this.initValues = function () {
        document.getElementById('weight').innerHTML = Map.default_style['weight'];
        document.getElementById('radius').innerHTML = Map.default_style['radius'];
        document.getElementById('fillOpacity').innerHTML = Map.default_style['fillOpacity'];
        document.getElementById('color').innerHTML = Map.default_style['color'];
        document.getElementById('fillColor').innerHTML = Map.default_style['fillColor'];

        document.getElementById('theme')[0].value = Map.default_theme;
        document.getElementsByClassName('input weight')[0].value = Map.default_style['weight'];
        document.getElementsByClassName('input radius')[0].value = Map.default_style['radius'];
        document.getElementsByClassName('input fillOpacity')[0].value = Map.default_style['fillOpacity'];
        document.getElementsByClassName('input color')[0].value = Map.default_style['color'];
        document.getElementsByClassName('input fillColor')[0].value = Map.default_style['fillColor'];
    };
    this.addCitiesToSearcher = function(){
        var parent = document.getElementsByClassName('cityList')[0];
        for (var item in Map.cityList) {
            var g = document.createElement('li');
            g.setAttribute("class",'city ' + item);
            g.setAttribute("onclick","Challenge.showPopup('" + item + "')");
            g.innerHTML = Map.cityList[item];
            parent.appendChild(g);
        }
    };

    /*INTERFACE FUNCTIONS*/
    this.toggleMenu = function () {
        var sandwich = document.getElementById('sandwichLines');
        var controls = document.getElementById('menu');
        sandwich.classList.toggle('close');
        controls.classList.toggle('collapsed');
    };
    this.switchSection = function (section) {
        self.resetChoroplethMap();
        var activeTab = document.getElementsByClassName("tab active")[0];
        var contentTab = document.getElementsByClassName("tabContent active")[0];

        if (!activeTab.classList.contains(section)) {
            var newActiveTab = document.getElementsByClassName("tab " + section)[0];
            var newContentTab = document.getElementsByClassName("tabContent " + section)[0];

            activeTab.classList.toggle('active');
            contentTab.classList.toggle('active');
            newActiveTab.classList.toggle('active');
            newContentTab.classList.toggle('active');
        }
    };
    this.showValue = function (element, value) {
        var style = {};
        if (element == THEME_ELEMENT) {
            Map.addTileLayer(value);
        } else {
            document.getElementById(element).innerHTML = value;
            style[element] = value;
            Map.restyleMap(style);
        }
    };
    this.resetToDefaultStyles = function(){
        self.initValues();
        Map.restyleMap(Map.default_style);
        Map.addTileLayer(Map.default_theme);
    };
    this.resetChoroplethMap = function () {
        Map.setPopulation(false);
        Map.setRange(false);
        Map.choropletMap();
    };
    this.activateChoroplethMap = function (element) {
        var value = document.getElementById(element).checked;
        if (element == POP_MAX) {
            Map.setPopulation(value);
        } else {
            Map.setRange(value);
        }
        Map.choropletMap();
    };

    this.cleanString = function (val) {
        return val.toLowerCase().replace(/[áàäâ]/, 'a').replace(/[éèëê]/, 'e').replace(/[íìïî]/, 'i').replace(/[óòöô]/, 'o').replace(/[úùüû]/, 'u').replace(/[ñÑ]/, 'n').replace(/[çÇ]/, 'c');
    };
    this.filterCitiesByName = function () {
        var name = self.cleanString(document.getElementById("inputSearch").value);
        if (name != "") {
            var totalToShow = 0;
            for (var item in Map.cityList) {
                var cleanName = self.cleanString(Map.cityList[item].toLowerCase().replace(/^\s+|\s+$/, ""));
                var itemList = document.getElementsByClassName(item)[0];
                if (itemList != undefined) {
                    if (cleanName.indexOf(name) != -1) {
                        itemList.classList.add('show');
                        totalToShow++;
                    } else {
                        itemList.classList.remove('show');
                    }
                }
            }
            if (totalToShow > 0) {
                document.getElementsByClassName("cityList")[0].classList.add('show');
            } else {
                document.getElementsByClassName("cityList")[0].classList.remove('show');
            }
        }
    };

    this.showPopup = function (item) {
        Map.popUpMarker(item);
    };

    this.initialize();

    return this;
};

var Challenge = new ChallengeClass();