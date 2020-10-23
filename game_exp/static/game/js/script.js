//initial conditions from database
var userscore = 0;
var resources = { gold: 3000 };
var round = 1;

var bodyStyles = window.getComputedStyle(document.body);
var gamestate = 1;
var cavemarker = true;
var keepmarker2 = true;
var directionsService;
var marker = [];
var polyLine = [];
var poly2 = [];
var startLocation = [];
var endLocation = [];
var timerHandle = [];
var infoWindow = null;
var selected_id = 1;
var startLoc = [];
var endLoc = [];
var lastVertex = 1;
var step = 50;
var eol = [];
var map;
const keeplatlog = { lat: 30.330545304396807, lng: -97.69209468498084 };
const cave1latlog = { lat: 30.34707066622668, lng: -97.61333359466332 };
var towerurl = document.getElementById("towersrc").src;
var flagurl = document.getElementById("flagsrc").src; //enemy image
var caveurl = document.getElementById("cavesrc").src;
var goblin1url = document.getElementById("goblin1src").src; //death picture
var goblin2url = document.getElementById("goblin2src").src; //damange picture
var keepurl = document.getElementById("keepsrc").src;
var explodeurl = document.getElementById("explodesrc").src;
var graveurl = document.getElementById("gravesrc").src;
var build_toggle = 0;
var console_toggle = 0;
var ccounter = 0;
var bcounter = 0;
var goldcost = 1000;
var stonecost = 0;
var foodcost = 0;
var selected_building = "wall";
var selected_building_src = "tower";
var placementz = 0;
var increment = 1;
var animateva = 1;
var buildingcount = { wall: 0, tower: 0, flag: 0 };
var unit = [];
var unitmarker = [];

var building_types = [
    {
        btype: "wall",
        cost: { gold: 500 },
        hp: 3,
    },
    {
        btype: "tower",
        cost: { gold: 1000 },
        hp: 5,
    },
    { btype: "flag", cost: { gold: 0 }, hp: 1 },
];

buildingobj = building_types.find((a) => a.btype == selected_building);

var buildings = [];
var units = [
    {
        utype: "goblin",
        x: 500,
        y: 200,
        z: 0,
        hp: 4,
        team: "enemy",
        speed: 1,
        attack: 1,
    },
];

function getcost(item) {
    goldcost = item.cost.gold;
}

function score(change) {
    userscore += change;
}

// This needs to be redone to ajax the gold
function checkcost() {
    return goldcost <= resources.gold;
}

function notify(note) {
    $("#consoletab p")
        .first()
        .append("<p>" + note + "</p>");
}

function spendresources() {
    resources.gold -= goldcost;
    notify("gold: -" + goldcost);
    updateResources();
}

function build(lat, lng, building_type) {
    for (var i = 0; i < building_types.length; i++) {
        if (building_types[i].btype == building_type) {
            getcost(building_types[i]);
            building_hp = building_types[i].hp;
            break;
        }
    }
    if (checkcost()) {
        buildings.push({
            lat: lat,
            lng: lng,
            type: building_type,
        });
        spendresources();
    } else {
        notify("Insufficient Resources");
    }
}

function displayBuildings() {
    var output = "";
    for (i = 0; i < buildings.length; i++) {
        output +=
            "<div class='building " +
            buildings[i].type +
            "' unitid='" +
            i +
            "' style='top: " +
            buildings[i].y +
            "px; left: " +
            buildings[i].x +
            "px; transform: rotate(" +
            buildings[i].z +
            "deg);'></div>";
    }
    document.getElementById("buildings").innerHTML = output;
    // console.log(output);
}

function displayUnits() {
    var output = "";
    increment++;
    if (increment % 10 == 0) {
        animateva = 1;
    } else if (increment % 5 == 0) {
        animateva = 2;
    }
    for (i = 0; i < units.length; i++) {
        output +=
            "<div class='unit " +
            units[i].utype +
            "' unitid='" +
            i +
            "' style='top: " +
            units[i].y +
            "px; left: " +
            units[i].x +
            "px; transform: rotate(" +
            (units[i].z - 90) +
            "deg); background-image: url( `static/game/img/goblin" +
            animateva +
            ".png`);'></div>";
    }
    document.getElementById("units").innerHTML = output;
    // console.log(output);
}

