var Constants = (function () {
    'use strict';

    var _const = {
        ids: {
            containers: {
                map: '#mapContainer'
            }
        },
        titles: {
            markers: {
                routes: {
                    origin: 'Ponto de Partida',
                    originNearestBikeStation: 'Estação de Bicicleta Mais Próxima do Ponto de Partida',
                    destinationNearestBikeStation: 'Estação de Bicicleta Mais Próxima do Ponto de Chegada',
                    destination: 'Ponto de Chegada'
                }
            }
        },
        messages: {
            generic: {
                success: '',
                error: 'Ocorreu um erro no sistema. Erro: {{erro}}'
            }
        },
        urls: {
            datapoa: 'http://datapoa.com.br/api/action/datastore_search',
            icons: {
                map: {
                   markers: {
                       cycling: 'http://maps.google.com/mapfiles/ms/micons/cycling.png',
                       woman: 'http://maps.google.com/mapfiles/ms/micons/woman.png',
                   } 
                }
            }
        },
        colors: {
            blue: 'blue',
            green: 'green'
        }
    };

    return {
        get: _const
    };
})();