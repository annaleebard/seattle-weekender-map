(function () {

  var options = {
    zoomSnap: .1,
    zoomDelta: .5,
    zoom: 1
  };

  //var map = L.map('map', options);

  // L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png', {
  //   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  //   subdomains: 'abcd',
  //   maxZoom: 19
  // }).addTo(map);

  var lightMapLabels = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    subdomains: 'abcd',
    maxZoom: 19
  });
    lightMapNoLabels = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
      subdomains: 'abcd',
      maxZoom: 19
    });
  var map = L.map('map', {
   
    layers: [lightMapLabels, lightMapNoLabels]
  });

  var baseMaps = {
    "Basemap Labels": lightMapLabels,
    "Basemap No Labels": lightMapNoLabels,
    
};
L.control.layers(baseMaps).addTo(map);

  var neighborhoodOptions = {
    fillOpacity: 0,
    color: '#9bbff4',
    weight: 0,
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
      iconSize: [40, 40],
      shadowSize: [50, 64],
      iconAnchor: [22, 94],
      shadowAnchor: [4, 62],
      popupAnchor: [-3, -76]
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
      style: neighborhoodOptions,
      onEachFeature(feature, layer) {
        layer.on({
          mouseover: highlightNeighborhood,
          mouseout: resetStyle
        });
        var neighborhoodProps = (feature.properties.NEIGHBORHO)
        // console.log(neighborhoodProps)
      }

    }).addTo(map);

    // var info = L.control();

    // info.onAdd = function (map) {
    //   this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    //   this.update();
    //   return this._div;
    // };

    // // method to update the control based on feature properties passed
    // info.update = function (neighborhoodProps) {
    //   this._div.innerHTML = '<h4>Neighborhood:</h4>' + (neighborhoodProps ?
    //     '<b>' + neighborhoodProps + '</b><br />' + ' people / mi<sup>2</sup>'
    //     : 'Hover over Seattle');
    // };

    // info.addTo(map);

    // function highlightFeature(e) {
    //   info.update(neighborhoodProps);
    // }

    // function resetHighlight(e) {
    //   info.update();
    // }

    //  onEachFeature: function (feature, layer) {
    //       var props = feature.properties,
    //           title = props.title

    //       layer.bindTooltip('<h4>' + title + '</h4>');
    //    }

    //add info box for neighborhood name

    //highlight neighborhood polygon when moused over
    function highlightNeighborhood(e) {
      var layer = e.target;

      layer.setStyle({
        weight: 3,
        color: 'yellow',
        dashArray: '',
        fillOpacity: 0.7
      });
    }

    //reset neighborhood polygon style on mouse out
    function resetStyle(e) {
      var layer = e.target;
      layer.setStyle({
        weight: 0,
        fillOpacity: 0
      });
    }

    // fit map bounds to extent of neighborhoods and limit zoom
    map.fitBounds(neighborhoods.getBounds());

    // get the current zoom level
    var currentZoom = map.getZoom();

    // set the min and max zoom controls
    map.setMaxZoom(currentZoom + 5);
    map.setMinZoom(currentZoom);
    map.setMaxBounds(map.getBounds());


    L.geoJson(parks, {
      style: parkOptions,
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
      filter: function (feature) {
        // filter some out to narrow map focus
        if (feature.properties.classifica != "Environments" ||
          feature.properties.classifica != "Environment" ||
          feature.properties.classifica != "Infrastructure"
        ) return feature
      },
      onEachFeature: function (feature, layer) {
        var props = feature.properties,
          title = props.title

        layer.bindTooltip('<h4>' + title + '</h4>');
      }
    });

    markers.addLayer(artLayer);

    //  map.addLayer(markers);
    artLayer.addTo(map)

  }

  function getColor(type) {
    //console.log(type)

    var colorMap = {
      'Sculpture': '#2b83ba',
      'Sculptures': '#018571',
      'Totem Pole': '#ed4949',
      'Monument': '#3d3939',
      'Structure': '#d6ca24'
    }
    if (colorMap[type]) {
      return colorMap[type]
    }

    return ''
  }

  

})();