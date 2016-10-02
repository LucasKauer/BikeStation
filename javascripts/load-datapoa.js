var LoadDataPoa = (function (dataPoaConfiguration) {
	'use strict';

	var goo = google.maps;

	var _datas = [];
	var _markers = [];
	var _routeMarkers = [];

	var __mapProperties = {
		map: { },
		infoWindow: new goo.InfoWindow(),
		//bounds: new goo.LatLngBounds(),
	  	directionsService : new goo.DirectionsService(),
	  	directionsDisplay1: { },
	  	directionsDisplay2: { },
	  	directionsDisplay3: { },
		icons: {
		    cycling: new goo.MarkerImage(
		    	Constants.get.urls.icons.map.markers.cycling,
					new goo.Size(44, 32),
					new goo.Point(0, 0),
					new goo.Point(22, 32)
				),
		    woman: new goo.MarkerImage(
			    Constants.get.urls.icons.map.markers.woman,
			    new goo.Size(44, 32),
			    new goo.Point(0, 0),
			    new goo.Point(22, 32)
				)
		}
	};

	var __options = {
		resource_id: '',
		data_poa_url: Constants.get.urls.datapoa,
		poa_coordinates: { lat: -30.052778, long: -51.23 }
	};

	$.extend(__options, dataPoaConfiguration.options);

	var __mapOptions = {
		maxZoom: 20,
		minZoom: 10,
		zoom: 15,
		zoomControlOptions: {
			style: goo.ZoomControlStyle.SMALL
		},
		mapTypeId: goo.MapTypeId.ROADMAP,
		center: new goo.LatLng(__options.poa_coordinates.lat, __options.poa_coordinates.long)
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

		var mapContainer = $(Constants.get.ids.containers.map)[0];
	 	__mapProperties.map = new goo.Map(mapContainer, __mapOptions);

		__mapProperties.directionsDisplay1 = new goo.DirectionsRenderer(getDirectionsRendererConfig(Constants.get.colors.blue));
		__mapProperties.directionsDisplay2 = new goo.DirectionsRenderer(getDirectionsRendererConfig(Constants.get.colors.green));
		__mapProperties.directionsDisplay3 = new goo.DirectionsRenderer(getDirectionsRendererConfig(Constants.get.colors.blue));

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

			var marker = createMarker(getBikeStationMarkerConfig(element.nome, element.LATITUDE, element.LONGITUDE), _markers);

			var content = dataPoaConfiguration.getInfoMarkerString(element);
			createMarkerInfo(marker, element, content);
	 	});
	};

	var getBikeStationMarkerConfig = function (nome, latitude, longitude) {
		var config = {
			position: new goo.LatLng(latitude, longitude),
			map: __mapProperties.map,
			title: dataPoaConfiguration.getFriendlyName(nome)
		};

		return config;
	};

	var createMarkerInfo = function (marker, element, content) {
		goo.event.addListener(marker, 'click', function() {
			__mapProperties.infoWindow.setContent(content);
			__mapProperties.infoWindow.open(__mapProperties.map, marker);
		});
	};

	var getRoute = function (originLocation, destinationLocation) {
		var origin = new goo.LatLng(originLocation.getLatitude(), originLocation.getLongitude());
		var originNearestBikeStation = getNearestPositionFrom(originLocation);
		var destinationNearestBikeStation = getNearestPositionFrom(destinationLocation);
		var destination = new goo.LatLng(destinationLocation.getLatitude(), destinationLocation.getLongitude());

		setRouteOnTheMap(origin, originNearestBikeStation, Constants.get.titles.markers.routes.origin, Constants.get.titles.markers.routes.originNearestBikeStation + '_', goo.TravelMode.WALKING, __mapProperties.directionsDisplay1);
		setRouteOnTheMap(originNearestBikeStation, destinationNearestBikeStation, Constants.get.titles.markers.routes.originNearestBikeStation, Constants.get.titles.markers.routes.destinationNearestBikeStation + '_',  goo.TravelMode.BICYCLING, __mapProperties.directionsDisplay2);
		setRouteOnTheMap(destinationNearestBikeStation, destination, Constants.get.titles.markers.routes.destinationNearestBikeStation, Constants.get.titles.markers.routes.destination,  goo.TravelMode.WALKING, __mapProperties.directionsDisplay3);
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
	    if (status == goo.DirectionsStatus.OK) {
	      directionsDisplay.setDirections(result);

				var icon = getIconByTravelMode(travelMode);
				var leg = result.routes[0].legs[0];
				createMarker(getRoutePointMarkerConfig(originName, icon, leg.start_location), _routeMarkers);
				createMarker(getRoutePointMarkerConfig(destinationName, icon, leg.end_location), _routeMarkers);
				// __mapProperties.map.fitBounds(__mapProperties.bounds.union(result.routes[0].bounds));
	    } else {
	      alert(Constants.get.messages.generic.error.replace('{{erro}}', status));
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
			case goo.TravelMode.WALKING:
		    icon = __mapProperties.icons.woman;
		    break;
			case goo.TravelMode.BICYCLING:
		    icon = __mapProperties.icons.cycling;
		    break;
		}

		return icon;
	};

	var createMarker = function (markerConfig, markerArr) {
		var marker = new goo.Marker(markerConfig);

		addMarkerInArray(marker, markerArr);

		return marker;
	};

	var addMarkerInArray = function (marker, markerArr) {
		markerArr[marker.title] = {
			position: marker.position,
			marker: marker
		};
	};

	var clearRoutesMarkers = function () {
		_routeMarkers[Constants.get.titles.markers.routes.origin].marker.setMap(null);
		_routeMarkers[Constants.get.titles.markers.routes.originNearestBikeStation].marker.setMap(null);
		_routeMarkers[Constants.get.titles.markers.routes.originNearestBikeStation + '_'].marker.setMap(null);
		_routeMarkers[Constants.get.titles.markers.routes.destinationNearestBikeStation].marker.setMap(null);
		_routeMarkers[Constants.get.titles.markers.routes.destinationNearestBikeStation + '_'].marker.setMap(null);
		_routeMarkers[Constants.get.titles.markers.routes.destination].marker.setMap(null);
		
		_routeMarkers = [];

		__mapProperties.directionsDisplay1.set('directions', null);
		__mapProperties.directionsDisplay2.set('directions', null);
		__mapProperties.directionsDisplay3.set('directions', null);
	}

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
		getRoute: getRoute,
		clearRoutesMarkers: clearRoutesMarkers
	};
});
