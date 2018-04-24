 (function () {

   var options = {
     zoomSnap: .1,
     zoomDelta: .5
   };

   var map = L.map('map', options);

   //  L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
   //    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
   //    subdomains: 'abcd',
   //    minZoom: 0,
   //    maxZoom: 20,
   //    ext: 'png'
   //  }).addTo(map);

   var neighborhoodOptions = {
     fillOpacity: 0,
     color: '#9bbff4',
     weight: 2,
     opacity: 1
   }

   var parkOptions = {
     fillOpacity: .8,
     color: '#bbdaa4',
     weight: 3.5,
     opacity: .7
   }

   var bikeOptions = {
     color: '#f18d00',
     weight: 2,
     opacity: .4
   }

   var CustomIcon = L.Icon.extend({
    options: {
      iconSize:     [40, 40],
      shadowSize:   [50, 64],
      iconAnchor:   [22, 94],
      shadowAnchor: [4, 62],
      popupAnchor:  [-3, -76]
    }
  });

   // deferred promises to load data
   $.when(
     $.getJSON('data/seattle-neighborhoods-clipped.geojson'),
     $.getJSON('data/seattle-parks.json'),
     $.getJSON('data/bike-routes.json'),
     $.getJSON('data/public-art.json')
   ).done(function (seattleNeighborhoods, parks, bikeRoutes, publicArt) {

     drawMap(seattleNeighborhoods, parks, bikeRoutes, publicArt)

   });

   function drawMap(seattleNeighborhoods, parks, bikeRoutes, publicArt) {

     // draw neighborhoods first
     var neighborhoods = L.geoJson(seattleNeighborhoods, {
       style: neighborhoodOptions
     }).addTo(map);

     // fit map bounds to extent of neighborhoods and limit zoom
     map.fitBounds(neighborhoods.getBounds());

     // get the current zoom level
     var currentZoom = map.getZoom();

     // set the min and max zoom controls
     map.setMaxZoom(currentZoom + 5);
     map.setMinZoom(currentZoom);
     map.setMaxBounds(map.getBounds());


     L.geoJson(parks, {
       style: parkOptions
     }).addTo(map);

     L.geoJson(bikeRoutes, {
       style: bikeOptions
     }).addTo(map);

     var markers = L.markerClusterGroup();

     var artLayer = L.geoJson(publicArt, {
       pointToLayer: function (feature, ll) {
         // use icons instead of default
         return L.circleMarker(ll, {
           radius: 2,
           color: getColor(feature.properties.classifica),
           fillOpacity: 1
          }).addTo(map);
       },
       filter: function(feature) {
         // filter some out to narrow map focus
         if (feature.properties.classifica != "Environments" ||
            feature.properties.classifica != "Environment" ||
            feature.properties.classifica != "Infrastructure"
            ) return feature
       }
     });

     markers.addLayer(artLayer);

    //  map.addLayer(markers);
    artLayer.addTo(map)

   }

   function getColor(type) {
     console.log(type)

    var colorMap = {
      'Sculpture': 'green',
      'Sculptures': 'green',
      'Sound Installation': 'blue',
      'Structure': 'purple'
    }
    if(colorMap[type]) {
      return colorMap[type]
    }

    return 'yellow'



   }

 })();