function ghost_building() {
    if (build_toggle == 1) {
        $("#prebuild").css("display", "block");
        $("#prebuild").css("background", "url(" + selected_building_src + ")");
        $("#prebuild").css("opacity", ".5");
        $("#prebuild").css("top", y - 25);
        $("#prebuild").css("left", x - 25);
        $("#prebuild").css("transform", "rotate(" + placementz + "deg)");
    } else {
        $("#prebuild").css("display", "none");
    }
}

function updateResources() {
    document.getElementById("resources").innerHTML =
        "<h3>Gold: " +
        resources.gold +
        " </h3><h3>Round: " +
        round +
        "</h3><h3> Score:" +
        userscore +
        "</h3>";
}

function getPos(e) {
    x = e.clientX;
    y = e.clientY;
}

$("#buildmenu").toggle();
$("#consoletab").toggle();

var pcounter = 1;
function gamepaused() {
    pcounter++;
    pause_toggle = pcounter % 2;
    if (pause_toggle != 1) {
        $("#menu").css("filter", "grayscale(50%)");
        clearInterval(gameLoop);
    } else {
        $("#menu").css("filter", "none");
        // setInterval(gameLoop, 1000);
    }
}

gamestage();

function gameLoop() {
    ghost_building();
    // updateMarkers();
    victorycheck();
}

function gameover() {
    clearInterval(gameLoop);
    gamestate = 0;
    $("#finalscore").append(userscore);
    $("#finalround").append(round - 1);
    $("#sneaky").css("display", "block");
    $("#map").css("filter", "grayscale(100%)");
    document.body.style.setProperty("--accent", "#4b4b4b");
    document.body.style.setProperty("--secbackground", "#4b4b4b");
    document.body.style.setProperty("--pribackground", "#4b4b4b");
    $("#menu").off("click");
    $("#build").off("click");
    $("#recenter").off("click");
    $("#littletab").off("click");
    map.setOptions({
        gestureHandling: "none",
        zoomControl: false,
    });
    updateScoreboard()
}

function victorycheck() {
    if (gamestate == 2) {
        updateMarkers();
        if (unit.length == 0) {
            //round complete, progress game
            notify("Round " + round + " Complete!");
            resources.gold += round * 100 + 1000;
            notify("Round bonus: " + (round * 100 + 1000) + " gold!");
            gamestate = 1;
            recalccave();
            round++;
            gamestage();
        }
    }
}

function gamestage() {
    if (gamestate == 1) {
        build_toggle = 0;
        bcounter = 0;
        $("#menu").on("click", function (event) {
            for (var i = 0; i < unitmarker.length; i++) {
                unitmarker[i].setMap(null);
            }
            for (var i = 0; i < round * round; i++) {
                // spawns enemies for each round upping difficulty
                // add units to unit roster
                unit.push({
                    lat: cave1latlog.lat,
                    lng: cave1latlog.lng,
                    hp: 5 * round * round,
                    d: 50,
                    delay: i * 100,
                });
            }
            console.log("created units:", unit.length);
            gamestate = 2;
            // Need to put stuff in changing it to wait, disabling clicking.
            $("#menu").off("click"); // This needs to be fixed, disabled so people can't restart the round
            $("#map").off("click");
            $("#build").off("click");
            $("#buildmenu").hide();
            build_toggle = 0;
            $("#build").css("filter", "grayscale(50%)");
            // setInterval(gameLoop, 50);

            setRoutes();
            console.log("its over");
        });

        $("#build").on("click", function (event) {
            $("#buildmenu").toggle();
            bcounter++;
            build_toggle = bcounter % 2;
            if (build_toggle != 1) {
                $("#build").css("filter", "grayscale(50%)");
            } else {
                $("#build").css("filter", "none");
            }
        });

        $("#buildmenu div").on("click", function (event) {
            selected_building = "tower";
            selected_building_src = towerurl;
            $(this).addClass("selected");
            $("div").not(this).removeClass("selected");
            
        });
        $("#selected_unit").html(
            "<h6>Upcoming Enemies:</h6><img src='" +
                flagurl +
                "'></img><p>HP: " +
                (5 * round * round) +
                "</p>"
        );
    }
}

