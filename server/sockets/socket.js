const { io } = require('../server');
const { Users } = require('../classes/user');
const { createMessage } = require('../constants')

const users = new Users();

io.on('connection', (client) => {

    client.on('enterChat', (data, callback)=>{
        if(!data.name || !data.room){
            return callback({
                error:true,
                message: 'The name and room is required',
            });
        }
        client.join(data.room);

        let people = users.addPerson(client.id, data.name, data.room);

        client.broadcast.to(data.room).emit('listPerson', users.getPeopleByRoom(data.room));
        client.broadcast.to(data.room).emit('createMessage', createMessage('Admin',`${data.name} ingresó`));

        callback(people);
    });

    client.on('createMessage', (data, callback) =>{
        let message = createMessage(data.name, data.message);
        client.broadcast.to(data.room).emit('createMessage', message);
        callback(message);
    });

    client.on('privateMessage', (data) =>{
        let person = users.getPerson(client.id);
        client.broadcast.to(data.para).emit('privateMessage', createMessage(person.name, data.message));
    });

    client.on('disconnect', ()=>{
        let deletePerson = users.deletePerson(client.id);

        client.broadcast.to(deletePerson.room).emit('createMessage', createMessage('Admin',`${deletePerson.name} salió`));
        client.broadcast.to(deletePerson.room).emit('listPerson', users.getPeopleByRoom(deletePerson.room));
    });
});