var locations = [
        {title: 'Pantheon', location: {lat: 41.898611, lng: 12.476873}, category: 'Roman Temple'},
        {title: 'Santa Maria del Popolo', location: {lat: 41.911491, lng: 12.476656}, category: 'Church'},
        {title: 'St. Peter’s Square', location: {lat: 41.902218, lng: 12.456796}, category: 'Plaza'},
        {title: 'Santa Maria della Vittoria', location: {lat: 41.904701, lng: 12.494369}, category: 'Church'},
        {title: 'Piazza Navona', location: {lat: 41.899163, lng: 12.473074}, category: 'Piazza'},
        {title: 'Sant’Agnese in Agone', location: {lat: 41.898844, lng: 12.472552}, category: 'Church'},
        {title: 'Castel Sant’Angelo', location: {lat:41.903063, lng:12.466276}, category: 'Castle'},
        {title: 'St. Peter’s Basilica', location: {lat:41.902167, lng:12.453937}, category: 'Church'},
        {title: 'Sistine Chapel', location: {lat:41.902947, lng:12.454484}, category: 'Church'}
];

var Mapping = function(data){
    this.title = data.title;
    this.location = data.location; 
    this.category = data.category;
};

var ViewModel = function(){
    var self = this;
    
    //Create a mapList of all the locations and store it in an observableArray
    this.mapList = ko.observableArray([]);
    
    //Create a list of options from the categories in the locations array
    this.optionValues = ko.observableArray(["All","Church","Roman Temple","Plaza","Piazza","Castle"]);
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
            return self.mapList();
        }
        else {
            var tempList = self.mapList.slice();
            return tempList.filter(function(location){
                return location.category === category;
            });
        }
    });
    
    this.currentLocation = ko.observable( this.mapList()[0] );
    
    this.setLocation = function(clickedLocation) {
        self.currentLocation(clickedLocation);
    };
};

// "starter code" from 06_StaticMap in Udacity and Google's Maps API Course
var populateInfoWindow = function(marker, infowindow){
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
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