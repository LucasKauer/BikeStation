var Location = (function (latitude, longitude) {

  var __static = {
    radiusOfTheEarthInKm: 6371
  }

  var properties = {
    latitude: latitude,
    longitude: longitude
  };

	var getDistanceTo = function (otherLocation) {
		var dLat = toRad((otherLocation.getLatitude() - properties.latitude));
		var dLon = toRad((otherLocation.getLongitude() - properties.longitude));

		var firstPart = Math.pow(Math.sin(dLat/2), 2) +
		                (
											Math.cos(toRad(properties.latitude)) *
										 	Math.cos(toRad(otherLocation.getLatitude())) *
		                 	Math.sin(dLon/2) * Math.sin(dLon/2)
									 );
		var secondPart = 2 * Math.atan2(Math.sqrt(firstPart), Math.sqrt(1-firstPart));

		var finalPart = __static.radiusOfTheEarthInKm * secondPart;
		return finalPart;
	};

	var toRad = function(number) {
		 return number * Math.PI / 180;
	};

  return {
    getLatitude: function () { return properties.latitude; },
    getLongitude: function () { return properties.longitude; },
    getDistanceTo: getDistanceTo
  };
});
