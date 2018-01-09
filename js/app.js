// Create a new google map variable with custom style
var map;
// Create blank arrays for markers and places
var markers = [];

var placeMarkers = [];

// Init new google map
function initMap() {
	var styles = [
	{
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 13
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#144b53"
            },
            {
                "lightness": 14
            },
            {
                "weight": 10
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#08304b"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#0c4152"
            },
            {
                "lightness": 5
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#0b434f"
            },
            {
                "lightness": 25
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#0b3d51"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "color": "#146474"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#021019"
            }
            ]
          }
        ];

        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 21.280945, lng: -157.813963},
          zoom: 14,
          styles: styles,
          mapTypeControl: false
        });

        console.log("init map");
}

//Error handling for Google Maps
function mapError() {
	document.getElementById("map").innerHTML = "<h2> Sorry, Google Maps could not load </h2>";
	console.log("Sorry, Google Maps had a problem loading");
};

function foodMarkers() {

    var defaultIcon = markerIcon('ff4000');

    // Highlight icon during hover
    var highlightedIcon = markerIcon('e7b213');
    // Create info window
    var mapInfoWindow = new google.maps.InfoWindow();
    // Loop through locations array in our view model
    vm.places().forEach(function (place, i) {
        var title = place.title
        var rating = place.rating;
        var lat = place.location.latitude;
        var lng = place.location.longitude;
        var position = new google.maps.LatLng(lat, lng);
        var price = place.price;

        var marker = new google.maps.Marker({
            title: title,
            rating: rating,
            price: price,
            location: location,
            position: position,
            animation: google.maps.Animation.Drop,
            icon: defaultIcon,
            map: map,
            id: i
        });

        markers.push(marker);

        place.marker = marker;

        marker.addListener('click', function() {
            populateInfoWindow(this, mapInfoWindow);
        });

        // Alternate between highlighted place marker and non-highlighted
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });
        google.maps.event.addListener(map, 'click', function() {
            mapInfoWindow.close();
        });

    });
    console.log(markers);

    };


function populateInfoWindow(marker, infowindow) {

    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        
        infowindow.setContent('');
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
        // Set Animation on clicked marker
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null);
        }, 850);

        // Create street view variable
        var streetViewService = new google.maps.StreetViewService();

        // Radius for street view
        var radius = 50;


        // If a pano is found for the location, compute the position of the streetview image, 
        // heading, and set the pitch for the panorama
        var getStreetView = function(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(
                    nearStreetViewLocation, marker.position);
                infowindow.setContent('<div>' + marker.title + '<br>' + '<span>Rating: ' + marker.rating + '</span>' + '<br>' + marker.price + '</div><div id="pano"></div>');
                var panoramaOptions = {
                    position: nearStreetViewLocation, 
                    pov: {
                        heading: heading, 
                        pitch: 30
                    }
                };
                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('pano'), panoramaOptions);
            } else {
                infowindow.setContent('<div>' + marker.title + '</div>' + '<div>No Street View Found</div>'); 
            }
        };
        // Use streetview service to get the closest streetview image within
        // 50 meters of the markers position
        streetViewService.getPanoramaByLocation(marker.position,
            radius, getStreetView);
        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
    }
}

// Create a new marker
function markerIcon(markerStyle) {
    var markerImage = new google.maps.MarkerImage('http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' +
        markerStyle +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}

var ViewModel = function() {
    console.log("ViewModel Loaded");
	var self = this;
	
	self.title = ko.observable();
    self.location = ko.observable();
    self.places = ko.observableArray();
    self.rating = ko.observable();
    self.id = ko.observable();
    self.markers = ko.observableArray(markers);
    self.filter = ko.observable();
    self.address = ko.observable();
    self.price = ko.observable();

    // Filter search query in the Are You Hungry Field
    this.listFilter = ko.computed(function() {
        return this.places().filter(function(place) {
            var doesMatch = !self.filter() || place.title.toLowerCase().indexOf(self.filter()) >= 0;

            var id = Number(place.id);
            if (markers[id]) {
                markers[id].setVisible(doesMatch);
            }
            if (doesMatch) {
                return place;
            }
        });
    }, this);
        

    self.zoomIn = function() {
        var id = this.id;
        map.setCenter(markers[id].position);
        map.setZoom(15);
        google.maps.event.trigger(markers[id], 'click');
    };

    
};


var vm = new ViewModel(); 

ko.applyBindings(vm);