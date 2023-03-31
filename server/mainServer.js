let fs = require('fs');
let url = require('url');
let http = require('http');
let mysql = require('mysql');
let serverTools = require('./serverTools');

let connectionDetails = {
    host: "localhost",
    user: "root",
    password: "22022202",
    database: "chatify"
};

let email, password, connection;

http.createServer((req, res)=>{
    let reqUrl = url.parse(req.url, true);
    let path = reqUrl.path;

    if(path.startsWith("/api")){
        //API requests
        res.setHeader("Access-Control-Allow-Origin","*"); //allows all http request from any origin

        if(req.method == "GET" && !path.startsWith("/api/registerParameters")){
            email = reqUrl.query.email;
            password = reqUrl.query.password;
        }

        if(path.startsWith("/api/registerParameters")){
            res.writeHead(200, {'Content-Type':'application/json'});
            res.write(serverTools.getParametersOfRegister());
            res.end();
            return;
        }

        if(req.method == "POST" || (email && password)){

            path = path.substring(4);

            if(path.startsWith("/register")){//passes to the server the detalies of the new user
                let name = reqUrl.query.name;
                if(!name){
                    res.writeHead(400, {'Content-Type':'text/plain'});
                    res.write("name is missing");
                    res.end();
                    return;
                }
                if(serverTools.serverValidateRegister(email, password, name)){
                    //email, password and name are valid
                    connection = mysql.createConnection(connectionDetails);
                    let strname = name+"";
                    let stremail = email+"";
                    let strpassword = password+"";
                    connection.query("INSERT INTO users(email, password, name) VALUES(?,?,?)",[stremail,strpassword,strname],(error1,result1)=>{
                        connection.end();
                        if(error1){
                            res.writeHead(500, {'Content-Type':'text/plain'});
                            res.write("User already exists");
                            res.end();
                            return;
                        }
                        if(result1.affectedRows == 1){
                            res.writeHead(200, {'Content-Type':'text/plain'});
                            res.write("successful");
                            res.end();
                            return;
                        }
                        else{
                            res.writeHead(500, {'Content-Type':'text/plain'});
                            res.write("The user wasn't created");
                            res.end();
                            return;
                        }
                    });
                }
                else{
                    //email, password and name are not valid
                    res.writeHead(400, {'Content-Type':'text/plain'});
                    res.write("invalid email / password / name.");
                    res.end();
                    return;
                }
            }

            if(path.startsWith("/login") || path.startsWith("/pull")){//verifys the login detailes and pulls messages from the database if login is successful 
                
                connection = mysql.createConnection(connectionDetails);
                verifyLogin(res,connection, (connection)=>{
                    
                    let lastId = path.startsWith("/login") ? 0 : parseInt(reqUrl.query.lastId);
                    //pulling the messages
                    connection.query("SELECT * FROM messages WHERE (sender=? OR recipient=?)",[email, email],(error2, result2)=>{
                        if(error2){
                            connection.end();
                            res.writeHead(500, {'Content-Type':'text/plain'});
                            res.write("error occured in the database while tryin to pull the messages");
                            res.end();
                            return;
                        }
                        pullContacts(res,result2,lastId,connection);
                    });
                });
            }

            if(path.startsWith("/send")){//inserts a message to the database
                
                if(req.method == "POST"){
                    serverTools.readPostBody(req, (strBody)=>{
                        let body = JSON.parse(strBody);
                        
                        email = body.email;
                        password = body.password;
                        let recipient = body.recipient;
                        let content = body.content;

                        if(!recipient || !email || !password || !content || content =="" || !body.time){
                            res.writeHead(400, {'Content-Type':'text/plain'});
                            res.write("Insufficient information to send a message");
                            res.end();
                            return;
                        }

                        connection = mysql.createConnection(connectionDetails);

                        verifyLogin(res,connection, (connection)=>{
                            connection.query("INSERT INTO messages(sender,recipient,content,time) VALUES(?,?,?,?)",[email, recipient, content, body.time],(error, result)=>{
                                connection.end();
                                if(error){
                                    res.writeHead(500, {'Content-Type':'text/plain'});
                                    res.write("error occured in the database while tryin to send a message");
                                    res.end();
                                    return;
                                }
                                res.writeHead(200, {'Content-Type':'text/plain'});
                                res.write("successful");
                                res.end();
                                return;
                            });
                        });
                    });
                }
            }
        }

        else{
            res.writeHead(400, {'Content-Type':'text/plain'});
            res.write("please pass on both email and password or choose the correct request method");
            res.end();
            return;
        }
    }

    else{
        // static files
        serverTools.fileServer("../client",reqUrl.path,"/public/index.html", res);
    }

}).listen(8080);

function verifyLogin(res, connection, successCallback){ //responsible for verifying your information against the database
    connection.connect((error1)=>{
        if(error1){
            connection.end();
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.write("run into problem while trying to connect to the database");
            res.end();
            return;
        }
        connection.query("SELECT COUNT(email) as count FROM users WHERE email=? AND BINARY password=?",[email, password],(error1, result1)=>{
            if(error1){
                connection.end();
                res.writeHead(500, {'Content-Type':'text/plain'});
                res.write("error occured in the database while tryin to verify the login detalies");
                res.end();
                return;
            }
            if(result1[0].count === 1){
                //found the user and detailes were correct
                successCallback(connection);
                return;
            }
            else{
                //incorrect detailes
                connection.end();
                res.writeHead(200, {'Content-Type':'text/plain'});
                res.write("wrong detailes");
                res.end();
                return;
            }
        })
    })
}

function pullContacts(res,messages, lastId, connection){ //resposible for pulling the contact by the most relevent contacts
    connection.query("SELECT table1.sender as email, users.name FROM (SELECT MAX(time) AS last_message_time, sender AS sender FROM messages WHERE sender=? OR recipient=? GROUP BY sender) AS table1 INNER JOIN users ON users.email = table1.sender ORDER BY last_message_time DESC;", [email, email], (error1, result1)=>{
        connection.end();
        if(error1){
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.write("run into problem while trying to query the database");
            res.end();
            return;
        }
        let indexOfMyEmail = findIndexByfield("email", email, result1);
        indexOfMyEmail == -1 ? "" :result1.splice(indexOfMyEmail,1);

        for(let i = 0; i<result1.length; i++){
            let lastmessage = serverTools.findLast(messages,(mess) =>{return (mess.sender==result1[i].email || mess.recipient==result1[i].email)});
            result1[i].lastmessage = lastmessage;
        }

        let newMessages = messages.filter((message)=>message.id>lastId);

        let response = {
            contacts:result1,
            messages:newMessages
        };

        res.writeHead(200, {'Content-Type':'application/JSON'});
        res.end(JSON.stringify(response));
        return;
    });
}

function findIndexByfield(fieldName, val, array) { //only meant to find object's position according to a spesified field and val
    for (let i = 0; i < array.length; i++) {
      if (array[i][fieldName] === val) {
        return i;
      }
    }
    return -1; 
}

