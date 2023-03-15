let fs = require('fs');
let url = require('url');
let http = require('http');
let mysql = require('mysql');

let connectionDetails = {
    host: "localhost",
    user: "root",
    password: "22022202",
    database: "chatify"
};

let email, password;

http.createServer((req, res)=>{
    let reqUrl = url.parse(req.url, true);
    let path = reqUrl.path;

    if(path.startsWith("/api")){
        //API requests
        email = reqUrl.query.email;
        password = reqUrl.query.password;

        if(!email || !password){
            res.writeHead(400, {'Content-Type':'text/plain'});
            res.write("please pass on both email and password");
            res.end();
        }

        path = path.substring(4);

        if(path.startsWith("/register")){
            //passes to the server the detalies of the new user

        }
        if(path.startsWith("/login") || path.startsWith("/pull")){
            //verifys the login detailes and pulls messages from the database if login is successful 
            let connection = mysql.createConnection(connectionDetails);
            verifyLogin(res, email, password,connection, (error1, result1, connection)=>{
                if(error1){
                    connection.end();
                    res.writeHead(500, {'Content-Type':'text/plain'});
                    res.write("error occured in the database while tryin to verify the login detalies");
                    res.end();
                    return;
                }
                if(result1[0].count === 1){
                    //found the user and detailes were correct
                    let lastId = path.startsWith("/login") ? 0 : reqUrl.query.lastId;
                    //pulling the messages
                    connection.query("SELECT * FROM messages WHERE (sender=? OR recipient=?) AND id>?",[email, email, lastId],(error2, result2)=>{
                        if(error2){
                            connection.end();
                            res.writeHead(500, {'Content-Type':'text/plain'});
                            res.write("error occured in the database while tryin to pull the messages");
                            res.end();
                            return;
                        }
                        pullContacts(res,result2,email,connection);
                    });
                }
                else{
                    //incorrect detailes
                    connection.end();
                    res.writeHead(200, {'Content-Type':'text/plain'});
                    res.write("wrong detailes");
                    res.end();
                    return;
                }
            });
        }
        if(path.startsWith("/send")){
            //inserts a message to the database
        }
    }
    else{
        // static files
    }

}).listen(8080);

function verifyLogin(res, email, password,connection, callback){ //responsible for verifying your information against the database
    connection.connect((error1)=>{
        if(error1){
            connection.end();
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.write("run into problem while trying to connect to the database");
            res.end();
        }
        connection.query("SELECT COUNT(email) as count FROM users WHERE email=? AND BINARY password=?",[email, password],(error1, result1)=>{
            callback(error1, result1, connection);
        })
    })
}

function pullContacts(res,result1, email, connection){ //resposible for pulling the contact by the most relevent contacts
    connection.query("SELECT sender FROM (SELECT max(time) AS last_message_time, sender FROM messages WHERE sender=? OR recipient=? GROUP BY sender) AS table1 ORDER BY last_message_time DESC;", [email, email], (error2, result2)=>{
        if(error2){
            connection.end();
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.write("run into problem while trying to query the database");
            res.end();
        }
        let response = {
            contacts:result2,
            messages:result1
        };
        connection.end();
        res.writeHead(200, {'Content-Type':'application/JSON'});
        res.end(JSON.stringify(response));
        connection.end();
    });
}
