let fs = require('fs');
let url = require('url');
let http = require('http');
let mysql = require('mysql');
let serverTools = require('./serverTools');
const { log } = require('console');

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

            if(path.startsWith("/register")){//passes to the server the detalies of the new user{
                if(req.method == "POST"){
                    serverTools.readPostBody(req, (strBody)=>{
                        let body = JSON.parse(strBody);
                        
                        email = body.email;
                        password = body.password;
                        let name = body.name;
                        let image = body.image;

                        if(!name || !email || !password || !image ){
                            res.writeHead(400, {'Content-Type':'text/plain'});
                            res.write("Insufficient information to send a message");
                            res.end();
                            return;
                        }
                        
                        if(serverTools.serverValidateRegister(email, password, name)){
                            //email, password and name are valid
                            connection = mysql.createConnection(connectionDetails);
                            let strname = name+"";
                            let stremail = email+"";
                            let strpassword = password+"";
                            connection.query("INSERT INTO users(email, password, name, profile_picture) VALUES(?,?,?,?)",[stremail,strpassword,strname, image],(error1,result1)=>{
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
                        
                    });
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

            if(path.startsWith("/updateUser")){ //updates user information
                if(req.method == "POST"){
                    serverTools.readPostBody(req, (strBody)=>{
                        let body = JSON.parse(strBody);
                        
                        email = body.email;
                        password = body.password;
                        let newName = body.newName;
                        let newPassword = body.newPassword;
                        let newImage = body.newImage;

                        if(!newName && !newPassword && !newImage){
                            res.writeHead(400, {'Content-Type':'text/plain'});
                            res.write("nothing needed to update in the user profile");
                            res.end();
                            return;
                        }

                        connection = mysql.createConnection(connectionDetails);

                        verifyLogin(res,connection, (connection)=>{
                            let updateStr = newName ? "name='"+newName+"'," : "";
                            updateStr += newPassword ? "password='"+password+"'," : "";
                            updateStr += newImage ? "profile_picture='"+newImage+"'" : "";
                            if(updateStr[updateStr.length-1] == ",") updateStr = updateStr.substring(0,updateStr.length-1);

                            connection.query("UPDATE users SET "+updateStr+" WHERE email=?",[email],(error,result)=>{
                                connection.end();
                                if(error){
                                    res.writeHead(500, {'Content-Type':'text/plain'});
                                    res.write("could not update user's detailes");
                                    res.end();
                                    return;
                                }
                                res.writeHead(200, {'Content-Type':'text/plain'});
                                res.end();
                                return;
                            });
                        });
                    });
                }
                else{
                    res.writeHead(400, {'Content-Type':'text/plain'});
                    res.write("wrong request method used in while trying to update the user details");
                    res.end();
                    return;
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
    connection.query("SELECT u.email, u.name, u.profile_picture, m.content, m.time FROM users u JOIN ( SELECT MAX(id) AS last_message_id, CASE WHEN sender = ? THEN recipient WHEN recipient = ? THEN sender END AS contact_email FROM messages JOIN users s ON s.email = messages.sender JOIN users r ON r.email = messages.recipient WHERE s.email = ? OR r.email = ? GROUP BY contact_email ) l ON l.contact_email = u.email JOIN messages m ON m.id = l.last_message_id ORDER BY m.time DESC;", [email,email,email,email],(error1, result1)=>{
        if(error1){
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.write("run into problem while trying to pull the contacts");
            res.end();
            return;
        }

        // retriving personal information
        connection.query("SELECT * FROM users WHERE email=?",[email],(error2,result2)=>{
            connection.end();
            if(error2){
                res.writeHead(200,{'Content-Type':'text/plain'});
                res.write("the server encountered an issue while trying to retrive the user's information");
                res.end();
            }
            let myDetailes = result2[0];
            
            for(let i = 0; i<result1.length; i++){
                let lastmessage = serverTools.findLast(messages,(mess) =>{return (mess.sender==result1[i].email || mess.recipient==result1[i].email)});
                result1[i].lastmessage = lastmessage;
            }

            let newMessages = messages.filter((message)=>message.id>lastId);

            let response = {
                presonalInfo:myDetailes,
                contacts:result1,
                messages:newMessages
            };

            res.writeHead(200, {'Content-Type':'application/JSON'});
            res.end(JSON.stringify(response));
            return;
        });

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

