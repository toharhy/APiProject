var app = {};
//get info from api about monkeys.

app.getLoco = function(urgency,location) {

	if (app.outdoors === true) {
		console.log('It is working!!!');
		$.ajax({
			url: 'https://api.foursquare.com/v2/venues/explore?',
			type: 'GET',
			dataType: 'jsonp',
			data: {
				client_id: "KI2QJ2OJ0ST1CXPV5IMSAMMTL04NCFDG34MPI55IC2R55CNX",
				client_secret: "VR0PLONHUYLHLOCO4V5LKFNGUMEATWEYFKLVS1CFYROX23J2",
				v: getDate(),
				ll: location,
				radius: urgency,
				section: "outdoors",
				intent: "browse",
				venuePhotos: 1
			},
			success: function(data) {
				// console.log("outdoors:");
				console.log(data);
				// app.temp = data;
				app.markers(data);
			}
		});
	} else {
		$.ajax({
			url: 'https://api.foursquare.com/v2/venues/explore?',
			type: 'GET',
			dataType: 'jsonp',
			data: {
				client_id: "KI2QJ2OJ0ST1CXPV5IMSAMMTL04NCFDG34MPI55IC2R55CNX",
				client_secret: "VR0PLONHUYLHLOCO4V5LKFNGUMEATWEYFKLVS1CFYROX23J2",
				v: getDate(),
				ll: location,
				radius: urgency,
				section: "food",
				intent: "browse",
				venuePhotos: 1

			},
			success: function(data) {
				console.log(data);
				app.markers(data);
			}
		});
		$.ajax({
			url: 'https://api.foursquare.com/v2/venues/explore?',
			type: 'GET',
			dataType: 'jsonp',
			data: {
				client_id: "KI2QJ2OJ0ST1CXPV5IMSAMMTL04NCFDG34MPI55IC2R55CNX",
				client_secret: "VR0PLONHUYLHLOCO4V5LKFNGUMEATWEYFKLVS1CFYROX23J2",
				v: getDate(),
				ll: location,
				radius: urgency,
				section: "drinks",
				intent: "browse",
				venuePhotos: 1
			},
			success: function(data) {
				console.log(data);
				app.markers(data);

			}
		});
		$.ajax({
			url: 'https://api.foursquare.com/v2/venues/explore?',
			type: 'GET',
			dataType: 'jsonp',
			data: {
				client_id: "KI2QJ2OJ0ST1CXPV5IMSAMMTL04NCFDG34MPI55IC2R55CNX",
				client_secret: "VR0PLONHUYLHLOCO4V5LKFNGUMEATWEYFKLVS1CFYROX23J2",
				v: getDate(),
				ll: location,
				radius: urgency,
				section: "coffee",
				intent: "browse",
				venuePhotos: 1
			},
			success: function(data) {
				console.log(data);
				app.markers(data);
			}
		});
	}

	// console.log(urgency);
	
	
};

app.getInfo = function() {
	app.urgency = $('#urgency').val();

	$('select#urgency').on('change', function() {
		app.urgency = $(this).val();

		if(app.urgency === '500') {
			$('.adventurous').show();
			app.outdoors = true;
		} else {
			$('.adventurous').hide();
			app.outdoors = false;
		}
	});

	$('button').on('click', function() {
		getLocation();
	});
	
}

app.markers = function(data){
	var locations = data.response.groups[0].items;
	//Add to count for each item
	app.count = app.count + data.response.groups[0].items.length;
	$('.toilet-number').text(app.count)
	for (var i = 0; i < locations.length; i++) {
		lat = locations[i].venue.location.lat;
		lon = locations[i].venue.location.lng;
		name = locations[i].venue.name;
		latlon = new google.maps.LatLng(lat, lon);
		photo= locations[i].venue.photos.groups[0].items[0];
		var contentString = '<div id="content">'+
	      '<div id="siteNotice">'+
	      '</div>'+
	      '<h1 id="firstHeading" class="firstHeading">'+locations[i].venue.name+'</h1>'+
	      '<div id="bodyContent">'+
	      // '<img src="'+photo.prefix+"300x500"+photo.suffix+'" alt="'+locations[i].venue.name+'" />'+
	      '</div>'+
	      '</div>';


		  var infowindow = new google.maps.InfoWindow({
		      content: contentString
		  });

 		  var marker = new google.maps.Marker({
 		  	position:latlon,
 		  	map:app.map,
 		  	title:name,
 		  	icon: 'toilet.png'
 		  });
 		  console.log(name);
 		  //Pass marker info to function so EACH marker gets its own window
		  app.markerEvents(marker, infowindow);
	}
	
};

app.markerEvents = function(marker, infowindow) {
	google.maps.event.addListener(marker, 'click', function() {
    	infowindow.open(app.map,marker);
  	});
}

app.count= 0;

app.map = {};

$( document ).ready(function(){
	getLocation();
	app.getInfo();

	Select.init({
		selector: '.customSelect',
	})
});

//geolocation: button where are you?

var x = document.getElementById("places");
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else { 
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    latlon = new google.maps.LatLng(lat, lon)
    mapholder = document.getElementById("places");
    mapholder.style.height = '350px';
    mapholder.style.width = '700px';

    var myOptions = {
    center:latlon,zoom:14,
    mapTypeId:google.maps.MapTypeId.ROADMAP,
    mapTypeControl:false,
    navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
    }
    
    app.map = new google.maps.Map(document.getElementById("places"), myOptions);
    var marker = new google.maps.Marker({
    	position:latlon,
    	map:app.map,
    	title:"You are here!",
    	
    });

    var locus = lat + "," + lon;
    
	app.getLoco(app.urgency, locus );
}


function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
    }
}


function getDate() {
 var date = new Date();
 var day = date.getDate().toString();
 var year = date.getFullYear().toString();
 var month = function() {
   if(date.getMonth().toString().length === 1) {
     return '0' +  date.getMonth();
   }
   else {
     return date.getMonth();
   }
 }
 return year + month().toString() + day;
}
