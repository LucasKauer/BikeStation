var loadDataPoa = { };

(function() {
  'use strict';

  google.maps.event.addDomListener(window, 'load', function () {
    var bikeStationDataPoaConfiguration = new BikeStationDataPoaConfiguration();
    loadDataPoa = new LoadDataPoa(bikeStationDataPoaConfiguration);

    loadDataPoa.init();
  });
})();
