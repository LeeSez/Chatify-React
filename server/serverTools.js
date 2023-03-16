let fs = require("fs");

exports.fileServer = function(folder ,path, defultPage, res){
    //File request  
    let extention = {
        ".html": "text/html",
        ".css": "text/css",

        ".JSON":"application/json",
        ".js": "application/javascript",

        ".png": "image/png",
        ".jpeg":"image/jpeg"
    }

    let filename = folder + path;
    if(filename == folder+"/") filename = folder + defultPage;

    fs.readFile(filename, function(err, data){
        let ext = extention[getType(filename)];
        if(!ext) ext = "text/plain";

        if(err){
            res.writeHead(404, {"Content-type":ext});
            return res.end();
        }
        else{
            res.writeHead(200, {"Content-type":ext});
            res.write(data);
            return res.end();
        }
    });
}


function getType(str){ 
    //returns the extention of a file
    let newstr = str.slice(str.lastIndexOf("."),str.length);
    return newstr;
}

exports.readPostBody = (req, callback)=>{
    let body ='';
    req.on('data', (data)=>{
        body += data;
    });
    req.on('end', ()=>{
        callback(body);
    });
}

exports.serverValidateRegister =(email, password, name)=>{
    if(email.length>40 && email.length<7 && password.length<6 && password.length>45 && name>20 && name.length>2) return false;
    if(email.includes(" ")) return false;
    if(!email.includes("@")) return false;
    if(!(/[A-Z]/.test(password))) return false;
    if(!(/[1-9]/.test(password))) return false;
    return true;
}

exports.getParametersOfRegister = ()=> {
    let obj = {
        email:"Email has to contain '@' and and it's length wont be under 7 and over 40.",
        password: "Password has to contain at least 1 upper-case letter, and at least 6 more charaters, it's length wont be under 7 and over 45.",
        name: "Name's lenght wont be under 2 and over 20."
    }
    
    return  JSON.stringify(obj);
}
