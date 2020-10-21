// $(document).ready(function () {
//     console.log("testing");
//     console.log($)
//     const csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value;
//     console.log(csrftoken);
//     function csrfSafeMethod(method) {
//         // these HTTP methods do not require CSRF protection
//         return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
//     }
//     $.ajaxSetup({
//         beforeSend: function(xhr, settings) {
//             if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
//                 xhr.setRequestHeader("X-CSRFToken", csrftoken);
//             }
//         }
//     });
//     $("#first_name").keyup(function (a) {
//         a.preventDefault();
//         var data = $("#register").serialize(); // capture all the data in the form in the variable data
//         // data.csrfmiddlewaretoken = csrftoken;
//         console.log(data);
//         $.post("/first_name", data, function (res) {
//             console.log("response returned.");
//         });
//         $.ajax({
//             method: "POST", // we are using a post request here, but this could also be done with a get
//             url: "/first_name",
//             data: data,
//         }).done(function (res) {
//             $("#first_name_val").html(res); // manipulate the dom when the response comes back
//         });
//     });
// });

var map;

const keeplatlog = { lat: 30.3259421, lng: -97.6494772 };
const cave1latlog = { lat: 30.3323365, lng: -97.6901245 };

function initMap() {
    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer();
    const myLatlng = { lat: -25.363, lng: 131.044 };

    map = new google.maps.Map(document.getElementById("map"), {
        center: keeplatlog,
        zoom: 15,
        gestureHandling: "greedy",
    });
    const marker = new google.maps.Marker({
        icon: towerurl,
        position: cave1latlog,
        map,
        title: "Click to zoom",
    });
    const marker2 = new google.maps.Marker({
        icon: flagurl,
        position: keeplatlog,
        map,
        title: "Click to zoom",
    });

    // map.addListener("center_changed", () => {
    //   // 3 seconds after the center of the map has changed, pan back to the
    //   // marker.
    //   window.setTimeout(() => {
    //     map.panTo(marker.getPosition());
    //   }, 3000);
    // });
    // marker.addListener("click", () => {
    //   map.setZoom(8);
    //   map.setCenter(marker.getPosition());
    // });
    directionsRenderer.setMap(map);
    directionsService.route(
        {
            origin: marker.getPosition(),
            destination: marker2.getPosition(),
            travelMode: google.maps.TravelMode.DRIVING,
        },
        // This part needs to be replaced with a new renderer
        (response, status) => {
            console.log(status);
            console.log(response);
            if (status === "OK") {
                directionsRenderer.setDirections(response);
                const route = response.routes[0];
            } else {
                window.alert("Directions request failed due to " + status);
            }
        },
        {
            map: map,
            suppressMarkers: true,
            preserveViewport: true
        }
    );

    map.addListener("click", (mapsMouseEvent) => {
        console.log(mapsMouseEvent.latLng.lat(), mapsMouseEvent.latLng.lng());
    });

    marker.addListener("click", () => {
        map.setZoom(8);
        map.setCenter(marker.getPosition());
    });

    google.maps.event.addListener(map, "click", function (event) {
        placeMarker(event.latLng);
    });

    function placeMarker(location) {
        var marker = new google.maps.Marker({
            position: location,
            map: map,
            icon: towerurl,
            animation: google.maps.Animation.DROP,
        });
    }
}

// new google.maps.Marker({
//     position : { lat: 30.3, lng: -97.6 },
//     map: map,
//     animation : google.maps.Animation.DROP
// })

// function initMap() {
//     var location = { lat: 33.019609, lng: -97.046423 };
//     var map = new google.maps.Map(document.getElementById("map"), {
//         zoom: 4,
//         center: location
//     });
//     var marker = new google.maps.Marker({
//         position: location,
//         map: map
//     })
// }

var build_toggle = 0;
var console_toggle = 0;
var ccounter = 0;
var bcounter = 0;
var score = 0;
var woodcost = 0;
var stonecost = 0;
var foodcost = 0;
var selected_building = "wall";
var placementz = 0;
var increment = 1;
var animate = 1;
var buildingcount = { wall: 0, tower: 0, flag: 0 };

// var resources = { wood: 5000, food: 2000, stone: 100 };
var resources = { wood: 5000000, food: 200000, stone: 100000 };

