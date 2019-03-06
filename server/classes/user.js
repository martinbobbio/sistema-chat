class Users {

    constructor(){
        this.people = [];
    }

    addPerson(id, name, room){
        let person = { id, name, room };
        this.people.push(person);
        return this.people;
    }

    getPerson(id){
        return this.people.filter(person => person.id === id)[0];
    }

    getPeople(){
        return this.people;
    }

    getPeopleByRoom(room){
        return this.people.filter(person => person.room === room);
    }

    deletePerson(id){
        let deletePerson = this.getPerson(id);
        this.people = this.people.filter(person => person.id !== id);
        return deletePerson;
    }
}

module.exports = {
    Users
}