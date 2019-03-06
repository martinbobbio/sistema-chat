var socket = io();

var params = new URLSearchParams(window.location.search);
if(!params.has('name') || !params.has('room')) {
    window.location = 'index.html';
    throw new Error('The name and room is required');
}

var user = { name:params.get('name'), room:params.get('room') };
var divUsers = $("#divUsuarios");
var formSend = $("#formEnviar");
var fieldMessage = $("#fieldMessage");
var divChatbox = $("#divChatbox");

function renderUsers(people){
    var html = '';

    html += '<li>';
    html += `<a href="javascript:void(0)" class="active"> Chat de <span> ${params.get("room")}</span></a>`;
    html += '</li>';

    for(var i=0;i<people.length;i++){
        html += '<li>';
        html += `<a data-id="${people[i].id}" href="javascript:void(0)"><img src="assets/images/users/${i+1}.jpg" alt="user-img" class="img-circle"> <span> ${people[i].name} <small class="text-success">online</small></span></a>`;
        html += '</li>';
    }
    
    divUsers.html(html);
}
function renderMessages(message, sender){

    var html = '';
    var adminClass = message.name === 'Admin' ? 'danger' : 'info';

    if(sender){
        html += `<li class="reverse animated fadeIn">`;
        html += `<div class="chat-content">`;
        html += `<h5>${message.name}</h5>`;
        html += `<div class="box bg-light-inverse">${message.message}</div>`;
        html += `</div>`;
        html += `<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>`;
        html += `<div class="chat-time">${new Date(message.date).getHours()} : ${new Date(message.date).getMinutes()}</div>`;
        html += `</li>`;
    }else{
        html += `<li class="animated fadeIn">`
        if(message.name !== 'Admin') html += `<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>`;
        html += `<div class="chat-content">`;
        html += `<h5>${message.name}</h5>`;
        html += `<div class="box bg-light-${adminClass}">${message.message}</div>`;
        html += `</div>`;
        html += `<div class="chat-time">${new Date(message.date).getHours()} : ${new Date(message.date).getMinutes()}</div>`;
        html += `</li>`;
    }
    divChatbox.append(html);
}

function scrollBottom() {

    var newMessage = divChatbox.children('li:last-child');

    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

divUsers.on('click', 'a', function(){
    var id = $(this).data('id');
    if(id){

    }
});
formSend.on('submit', function(e){
    e.preventDefault();
    if(fieldMessage.val().trim().length === 0) return;

    socket.emit('createMessage', {
        name: params.get('name'),
        room: params.get('room'),
        message: fieldMessage.val()
    }, function(message) {
        fieldMessage.val('').focus();
        renderMessages(message,true);
        scrollBottom();
    });

});




socket.on('connect', function() {
    socket.emit('enterChat', user, function(response){
        renderUsers(response);
    });
});

socket.on('listPerson', function(people) {
    renderUsers(people);
});

socket.on('createMessage', function(message) {
    renderMessages(message, false);
    scrollBottom();
});

socket.on('privateMessage', function(message) {

});

