var top_schools=['Kittredge Magnet School', 'Warren T. Jackson Elementary School', 'Brandon Elementary School', 'Mary Lin Elementary ', 'Springdale Park Elementary School', 'Morningside Elementary School', 'The GLOBE Academy ', 'Woodland Elementary School', 'Charles R. Drew Charter School Elementary Academy', 'Oak Grove Elementary School', 'Margaret Harris Comprehensive School', 'Inman Middle School', 'Charles R. Drew Charter School Junior and Seni...', 'DeKalb PATH Academy', 'Ivy Preparatory Academy, Inc', 'Centennial Academy', 'Atlanta Classical Academy', 'Atlanta Neighborhood Charter School-Middle', 'Peachtree Charter Middle', 'Carver Early College ', 'Charles R. Drew Charter School Junior and Seni...', 'Henry W. Grady High School ', 'Lakeside High School', 'North Atlanta High School', 'Westlake High School', 'Cross Keys High School', 'Druid Hills High School', 'Maynard H. Jackson High School ', 'KIPP Atlanta Collegiate Academy']
// Adding tile layer
var lightMap = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY,
  }
);

//Create empty LayerGroups
var layers = {
  house_layer: new L.LayerGroup(),
  restaurant_layer: new L.LayerGroup(),
  school_layer: new L.LayerGroup(),
};

// Creating map object
var myMap = L.map("map", {
  center: [33.7756, -84.3963],
  zoom: 12,
  layers: [lightMap, layers.house_layer],
});

// Create an overlayMaps object to hold the dining layer
var overlays = {
  Houses: layers.house_layer,
  Restaurants: layers.restaurant_layer,
  Schools: layers.school_layer,
};

// Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
L.control.layers(null, overlays, { collapsed: false }).addTo(myMap);

// Creation of Individual Icons
var myIcon = {
  house_layer: L.icon({
    iconUrl: "static/icons/017-house.png",
    iconSize: [50, 50],
    // iconAnchor: [22, 94],
    // popupAnchor: [-3, -76],
    // shadowUrl: 'my-icon-shadow.png',
    // shadowSize: [68, 95],
    // shadowAnchor: [22, 94]
  }),

  restaurant_layer: L.icon({
    iconUrl: "static/icons/028-restaurant.png",
    iconSize: [35, 35],
    // iconAnchor: [22, 94],
    // popupAnchor: [-3, -76],
    // shadowUrl: 'my-icon-shadow.png',
    // shadowSize: [68, 95],
    // shadowAnchor: [22, 94]
  }),

  school_layer: L.icon({
    iconUrl: "static/icons/011-education.png",
    iconSize: [35, 35],
    // iconAnchor: [22, 94],
    // popupAnchor: [-3, -76],
    // shadowUrl: 'my-icon-shadow.png',
    // shadowSize: [68, 95],
    // shadowAnchor: [22, 94]
  }),
};

//----------------------HOUSE GEOJSON MAP INFORMATION----------------------------------//
// Grabbing our GeoJSON data..
var houses_link = "static/data/houses.geojson";
d3.json(houses_link, function (data) {
  // Creating a geoJSON layer with the retrieved data
  L.geoJSON(data, {
    pointToLayer: function (geoJsonPoint, latlng) {
      var h_marker = L.marker(latlng, { icon: myIcon.house_layer });
      h_marker.addTo(layers.house_layer);
      return h_marker;
    },

    onEachFeature: function (feature, layer) {
      layer.on({
        mouseover: function (event) {
          event.target.openPopup();
        },

        mouseout: function (event) {
          //event.target.closePopup();
        },

        click: function (event) {
          myMap.setView(event.target.getLatLng(), 15);
        },
      });

      layer.bindPopup(
        "<h1>" +
          feature.properties.neighborhood +
          "</h1> <hr> <h2>" +
          feature.properties.price +
          "</h2> <hr> <h3>" +
          feature.properties.link +
          "</h3>"
      );
    },
  });
});

//----------------------RESTAURANT GEOJSON MAP INFORMATION----------------------------------//
var res_link = "static/data/restaurant_point.geojson";
// Grabbing our GeoJSON data..
d3.json(res_link, function (data) {
  // Creating a geoJSON layer with the retrieved data
  L.geoJSON(data, {
    pointToLayer: function (geoJsonPoint, latlng) {
      var r_marker = L.marker(latlng, { icon: myIcon.restaurant_layer });
      r_marker.addTo(layers.restaurant_layer);
      return r_marker;
    },

    onEachFeature: function (feature, layer) {
      layer.on({
        mouseover: function (event) {
          event.target.openPopup();
        },

        mouseout: function (event) {
          event.target.closePopup();
        },

        click: function (event) {
          myMap.setView(event.target.getLatLng(), 20);
        },
      });

      layer.bindPopup(
        "<h1>" +
          feature.properties.name +
          "</h1> <hr> <h2>" +
          feature.properties.cuisine +
          "</h2>"
      );
    },
  });
});

//----------------------SCHOOL GEOJSON MAP INFORMATION----------------------------------//
var school_link = "static/data/schools.geojson";
d3.json(school_link, function (data) {
  // Creating a geoJSON layer with the retrieved data
  L.geoJSON(data, {
    pointToLayer: function (geoJsonPoint, latlng) {
      // console.log(geoJsonPoint.properties. FACNAME);
       if (top_schools.includes(geoJsonPoint.properties.FACNAME)) {
      var s_marker = L.marker(latlng, { icon: myIcon.school_layer });
      s_marker.addTo(layers.school_layer);
      return s_marker;
    }
  },

    onEachFeature: function (feature, layer) {
      layer.on({
        mouseover: function (event) {
          event.target.openPopup();
        },

        mouseout: function (event) {
          event.target.closePopup();
        },

        click: function (event) {
          myMap.setView(event.target.getLatLng(), 20);
        },
      });

      layer.bindPopup(
        "<h1>" +
          feature.properties.FACNAME +
          "</h1> <hr> <h2>" +
          feature.properties.ADDRESS_1 +
          "</h2>"
      );
    },
  });
});


//----------------------COUNTY LAYER MAP INFORMATION----------------------------------//
var county_link = "https://opendata.arcgis.com/datasets/d6298dee8938464294d3f49d473bcf15_196.geojson";
d3.json(county_link, function (data) {
  // Creating a geoJSON layer with the retrieved data
  L.geoJSON(data, {
     // Style each feature (in this case a neighborhood)
     style: function(feature) {
      return {
        color: "white",
        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
        fillColor: 'blue',
        fillOpacity: 0.2,
        weight: 1.5
      };
    },

    onEachFeature: function (feature, layer) {
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: function(event) {
          event.target.openPopup();
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.5
          });
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: function(event) {
          event.target.closePopup();
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.2
          });
        },
        // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
        click: function(event) {
          myMap.fitBounds(event.target.getBounds());
        }
      });

      layer.bindPopup(
        "<h1>" +
          feature.properties.NEIGHBORHO +
          "</h1>"
      );
    },
  }).addTo(myMap);
});