var building_types = [
    {
        btype: "wall",
        cost: { wood: 500, food: 0, stone: 0, limit: 9999 },
        hp: 3,
    },
    {
        btype: "tower",
        cost: { wood: 1000, stone: 10, food: 0, limit: 9999 },
        hp: 5,
    },
    { btype: "flag", cost: { wood: 0, stone: 0, food: 0, limit: 1 }, hp: 1 },
];

buildingobj = building_types.find((a) => a.btype == selected_building);

var buildings = [{ x: 650, y: 650, z: 0, hp: 1, type: "flag" }];
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
    {
        utype: "goblin",
        x: 500,
        y: 1000,
        z: 0,
        hp: 4,
        team: "enemy",
        speed: 2,
        attack: 1,
    },
    {
        utype: "goblin",
        x: 500,
        y: 900,
        z: 0,
        hp: 4,
        team: "enemy",
        speed: 1,
        attack: 1,
    },
    {
        utype: "goblin",
        x: 300,
        y: 700,
        z: 0,
        hp: 4,
        team: "enemy",
        speed: 1,
        attack: 1,
    },
];

function getcost(item) {
    woodcost = item.cost.wood;
    stonecost = item.cost.stone;
    foodcost = item.cost.food;
    limitcount = item.cost.limit;
}

var towerurl = document.getElementById("towersrc").src;
var flagurl = document.getElementById("flagsrc").src;

// This needs to be redone to ajax the gold
function checkcost() {
    return (
        woodcost <= resources.wood &&
        stonecost <= resources.stone &&
        foodcost <= resources.food &&
        limitcount > buildingcount[selected_building]
    );
}

function notify(note) {
    $("#consoletab p")
        .first()
        .append("<p>" + note + "</p>");
    // $("#notification").text(note);
    // $("#notification").css("top", y);
    // $("#notification").css("left", x + 55);
    // $("#notification").show(500).delay(500);
    // $("#notification").fadeToggle(500);
}

function buildingcounter() {
    buildingcount = { wall: 0, tower: 0, flag: 0 };
    for (i = 0; i < buildings.length; i++) {
        buildingcount[buildings[i].type]++;
    }
    // console.log(buildingcount);
}

function spendresources() {
    resources.wood -= woodcost;
    resources.food -= foodcost;
    resources.stone -= stonecost;
    notify(
        "Wood: -" +
            woodcost +
            " \nStone: -" +
            stonecost +
            " \nFood: -" +
            foodcost
    );
    updateResources();
}

function build(xpos, ypos, building_type) {
    for (var i = 0; i < building_types.length; i++) {
        if (building_types[i].btype == building_type) {
            getcost(building_types[i]);
            building_hp = building_types[i].hp;
            buildingcounter();
            break;
        }
    }
    if (checkcost()) {
        buildings.push({
            x: xpos,
            y: ypos,
            z: placementz,
            hp: building_hp,
            type: building_type,
        });
        spendresources();
    } else if (limitcount <= buildingcount[selected_building]) {
        notify("You cannot have any more of this building");
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
        animate = 1;
    } else if (increment % 5 == 0) {
        animate = 2;
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
            animate +
            ".png`);'></div>";
    }
    document.getElementById("units").innerHTML = output;
    // console.log(output);
}

function moveUnits() {
    theflag = buildings.find((a) => a.type == "flag");
    for (i = 0; i < units.length; i++) {
        delta_x = units[i].x - theflag.x;
        delta_y = units[i].y - theflag.y;
        units[i].z = (Math.atan2(delta_y, delta_x) * 180) / Math.PI;
        units[i].x -= Math.cos(Math.atan2(delta_y, delta_x)) * units[i].speed;
        units[i].y -= Math.sin(Math.atan2(delta_y, delta_x)) * units[i].speed;
        //  (units[i].speed * delta_x) / Math.abs(delta_x + 1);
        // units[i].y -= (units[i].speed * delta_y) / Math.abs(delta_y + 1);
    }
}

