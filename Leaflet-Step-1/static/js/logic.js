
/////Leaflet 1
//Create a map object
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });
  
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id:"mapbox/light-v10",
    accessToken: API_KEY
  }).addTo(myMap);

  var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"  ////json link

  d3.json(url).then(function(data) {
    console.log(data);
    var circlemarkers = []
    for (var i = 0; i< data.features.length; i++) {
      var feature = data.features[i];
      var depth = feature.geometry.coordinates[2];
      console.log(depth)
      var mag = feature.properties.mag;
      console.log(mag)
      var latlng = feature.geometry.coordinates
      var color = "";
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
        circlemarkers.push(
          L.circleMarker([latlng[1], latlng[0]], {
            fillOpacity:0.75,
            color:"black",
            weight: 0.5,
            fillColor:color,
            radius: mag * 5
          }).bindPopup("<h3>" + feature.properties.place +"<h3><hr><p>" + new Date(feature.properties.time) + "</p><hr><p> Magnitude: " 
          + feature.properties.mag + " & Depth: " + depth+ "</p>").addTo(myMap));
        }
  })

/////////////////////////////////////////////////////////////
var legend = L.control({position: "bottomright"});
legend.onAdd = function(){
  var div = L.DomUtil.create ("div", "info legend");
 

  var depths = [-10, 10, 30, 50, 70, 90];
  var colorscale = ["#69B34C","#ACB334","#FAB733","#FF8E15"," #FF4E11","#FF0D0D"];

  for (var i = 0; i <depths.length; i++) {
    div.innerHTML += 
    "<li style=\"background-color: " + colorscale[i]+ "\">" + depths[i] + (depths[i+1] ? "&ndash;" + depths[i+1] + "<br>" : "+" + "</li>");
    //"<ul class =\"no-bullets\">" + "<li style=\"background-color: " + colorscale[i]+ "\"></li>" + depths[i] + (depths[i+1] ? "&ndash;" + depths[i+1] + "<br>" : "+" + "</ul>");
  }
  return div;
};
legend.addTo(myMap);

////////////////////////////////////////

