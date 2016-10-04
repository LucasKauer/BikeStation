(function() { window.location.protocol="http"})()

var BikeStationDataPoaConfiguration = (function () {
	'use strict';

	var __static = {
		htmlModal: $('.modal-marker-template').clone().removeClass('modal-marker-template').html()
	};

	this.options = {
		resource_id: 'b64586af-cd7c-47c3-9b92-7b99875e1c08'
	};

	this.mapOptions = {
		zoom: 14
	};

	this.getInfoMarkerString = function (data) {
		var html = __static.htmlModal.replace('{{Name}}', this.getFriendlyName(data.nome))
																 .replace('{{Number}}', data.numero);
		return html;
	};

	this.getFriendlyName = function (name) {
		var result = name.replace(/\_/g, ' ');
		return result;
	};
});
