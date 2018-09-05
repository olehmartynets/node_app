var express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

var jsonParser = bodyParser.json();
var app = express();

app.use(express.static(__dirname + '/public'));

app.get("/api/users", (request, response) => {

    var content = fs.readFileSync("users.json", "utf8");
    var users = JSON.parse(content);
    response.send(users);
});
app.get("/api/users/:id", (request, response) => {
    var id = request.params.id;
    var content = fs.readFileSync('users.json', 'utf8');
    var users = JSON.parse(content);
    var user = null;
    for (let i = 0; i < users.length; i++) {
        if(users[i].id == id) {
            user = users[i];
            break;
        }        
    }
    if (user) {
        response.send(user);
    } else {
        response.status(404).send();
    }
});
app.post('/api/users', jsonParser, (request, response) => {
    if(!request.body) return response.sendStatus(400);
    var userName = request.body.name;
    var userAge = request.body.age;
    var user = {name: userName, age: userAge};
    var data = fs.readFileSync('users.json', "utf8");
    var users = JSON.parse(data);
    var id = Math.max.apply(Math, users.map(function(o){return o.id;}))
    console.log(id);
    user.id = id +1;
    users.push(user);
    var data = JSON.stringify(users);
    fs.writeFileSync("users.json", data);
    response.send(user);
});

app.delete("/api/users/:id", (request, response) => {
    var id = request.params.id;
    console.log(request.params.id);
    var data = fs.readFileSync('users.json', 'utf8');
    var users = JSON.parse(data);
    var index = -1;

    for (let i = 0; i < users.length; i++) {
        if(users[i].id == id) {
            index = i;
            break;
        }        
    }
    if(index > -1) {
        var user = users.splice(index, 1)[0];
        var data = JSON.stringify(users);
        fs.writeFileSync("users.json", data);
        response.send(user);

    }else {
        res.status(404).send();
    }
});

app.put("/api/users", jsonParser, (request, response) => {
    if(!request.body) return response.sendStatus(400);
    var userId = request.body.id;
    var userName = request.body.name;
    var userAge = request.body.age;

    var data = fs.readFileSync("users.json", "utf8");
    var users = JSON.parse(data);
    var user;

    for(var i=0; i<users.length; i++){
        if(users[i].id==userId){
            user = users[i];
            break;
        }
    }
    if (user) {
        user.age = userAge;
        user.name = userName;
        var data = JSON.stringify(users);
        fs.writeFileSync("users.json", data);
        response.send(user);
    } else {
        response.status(404).send(user);
    }



});



app.listen(3000, () => {
    console.log("server waiting for request");
})