// $("#recenter").on("click", function (event) {
//   map.setCenter({ lat: -25.363, lng: 131.044 })
//   map.setZoom(10)
// })

$("#recenter").on("click", function (event) {
    map.setCenter(keeplatlog);
    map.setZoom(15);
});

setInterval(gameLoop, 25);
updateResources();
displayBuildings();
toggleConsole();

function toggleConsole() {
    $("#consoletab").toggle();
    console_toggle++;
    if (console_toggle % 2 != 1) {
        // original position
        $("#selected_unit").css("left", 1650);
        $("#littletab img").css("transform", "rotate(0deg)");
    } else {
        //counsoles out
        $("#littletab img").css("transform", "rotate(180deg)");

        $("#selected_unit").css("left", 1300);
    }
}

$("#littletab").click(function () {
    toggleConsole();
});

function recalccave() {
    var angle = Math.floor(Math.random() * 360);
    angle = (angle * Math.PI) / 180;
    x = Math.sin(angle) * 0.08;
    y = Math.cos(angle) * 0.08;
    cave1latlog.lat = keeplatlog.lat + x;
    cave1latlog.lng = keeplatlog.lng + y;
    cavemarker.setPosition(cave1latlog);
    map.setZoom(map.getZoom -1)
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(cavemarker.getPosition());
    bounds.extend(keepmarker2.getPosition());
    map.fitBounds(bounds, 100);
    caveWindow = new google.maps.InfoWindow({
        content: "A new Cave has Appeared!",
        size: new google.maps.Size(150, 50),
    });
    caveWindow.open(map, cavemarker);
    // map.setCenter(bounds.getCenter());
}

// called on body load
function initMap() {
    // initialize infoWindow
    infoWindow = new google.maps.InfoWindow({
        size: new google.maps.Size(150, 50),
    });

    map = new google.maps.Map(document.getElementById("map"), {
        center: keeplatlog,
        zoom: 15,
        gestureHandling: "greedy",
        clickableIcons: false,
        streetViewControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        fullscreenControl: false,
    });

    cavemarker = createfirstMarker(cave1latlog, caveurl);
    keepmarker2 = createfirstMarker(keeplatlog, keepurl);
    
    keepWindow = new google.maps.InfoWindow({
        content: "Defend your Keep!",
        size: new google.maps.Size(150, 50),
    });
    keepWindow.open(map, keepmarker2);

    google.maps.event.addListener(map, "click", function (event) {
        if (build_toggle == 1) {
            if (checkcost()) {
                placeMarker(event.latLng);
                buildings.push({
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng(),
                    type: selected_building,
                });
                spendresources();
            } else {
                notify("Insufficient Resources");
            }
        }
    });
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(cavemarker.getPosition());
    bounds.extend(keepmarker2.getPosition());
    map.fitBounds(bounds, 10);
}



$(document).ready(function () {
    recalccave();
});

function haversine_distance(mk1, mk2) {
    var R = 6371071; // Radius of the Earth in meters
    var rlat1 = mk1.lat * (Math.PI / 180); // Convert degrees to radians
    var rlat2 = mk2.lat * (Math.PI / 180); // Convert degrees to radians
    var difflat = rlat2 - rlat1; // Radian difference (latitudes)
    var difflon = (mk2.lng - mk1.lng) * (Math.PI / 180); // Radian difference (longitudes)
    var d =
        2 *
        R *
        Math.asin(
            Math.sqrt(
                Math.sin(difflat / 2) * Math.sin(difflat / 2) +
                    Math.cos(rlat1) *
                        Math.cos(rlat2) *
                        Math.sin(difflon / 2) *
                        Math.sin(difflon / 2)
            )
        );
    return d;
}

function placeMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: {
            url: towerurl,
            scaledSize: new google.maps.Size(50, 50),
            anchor: new google.maps.Point(25, 25),
        },
        animation: google.maps.Animation.DROP,
    });
    const rangeRing = new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map,
        center: location,
        radius: 800,
    });
}

