var locations = [
        {title: 'Pantheon', location: {lat: 41.898611, lng: 12.476873}},
        {title: 'Santa Maria del Popolo', location: {lat: 41.911491, lng: 12.476656}},
        {title: 'St. Peter’s Square', location: {lat: 41.902218, lng: 12.456796}},
        {title: 'Santa Maria della Vittoria', location: {lat: 41.904701, lng: 12.494369}},
        {title: 'Piazza Navona', location: {lat: 41.899163, lng: 12.473074}},
        {title: 'Sant’Agnese in Agone', location: {lat: 41.898844, lng: 12.472552}},
        {title: 'Castel Sant’Angelo', location: {lat:41.903063, lng:12.466276}},
        {title: 'St. Peter’s Basilica', location: {lat:41.902167, lng:12.453937}},
        {title: 'Sistine Chapel', location: {lat:41.902947, lng:12.454484}}
];

var Model = function(){
    // Create a map variable
    var map;

    // Create a new blank array for all the listing markers.
    var markers = [];  
};

var ViewModel = function(){
    var self = this;
    
    //Create a mapList of all the locations and store it in an observableArray
    this.mapList = ko.observableArray([]);
    
    //
    locations.forEach(function(place){
        self.mapList.push( new Model(place) );
    });
    
    this.currentLocation = ko.observable( this.mapList()[0] );
    
    this.setLocation = function(clickedLocation) {
        self.currentLocation(clickedLocation);
    };
    
    //Apply the ko textInput binding to the search box in the view.
    //Add a query observable to the ViewModel.
    //Add a ko computed observable to the ViewModel.
    //Watch the query observable for changes in order to filter the places observableArray's place items.
};

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