function ready( fn ) {
  /*
    Wait until the page has loaded.
    http://youmightnotneedjquery.com/#ready
  */
  if ( document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading' ){
    fn();
  } else {
    document.addEventListener( 'DOMContentLoaded', fn );
  }
}

ready( function(){
  function makeApiCall( url, callback ){
    /*
      A helper function for making API calls.
    */
    var xhr = new XMLHttpRequest();

    xhr.addEventListener( 'load', function(){
      var response = {};

      try{
        response = JSON.parse(xhr.responseText);
      } catch( err ){ /* noop */ }

      if ( callback ){
        callback( response );
      }
    });

    xhr.open( 'GET', url );
    xhr.send();
  }

  makeApiCall( 'https://location-weather-api.glitch.me/weather?api_key=1c66c7e9-129e-49b1-95de-f4f5d706d914', function( data ){
    
    var location = data.location.city + ', ' + data.location.region;
    var weather = data.weather.weather[0].main;
    var weatherDescription = data.weather.weather[0].description;
    var temperature = data.weather.main.temp;
    
    document.getElementById( 'city' ).innerHTML = location;
    document.getElementById( 'weather' ).innerHTML = Math.round( temperature ) + '°F, ' + weatherDescription;

    makeApiCall( 'https://location-weather-api.glitch.me/background?api_key=1c66c7e9-129e-49b1-95de-f4f5d706d914&weather=' + weather + '&latitude=' + data.location.lat + '&longitude=' + data.location.lon, function( data ){
      var imageSourceLink = document.getElementById( 'image-source' );
      
      if (data && data.photos && data.photos.pages > 0){
				var photo = data.photos.photo[0];
        
				document.body.style.backgroundImage = "url('" + photo.url_l + "')";
				imageSourceLink.setAttribute( 'href', 'http://www.flickr.com/photos/' + photo.owner + '/' + photo.id );
			}
			else{
				document.body.style.backgroundImage = 'url("https://fourtonfish.com/tutorials/weather-web-app/images/default.jpg")';
				imageSourceLink.setAttribute( 'href', 'https://www.flickr.com/photos/superfamous/310185523/sizes/o/' );
			}      
    });
  });
});