// returns the marker
function createMarker(latlng, label) {
    // using Marker api, marker is created
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: label,
        zIndex: 10,
        icon: {
            url: flagurl,
            scaledSize: new google.maps.Size(50, 50),
            anchor: new google.maps.Point(25, 25),
        },
    });
    marker.myname = label;
    // adding click listener to open up info window when marker is clicked
    return marker;
}

// returns the marker
function createfirstMarker(latlng, src) {
    // using Marker api, marker is created
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        zIndex: 10,
        icon: {
            url: src,
            scaledSize: new google.maps.Size(50, 50),
            anchor: new google.maps.Point(25, 25),
        },
    });
    // adding click listener to open up info window when marker is clicked
    return marker;
}

// Using Directions Service find the route between the starting and ending points
function setRoutes() {
    map && initMap();
    for (var i = 0; i < buildings.length; i++) {
        placeMarker({ lat: buildings[i].lat, lng: buildings[i].lng });
    }

    startLoc[0] = cave1latlog;
    endLoc[0] = keeplatlog;

    startLocation = [];
    endLocation = [];
    polyLine = [];
    poly2 = [];
    timerHandle = [];

    var directionsDisplay = new Array();
    for (var i = 0; i < startLoc.length; i++) {
        var rendererOptions = {
            map: map,
            // suppressMarkers: false,
            preserveViewport: true,
        };
        directionsService = new google.maps.DirectionsService();
        var travelMode = google.maps.DirectionsTravelMode.DRIVING;
        var request = {
            origin: startLoc[i],
            destination: endLoc[i],
            travelMode: travelMode,
        };
        directionsService.route(
            request,
            makeRouteCallback(i, directionsDisplay[i]),
            rendererOptions
        );
    }
}

// called after getting route from directions service, does all the heavylifting
function makeRouteCallback(routeNum, disp, rendererOptions) {
    // check if polyline and map exists, if yes, no need to do anything else, just start the animation
    if (polyLine[routeNum] && polyLine[routeNum].getMap() != null) {
        startAnimation(routeNum);
        return;
    }
    return function (response, status) {
        // if directions service successfully returns and no polylines exist already, then do the following
        if (status == google.maps.DirectionsStatus.ZERO_RESULTS) {
            toggleError("No routes available for selected locations");
            return;
        }
        if (status == google.maps.DirectionsStatus.OK) {
            startLocation[routeNum] = new Object();
            endLocation[routeNum] = new Object();
            // set up polyline for current route
            polyLine[routeNum] = new google.maps.Polyline({
                path: [],
                strokeColor: "#FFFF00",
                strokeWeight: 3,
            });
            poly2[routeNum] = new google.maps.Polyline({
                path: [],
                strokeColor: "#FFFF00",
                strokeWeight: 3,
            });
            // For each route, display summary information.
            var legs = response.routes[0].legs;
            // directionsrenderer renders the directions obtained previously by the directions service
            disp = new google.maps.DirectionsRenderer(rendererOptions);
            disp.setMap(map);
            disp.setDirections(response);

            // create Markers
            for (i = 0; i < legs.length; i++) {
                // for first marker only
                if (i == 0) {
                    startLocation[routeNum].latlng = legs[i].start_location;
                    startLocation[routeNum].address = legs[i].start_address;
                    // marker[routeNum] = createMarker(
                    //     legs[i].start_location,
                    //     "start",
                    //     legs[i].start_address,
                    //     "green"
                    // );
                }
                endLocation[routeNum].latlng = legs[i].end_location;
                endLocation[routeNum].address = legs[i].end_address;
                var steps = legs[i].steps;
                for (j = 0; j < steps.length; j++) {
                    var nextSegment = steps[j].path;
                    for (k = 0; k < nextSegment.length; k++) {
                        polyLine[routeNum].getPath().push(nextSegment[k]);
                    }
                }
            }
        }
        if (polyLine[routeNum]) {
            // render the line to map
            polyLine[routeNum].setMap(map);
            // and start animation
            startAnimation(routeNum);
        }
    };
}

