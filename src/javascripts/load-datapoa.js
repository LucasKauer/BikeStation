var LoadDataPoa = (function (dataPoaConfiguration) {
	'use strict';

	var _datas = [];
	var _markers = [];

	var __const = {
		route: {
			names: {
				origin: 'Ponto de Partida',
				originNearestBikeStation: 'Estação de Bicicleta Mais Próxima do Ponto de Partida',
				destinationNearestBikeStation: 'Estação de Bicicleta Mais Próxima do Ponto de Chegada',
				destination: 'Ponto de Chegada'
			}
		}
	}

	var __mapProperties = {
		map: { },
		infoWindow: new google.maps.InfoWindow(),
	  bounds: new google.maps.LatLngBounds(),
	  directionsService : new google.maps.DirectionsService(),
	  directionsDisplay1: { },
	  directionsDisplay2: { },
	  directionsDisplay3: { },
		icons: {
		    cycling: new google.maps.MarkerImage(
		    	'http://maps.google.com/mapfiles/ms/micons/cycling.png',
					new google.maps.Size(44, 32),
					new google.maps.Point(0, 0),
					new google.maps.Point(22, 32)
				),
		    woman: new google.maps.MarkerImage(
			    'http://maps.google.com/mapfiles/ms/micons/woman.png',
			    new google.maps.Size(44, 32),
			    new google.maps.Point(0, 0),
			    new google.maps.Point(22, 32)
				)
		}
	};

	var __options = {
		resource_id: '',
		data_poa_url: 'http://datapoa.com.br/api/action/datastore_search',
		poa_coordinates: { lat: -30.052778, long: -51.23 }
	};

	$.extend(__options, dataPoaConfiguration.options);

	var __mapOptions = {
		maxZoom: 20,
		minZoom: 10,
		zoom: 15,
		zoomControlOptions: {
			style: google.maps.ZoomControlStyle.SMALL
		},
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		center: new google.maps.LatLng(__options.poa_coordinates.lat, __options.poa_coordinates.long)
	};

	$.extend(__mapOptions, dataPoaConfiguration.mapOptions);

	var init = function () {
		getDataPoa();
	};

	var getDataPoa = function	() {
		var data = {
			resource_id: __options.resource_id
		};

		$.ajax({
			url: __options.data_poa_url,
			data: data,
			dataType: 'jsonp',
			success: onSuccessResponseDataPoa,
			error: onErrorResponseDataPoa
		});
	};

	var onSuccessResponseDataPoa = function (data) {
		_datas = $.extend({ }, data.result.records);
		initializeMap();
	}

	var onErrorResponseDataPoa = function (error) {

	}

	var initializeMap = function () {

		var mapContainer = $("#mapContainer")[0];
	 	__mapProperties.map = new google.maps.Map(mapContainer, __mapOptions);

		__mapProperties.directionsDisplay1 = new google.maps.DirectionsRenderer(getDirectionsRendererConfig('blue'));
		__mapProperties.directionsDisplay2 = new google.maps.DirectionsRenderer(getDirectionsRendererConfig('green'));
		__mapProperties.directionsDisplay3 = new google.maps.DirectionsRenderer(getDirectionsRendererConfig('blue'));

		initializeMarkers();
	};

	var getDirectionsRendererConfig = function (strokeColor) {
		var config = {
			map: __mapProperties.map,
			preserveViewport: true,
			suppressMarkers: true,
			polylineOptions : { strokeColor: strokeColor }
		};

		return config;
	};

	var initializeMarkers = function () {

		$.each(_datas, function(index, element) {

			var marker = createMarker(getBikeStationMarkerConfig(element.nome, element.LATITUDE, element.LONGITUDE));

			var content = dataPoaConfiguration.getInfoMarkerString(element);
			createMarkerInfo(marker, element, content);
	 	});
	};

	var getBikeStationMarkerConfig = function (nome, latitude, longitude) {
		var config = {
			position: new google.maps.LatLng(latitude, longitude),
			map: __mapProperties.map,
			title: dataPoaConfiguration.getFriendlyName(nome)
		};

		return config;
	};

	var createMarkerInfo = function (marker, element, content) {
		google.maps.event.addListener(marker, 'click', function() {
			__mapProperties.infoWindow.setContent(content);
			__mapProperties.infoWindow.open(__mapProperties.map, marker);
		});
	};

	var getRoute = function (originLocation, destinationLocation) {
		var origin = new google.maps.LatLng(originLocation.getLatitude(), originLocation.getLongitude());
		var originNearestBikeStation = getNearestPositionFrom(originLocation);
		var destinationNearestBikeStation = getNearestPositionFrom(destinationLocation);
		var destination = new google.maps.LatLng(destinationLocation.getLatitude(), destinationLocation.getLongitude());

		setRouteOnTheMap(origin, originNearestBikeStation, __const.route.names.origin, __const.route.names.originNearestBikeStation + '1', google.maps.TravelMode.WALKING, __mapProperties.directionsDisplay1);
		setRouteOnTheMap(originNearestBikeStation, destinationNearestBikeStation, __const.route.names.originNearestBikeStation + '2', __const.route.names.destinationNearestBikeStation + '1',  google.maps.TravelMode.BICYCLING, __mapProperties.directionsDisplay2);
		setRouteOnTheMap(destinationNearestBikeStation, destination, __const.route.names.destinationNearestBikeStation + '2', __const.route.names.destination,  google.maps.TravelMode.WALKING, __mapProperties.directionsDisplay3);
	};

	var getNearestPositionFrom = function (location) {
		var min = Number.MAX_VALUE;
		var nearestPoint = { };

		for (var item in _markers) {

	   	var markerLocation = new Location(_markers[item].position.lat(), _markers[item].position.lng());
			var distance = location.getDistanceTo(markerLocation);

			min = Math.min(min, distance);
			if (min === distance) {
				nearestPoint = _markers[item];
			}
		}

		return nearestPoint.position;
	};

	var setRouteOnTheMap = function (origin, destination, originName, destinationName, travelMode, directionsDisplay) {
		var request = getDirectionsServiceRequest(origin, destination, travelMode);

		__mapProperties.directionsService.route(request, function(result, status) {
	    if (status == google.maps.DirectionsStatus.OK) {
	      directionsDisplay.setDirections(result);

				var icon = getIconByTravelMode(travelMode);
				var leg = result.routes[0].legs[0];
				createMarker(getRoutePointMarkerConfig(originName, icon, leg.start_location));
				createMarker(getRoutePointMarkerConfig(destinationName, icon, leg.end_location));
				// __mapProperties.map.fitBounds(__mapProperties.bounds.union(result.routes[0].bounds));
	    } else {
	      alert("Ocorreu um erro ao calcular as distâncias: " + status);
	    }
	  });
	};

	var getDirectionsServiceRequest = function (originLatLng, destinationLatLng, travelMode) {
		var request = {
	    origin: originLatLng,
	    destination: destinationLatLng,
			optimizeWaypoints: true,
	    travelMode: travelMode
	  };

		return request;
	};

	var getIconByTravelMode = function (travelMode) {
		var icon;

		switch(travelMode) {
			case google.maps.TravelMode.WALKING:
		    icon = __mapProperties.icons.woman;
		    break;
			case google.maps.TravelMode.BICYCLING:
		    icon = __mapProperties.icons.cycling;
		    break;
		}

		return icon;
	};

	var createMarker = function (markerConfig) {
		var marker = new google.maps.Marker(markerConfig);

		addMarkerInArray(marker.title, marker.position);

		return marker;
	};

	var addMarkerInArray = function (title, position) {
		_markers[title] = {
			position: position
		};
	};

	var getRoutePointMarkerConfig = function (nome, icon, position) {
		var config = {
			title: nome,
			icon: icon,
			position: position,
			map: __mapProperties.map
		};

		return config;
	};

	return {
		init: init,
		getRoute: getRoute
	};
});
