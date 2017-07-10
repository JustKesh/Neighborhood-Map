var locations = [
        {title: 'Pantheon', location: {lat: 41.898611, lng: 12.476873}, category: 'Roman Temple', venueId: '4adcdac6f964a5202f5321e3'},
        {title: 'Santa Maria del Popolo', location: {lat: 41.911491, lng: 12.476656}, category: 'Church', venueId: '4adcdac6f964a520065321e3'},
        {title: 'St. Peter’s Square', location: {lat: 41.902218, lng: 12.456796}, category: 'Plaza', venueId: '4adcdac7f964a520735321e3'},
        {title: 'Santa Maria della Vittoria', location: {lat: 41.904701, lng: 12.494369}, category: 'Church', venueId: '4bcf2112937ca5937491af92'},
        {title: 'Piazza Navona', location: {lat: 41.899163, lng: 12.473074}, category: 'Plaza', venueId: '4adcdac6f964a520285321e3'},
        {title: 'Sant’Agnese in Agone', location: {lat: 41.898844, lng: 12.472552}, category: 'Church', venueId: '4dd9140cfa76ad96d14c6838'},
        {title: 'Castel Sant’Angelo', location: {lat:41.903063, lng:12.466276}, category: 'Castle', venueId: '5379d816498e622ad5d701cb'},
        {title: 'St. Peter’s Basilica', location: {lat:41.902167, lng:12.453937}, category: 'Church', venueId: '4adcdac6f964a520105321e3'},
        {title: 'Sistine Chapel', location: {lat:41.902947, lng:12.454484}, category: 'Church', venueId: '4bd6f610637ba593c5f7f870'}
];

// Create a map variable
var map;

// Create a new blank array for all the listing markers.
var markers = [];

var Mapping = function(data){
    this.title = data.title;
    this.location = data.location; 
    this.category = data.category;
    this.venueId = data.venueId;
};

var ViewModel = function(){
    var self = this;
    
    //Create a mapList of all the locations and store it in an observableArray
    this.mapList = ko.observableArray([]);
    
    //Create a list of options from the categories in the locations array
    this.optionValues = ko.observableArray(["All","Church","Roman Temple","Plaza","Castle"]);
    //Default selection
    this.selectedOptionValue = ko.observable("All");
    
    //Add each location to the mapList as a new Mapping
    locations.forEach(function(place){
        self.mapList.push( new Mapping(place) );
    });
    
    //Filter the list displayed based on the categories selected
    //Source: https://codepen.io/blakewatson/pen/ZQXNmK with customizations
    this.filteredLocations = ko.computed(function(){
        var category = self.selectedOptionValue();
        if (category === "All"){
            hideMarkers();
            displayMarker(self.mapList());
            return self.mapList();
        }
        else {
            var tempList = self.mapList.slice();
            hideMarkers();
            //create a list of just the locations with the selected category
            var filterList = tempList.filter(function(location){
                return location.category === category;
            });
            //only display the filtered list
            displayMarker(filterList);
            return filterList;
        }
    });
    
    this.currentLocation = ko.observable( this.mapList()[0] );
    
    this.setLocation = function(clickedLocation) {
        self.currentLocation(clickedLocation);
        this.singleLoc = ko.observableArray([clickedLocation]);
        hideMarkers();
        //this doesn't work
        displayMarker(this.singleLoc());
        
        //how to change the appearance of the marker 
        
        //how to add api info
    };
    
    displayMarker(this.mapList());
};

var displayMarker = function(locationList){
    //Source: "starter code" from 06_StaticMap in Udacity and Google's Maps API Course
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 41.902701, lng: 12.496235},
        zoom: 15
    });
    
    var infowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    
    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locationList.length; i++) {
        // Get the position from the location array.
        var position = locationList[i].location;
        var title = locationList[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            content: '',
            id: i
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, infowindow);
        });
    }

    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
    //set zoom for single markers, so you are not on the rooftop of buildings
    var listener = google.maps.event.addListener(map, "idle", function() { 
        if(markers.length == 1){
            map.setZoom(18); 
        }
        google.maps.event.removeListener(listener); 
    });
};

var hideMarkers = function(){
    //hide all the markers on the map
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    //empty markers
    markers = [];
};

// "starter code" from 06_StaticMap in Udacity and Google's Maps API Course
var populateInfoWindow = function(marker, infowindow){
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div><h4>' + marker.title + '</h4>' + marker.content + '</div>');
        infowindow.open(map, marker);
        
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick',function(){
            infowindow.setMarker = null;
        });
    }
};

var initMap = function(){        
    ko.applyBindings(new ViewModel());
};

var menu = document.querySelector('#menu');
var main = document.querySelector('main');
var drawer = document.querySelector('#drawer');

menu.addEventListener('click', function(e) {
    drawer.classList.toggle('open');
    e.stopPropagation();
});

main.addEventListener('click', function() {
    drawer.classList.remove('open');
});