// Spawn a new polyLine every 20 vertices
function updatePoly(i, d) {
    if (poly2[i].getPath().getLength() > 20) {
        poly2[i] = new google.maps.Polyline([
            polyLine[0].getPath().getAt(lastVertex - 1),
        ]);
    }

    if (polyLine[0].GetIndexAtDistance(d) < lastVertex + 2) {
        if (poly2[i].getPath().getLength() > 1) {
            poly2[i].getPath().removeAt(poly2[i].getPath().getLength() - 1);
        }
        poly2[i]
            .getPath()
            .insertAt(
                poly2[i].getPath().getLength(),
                polyLine[0].GetPointAtDistance(d)
            );
    } else {
        poly2[i]
            .getPath()
            .insertAt(poly2[i].getPath().getLength(), endLocation[0].latlng);
    }
}

function updateMarkers() {
    var closest = [];
    var closestunit = [];
    //update markers
    for (var i = 0; i < unit.length; i++) {
        if (!unit[i]) {
            continue;
        }
        if (unit[i].d > eol[0]) {
            gameover();
            return;
        }
        if (unit[i].delay <= 0) {
            unit[i].d += 50;
            var p = polyLine[0].GetPointAtDistance(unit[i].d); /// fix this line
            unit[i].lat = p.lat();
            unit[i].lng = p.lng();
            unitmarker[i].setIcon({
                url: flagurl,
                scaledSize: new google.maps.Size(50, 50),
                anchor: new google.maps.Point(25, 25),
            });
            unitmarker[i].setPosition({ lat: unit[i].lat, lng: unit[i].lng });
            updatePoly(i, unit[i].d);
        } else {
            unit[i].delay -= 10;
        }
        // resetting range detection
        for (var tower = 0; tower < buildings.length; tower++) {
            closest[tower] = 1000;
        }
        // do combat
        for (var tower = 0; tower < buildings.length; tower++) {
            var towerlatlng = {
                lat: buildings[tower].lat,
                lng: buildings[tower].lng,
            };
            // get distance between tower and the object
            // if distance is less than tower range 800
            // Get closest and attack only that one!
            range = haversine_distance(
                { lat: unit[i].lat, lng: unit[i].lng },
                towerlatlng
            );
            if (range < 800) {
                if (range < closest[tower]) {
                    closest[tower] = range;
                    closestunit[tower] = i;
                }
            }
        }
    }
    for (var tower = 0; tower < buildings.length; tower++) {
        if (unit[closestunit[tower]]) {
            unit[closestunit[tower]].hp -= 2;
            unitmarker[closestunit[tower]].setIcon({
                url: explodeurl, //on hit change marker to hit indicator
                scaledSize: new google.maps.Size(50, 50),
                anchor: new google.maps.Point(25, 25),
            });
            // console.log(unit[closestunit[tower]].hp);
        }
    }
    for (var i = 0; i < unit.length; i++) {
        //detect death
        if (unit[i].hp <= 0) {
            unit.splice(i, 1); // this doesn't seem to work
            unitmarker[i].setIcon({
                url: graveurl,
                scaledSize: new google.maps.Size(50, 50),
                anchor: new google.maps.Point(25, 25),
            });
            unitmarker.splice(i, 1);
            resources.gold += 75 * round;
            score(100 * round);
            notify("You got one! You got " + 100 * round + " gold");
            updateResources();
        }
    }
}

function startAnimation(index) {
    if (timerHandle[index]) clearTimeout(timerHandle[index]);
    eol[0] = polyLine[0].Distance(); // eol is the distance of the whole route
    map.setCenter(polyLine[0].getPath().getAt(0));

    for (var i = 0; i < unit.length; i++) {
        // creates markers and poly2 for each unit
        unitmarker[i] = createMarker({ lat: unit[i].lat, lng: unit[i].lng });
        poly2[i] = new google.maps.Polyline({
            path: [polyLine[0].getPath().getAt(0)],
            strokeColor: "#FFFF00",
            strokeWeight: 3,
        });
    }
}


function updateScoreboard(){
    const csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value;
    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    var data = {'score': userscore, "round" : round };
    $.post('updatescoreboard', data, function(response){
        if(response === 'success'){ alert('Yay!'); }
        else{ alert('Error! :('); }
    });
}