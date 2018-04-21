 (function() {

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

  $.when(
    $.getJSON('data/public-art.json'),
    $.getJSON('data/seattle-neighborhoods.json'),
  ).done(function (publicArt, seattleNeighborhoods) {

    L.geoJson(publicArt).addTo(map);
    L.geoJson(seattleNeighborhoods).addTo(map);


  });

  L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
  }).addTo(map);
})();