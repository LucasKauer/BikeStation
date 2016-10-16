'use strict';

$('#getRoute').submit(function(e){
    var lat1 = $('#lat1').val()
    , lng1 = $('#lng1').val()
    , lat2 = $('#lat2').val()
    , lng2 = $('#lng2').val();
    loadDataPoa.getRoute(new Location(lat1, lng1), new Location(lat2, lng2));
    e.preventDefault();
});

$('#sendAMessage').submit(function(e){
    var text1 = $('#text1').val();
    var text2 = $('#text2').val();
    $.post('http://localhost:3001/posts', {'text1': text1, 'text2': text2});
    loadData();
    e.preventDefault();
});

var loadData = function() {
    $('#chat').empty();
    $.get('http://localhost:3001/posts').success(function(dt) {
        dt.forEach(function(d) {
            $('#chat').append(`
            <input type="text" id="fieldText1${d.id}" value="${d.text1}">
            <input type="text" id="fieldText2${d.id}" value="${d.text2}">
            <button class="btn btn-warning" onclick="editData(${d.id},  '${'#fieldText1' + d.id}',  '${'#fieldText2' + d.id}')">Salvar Alterações</button>
            <button class="btn btn-danger" onclick="removeData(${d.id})">Remover anotação</button><br><br>
            `);
        });
    });
};

var editData = function(id, text1, text2) {
    $.ajax({ 
        url: `http://localhost:3001/posts/${id}`, 
        type: 'PUT',
        data:
        { 
            'text1':  $(text1).val(), 
            'text2': $(text2).val()
        }
    })
    .success(function() {
        loadData();
    });
};

var removeData = function(id) {
    $.ajax({
        url: `http://localhost:3001/posts/${id}`,
        type: 'DELETE',
        contentType:'application/json'
    }).success(function() {
        loadData();
    })
};

loadData();