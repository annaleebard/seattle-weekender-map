 (function () {

   var options = {
     center: [47.59, -122.3],
     zoom: 12,
     minZoom: 10,
     maxZoom: 16,
     maxBounds: [
       [47.87, -121.77],
       [47.31, -122.74]
     ]
   };

   var map = L.map('map', options);

   var neighborhoodOptions = {
    fillOpacity: 0,
    color: '#9bbff4',
    weight: 2,
    opacity: .7
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
  opacity: .8
}

   $.when(
     $.getJSON('data/public-art.json'),
     $.getJSON('data/seattle-neighborhoods-clipped.geojson'),
     $.getJSON('data/seattle-parks.json'),
     $.getJSON('data/bike-routes.json'),
   ).done(function (publicArt, seattleNeighborhoods, parks, bikeRoutes) {

     L.geoJson(publicArt).addTo(map);

     L.geoJson(parks, {
      style: parkOptions}).addTo(map);
     
     L.geoJson(seattleNeighborhoods, {
       style: neighborhoodOptions}).addTo(map);

     L.geoJson(bikeRoutes, {
       style: bikeOptions}).addTo(map);


   });

   L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
     attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
     subdomains: 'abcd',
     minZoom: 0,
     maxZoom: 20,
     ext: 'png'
   }).addTo(map);
 })();