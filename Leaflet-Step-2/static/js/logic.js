function createMap(earthquake) {

  // Define streetmap and darkmap layers
  var greymap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });

  var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "outdoors-v9",
    accessToken: API_KEY
  });

  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-streets-v9",
    accessToken: API_KEY
  });
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satellite": satellitemap,
    "Greyscale": greymap,
    "Outdoors": outdoormap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquake
  };

  // Create our map, giving it the greyscale and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [greymap, earthquake]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  
//Create a map object
// var myMap = L.map("map", {
//     center: [37.09, -95.71],
//     zoom: 5
//   });
  
//   L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//     tileSize: 512,
//     maxZoom: 18,
//     zoomOffset: -1,
//     id:"mapbox/light-v10",
//     accessToken: API_KEY
//   }).addTo(myMap);

  var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

  // d3.json(url).then(function(data) {
  //   console.log(data);
  //     var feat = data.features
  
  //     var circlemarkers = []
  //     for (var i = 0; i< feat.length; i++) {
  //       var loc = feat[i].geometry;
  //       var property = feat[i].properties;
  //       console.log(loc) 

  //       circlemarkers.push(
  //         L.circleMarker([loc.coordinates[1], loc.coordinates[0]], {
  //           fillOpacity:0.75,
  //           color:"black",
  //           weight: 1,
  //           fillColor:"green",
  //           radius: property.mag * 5
  //         }).bindPopup("<h3>" + property.place +"<h3><hr><p>" + new Date(property.time) + "</p>").addTo(myMap));
  //       }
  // })



d3.json(url).then(function(response){
  createFeatures(response.features);
});

function createFeatures(data) {
  function onEachFeature (feature,layer) {
    var magnitude = feature.properties.mag
    var depth = feature.geometry.coordinates[2]
    var color = ""
    if (depth >= 90) {
      color = "#FF0D0D";
    }
    else if (depth < 90 && depth >=  70){
      color = " #FF4E11";
    }
    else if (depth < 70 && depth >= 50) {
      color = "#FF8E15";
    }
    else if (depth <50 && depth  >= 30){
      color = "#FAB733";
    }
    else if (depth < 30 && depth >= 10) {
      color = "#ACB334";
    }
    else {
      color = "#69B34C";
    }

    var circlemarkers = []
    circlemarkers.push(
      L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
        fillOpacity:0.75,
        color:"black",
        weight: 0.5,
        fillColor:color,
        radius: magnitude * 5
      }).bindPopup("<h3>" + feature.properties.place +"<h3><hr><p>" + new Date(feature.properties.time) + "</p><hr><p> Magnitude: " + feature.properties.mag+"</p>").addTo(myMap)); 

  //     return L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
  //       fillOpacity:0.75,
  //       color:"black",
  //       weight: 0.5,
  //       fillColor:color,
  //       radius: magnitude * 5
  //     }).bindPopup("<h3>" + feature.properties.place +"<h3><hr><p>" + new Date(feature.properties.time) + "</p><hr><p> Magnitude: " + feature.properties.mag+"</p>");

  // }

    // var circlemarkers = []
    // circlemarkers.push(
    //   L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
    //     fillOpacity:0.75,
    //     color:"black",
    //     weight: 0.5,
    //     fillColor:color,
    //     radius: magnitude * 5
    //   }).bindPopup("<h3>" + feature.properties.place +"<h3><hr><p>" + new Date(feature.properties.time) + "</p><hr><p> Magnitude: " + feature.properties.mag+"</p>"));

  }

  var earthquake = L.geoJSON(data, {
    onEachFeature: onEachFeature
  });

  createMap(earthquake); 
};



  var legend = L.control({position: "bottomright"});
  legend.onAdd = function(){
  var colorscale = ["#69B34C","#ACB334","#FAB733","#FF8E15"," #FF4E11","#FF0D0D"];
  var div = L.DomUtil.create('div', 'info legend'),
      grades = [-10, 10, 30, 50, 70, 90],
      labels = [];

  for (var i = 0; i <grades.length; i++) {
    div.innterHTML +=
      '<i style="background:' + colorscale[i] + ' "></i>' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');

  }
  return div;
};

legend.addTo(myMap);
}
  
// var legend = L.control({position: "bottomright"});
// legend.onAdd = function(){
//   var div = L.DomUtil.create ("div", "info legend");
//   var colorscale = ["#FF0D0D"," #FF4E11","#FF8E15","#FAB733","#ACB334","#69B34C"]
//   var depths = [90,70,50,30,10,-10]

//   depths.forEach(function(row,index){
//     div.innerHTML +=
//     "<li style=\"background-color: " + colorscale[index] + "\"></li>" + row;
//     return div;
//   });
  
//  legend.addTo(myMap);
// };



//   for (var i = 0; i <depths.length; i++) {
//     div.innerHTML += 
//     "<li style=\"background-color: " + colorscale[i]+ "\">" + depths[i] + (depths[i+1] + "</li>" ? "&ndash;" + depths[i+1] + "<br>" : "+");
//     //"<ul class =\"no-bullets\">" + "<li style=\"background-color: " + colorscale[i]+ "\"></li>" + depths[i] + (depths[i+1] ? "&ndash;" + depths[i+1] + "<br>" : "+" + "</ul>");
//   }
//   return div;
// };
// legend.addTo(myMap);