function circleploters() {
    theflag = buildings.find((a) => a.type == "flag");
    for (i = 0; i < units.length; i++) {
        delta_x = units[i].x - theflag.x;
        delta_y = units[i].y - theflag.y;
        units[i].z = (Math.atan2(delta_y, delta_x) * 180) / Math.PI;
        units[i].x -= Math.sin(Math.atan2(delta_y, delta_x)) * units[i].speed;
        units[i].y += Math.cos(Math.atan2(delta_y, delta_x)) * units[i].speed;
        //  (units[i].speed * delta_x) / Math.abs(delta_x + 1);
        // units[i].y -= (units[i].speed * delta_y) / Math.abs(delta_y + 1);
    }
}

function ghost_building() {
    if (build_toggle == 1) {
        $("#prebuild").css("display", "block");
        $("#prebuild").css("background", "url(" + selected_building + ".png)");
        $("#prebuild").css("opacity", ".5");
        $("#prebuild").css("top", y);
        $("#prebuild").css("left", x);
        $("#prebuild").css("transform", "rotate(" + placementz + "deg)");
    } else {
        $("#prebuild").css("display", "none");
    }
}

function updateResources() {
    document.getElementById("resources").innerHTML =
        "<h3>Wood: " +
        resources.wood +
        "</h3><h3> Food: " +
        resources.food +
        " </h3><h3>Stone: " +
        resources.stone +
        "</h3>";
}

function getPos(e) {
    x = e.clientX;
    y = e.clientY;
    x = Math.floor(x / 50) * 50;
    y = Math.floor(y / 50) * 50;
}

function stopTracking() {}

document.onkeydown = function (e) {
    if (e.keyCode == 82) {
        placementz += 90;
        if (placementz == 360) {
            placementz = 0;
        }
    }
    console.log(placementz);
    // console.log(e.keyCode)
};

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
        setInterval(gameLoop, 1000);
    }
}

$("#menu").on("click", function (event) {
    gamepaused();
});

$("#build").click(function () {
    $("#buildmenu").toggle();
    bcounter++;
    build_toggle = bcounter % 2;
    if (build_toggle != 1) {
        $("#build").css("filter", "grayscale(50%)");
    } else {
        $("#build").css("filter", "none");
    }
    console.log(build_toggle);
});

// $("#map").on("click", function () {
//     if (build_toggle == 1) {
//         // build(x, y, selected_building);
//     }
//     console.log();

//     displayBuildings();
// });

var selected_id = 1;
$("#buildings").on("click", ".building", function (event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    $(this).addClass("selected");
    $("div").not(this).removeClass("selected");
    selected_id = $(".selected").attr("unitid");
    $("#selected_unit").html(
        "<img src='" +
            buildings[selected_id].type +
            ".png'></img><h3>HP: " +
            buildings[selected_id].hp +
            "</h3><h3>Type: " +
            buildings[selected_id].type +
            "</h3>"
    );
    console.log(selected_id);
});

$("#buildmenu div").on("click", function (event) {
    selected_building = $(this).attr("bldgtype");
    buildingobj = building_types.find((a) => a.btype == selected_building);
    $(this).addClass("selected");
    $("div").not(this).removeClass("selected");

    $("#selected_unit").html(
        "<img src='" +
            selected_building +
            ".png'></img><h3>HP: " +
            buildingobj.hp +
            "</h3><h3>Type: " +
            selected_building +
            "</h3>"
    );
});

function gameLoop() {
    displayUnits();
    moveUnits();
    // updateResources();
    ghost_building();
}

// $("#recenter").on("click", function (event) {
//   map.setCenter({ lat: -25.363, lng: 131.044 })
//   map.setZoom(10)
// })

$("#recenter").on("click", function (event) {
    map.setCenter(keeplatlog);
    map.setZoom(15);
});

setInterval(gameLoop, 1000);

updateResources();
displayBuildings();

$("#littletab").click(function () {
    $("#consoletab").toggle();
    console_toggle++;
    if (console_toggle % 2 != 1) {
        // original position
        // $("#littletab").css('left',500)
        $("#selected_unit").css("left", 1650);
        $("#littletab img").css("transform", "rotate(0deg)");
    } else {
        //counsoles out
        // $("#littletab").css('left',200)
        $("#littletab img").css("transform", "rotate(180deg)");

        $("#selected_unit").css("left", 1300);
    }
    console.log(console_toggle);
});
