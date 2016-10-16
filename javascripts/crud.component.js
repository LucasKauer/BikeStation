$('#getRoute').submit(function(e){
    var $lat1 = $('#lat1').val()
    , $lng1 = $('#lng1').val()
    , $lat2 = $('#lat2').val()
    , $lng2 = $('#lng2').val();
    loadDataPoa.getRoute(new Location($lat1, $lng1), new Location($lat2, $lng2));
    e.preventDefault();
});

$('#sendAMessage').submit(function(e){
    var $text1 = $('#text1').val();
    var $text2 = $('#text2').val();
    $.post('http://localhost:3001/posts', {'text1': $text1, 'text2': $text2});
    loadChat();
    e.preventDefault();
});

var loadChat = function() {
    $('#chat').empty();
    $.get('http://localhost:3001/posts').success(function(dt) {
        dt.forEach(function(d) {
            $('#chat').append(`
            <input type="text" id="fieldText1${d.id}" value="${d.text1}">
            <input type="text" id="fieldText2${d.id}" value="${d.text2}">
            <button class="btn btn-warning" onclick="editarData(${d.id},  '${'#fieldText1' + d.id}',  '${'#fieldText2' + d.id}')">Salvar Alterações</button>
            <button class="btn btn-danger" onclick="removerData(${d.id})">Remover anotação</button><br><br>
            `);
        });
    });
};
loadChat();

var editarData = function(idThis, text1, text2) {
    $.ajax({ 
        url: `http://localhost:3001/posts/${idThis}`, 
        type: 'PUT',
        data:
        { 
            'text1':  $(text1).val(), 
            'text2': $(text2).val()
        }
    })
    .success(function() {
        loadChat();
    });
}

var removerData = function(idThis) {
    $.ajax({
        url: `http://localhost:3001/posts/${idThis}`,
        type: 'DELETE',
        contentType:'application/json'
    }).success(function() {
        loadChat();
    })
}