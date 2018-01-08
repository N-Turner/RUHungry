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


}

//Error handling for Google Maps
function mapError() {
	document.getElementById("map").innerHTML = "<h2> Sorry, Google Maps could not load </h2>";
	console.log("Sorry, Google Maps had a problem loading");
};

function foodMarkers() {

    var defaultIcon = markerIcon('ff4000');

    // Highligh icon during hover
    var highlightedIcon = markerIcon('e7b213');
    // Create info window
    var mapInfoWindow = new google.maps.InfoWindow();
    // Loop through locations array in our view model
    vm.places().forEach(function (place, i)) {
        var title = place.title
        var rating = place.rating;
        var lat = place.location.latitude;
        var lng = place.location.longitude;
        var position = new google.maps.LatLng(lat, lng);

        var marker = new.google.maps.Marker({
            title: title,
            rating: rating,
            position: position,
            animation: google.maps.Animation.Drop,
            icon: defaultIcon,
            map: map,
            id: i
        });

    }


}

var ViewModel = function() {
	var self = this;
	// search bar
	self.title = ko.observable();
    self.location = ko.observable();

};


var vm = new ViewModel(); 

ko.applyBindings(vm);