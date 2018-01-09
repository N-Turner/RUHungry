// Yelp has phased out v2 of it's API with Yelp Fusion. This Udacity forum was very helpful: https://discussions.udacity.com/t/yelp-v3-implementation/235928
// Get location data from Yelp via an API call
// Filter for food places based on the Hawaii location near Honolulu.
var yelp_url = 'https://api.yelp.com/v3/businesses/search?term=restaurants&latitude=21.280945&longitude=-157.813963';

// Proxy to bypass CORS restriction on Yelp API
var cors_anywhere_url = 'https://cors-anywhere.herokuapp.com/';

var settings = {
  "async": true,
  "crossDomain": true,
  "url": cors_anywhere_url + yelp_url,
  "method": "GET",
  "headers": { // Paste your Yelp API key after 'Bearer'.
    "authorization": "Bearer psS0DaOMtb2S1-G5yZMfsLEp-ZXj-Z0JH9Tn-X0td730Ot5RBJb0qx4demwiFtAy33QJuUsXY9PuzU3arI65x_RxEgEMA4sYX_jg0d7dUJsiA6uMxvdlB8VByk5MWnYx",
    "cache-control": "no-cache",
  }
};
console.log("ajaxrequest");

$.ajax(settings).done(function(response) {
	console.log("ajaxrequestsuccess");
	var food = response.businesses;

	// Loop through the data and push to our viewmodel places array
	for (var i = 0; i < food.length; i++) {

		vm.places.push({
			title: food[i].name, 
			location: food[i].coordinates,
			rating: food[i].rating,
			price: food[i].price,
			id: i
		});
	}
	// Create map markers using the data
	foodMarkers();

}).fail(function(response){
	alert("Sorry, failed to get Yelp Data. There was an error");
});
