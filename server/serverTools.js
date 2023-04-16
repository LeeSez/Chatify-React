let fs = require("fs");

exports.fileServer = (folder ,path, defultPage, res)=>{
    //File request  
    let extention = {
        ".html": "text/html",
        ".css": "text/css",

        ".JSON":"application/json",
        ".js": "application/javascript",

        ".png": "image/png",
        ".jpeg":"image/jpeg",
        ".gif":"image/gif",
        ".ico":"image/x-icon",

        ".mp4":"video/mp4"
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
    if(email && (email.length>40 && email.length<7)) return false; 
    if(password && (password.length<6 && password.length>45)) return false; 
    if(name && (name>20 && name.length>2)) return false;
    if(email && email.includes(" ")) return false;
    if(email && !email.includes("@")) return false;
    if(password && !(/[A-Z]/.test(password))) return false;
    if(password && !(/[1-9]/.test(password))) return false;
    return true;
}

exports.getParametersOfRegister = ()=> {
    let obj = {
        email:" Must contain '@',  7 < length < 40",
        password: "1 uppercase letter, 7 < legth < 45",
        name: "2 < length < 20"
    }
    
    return  JSON.stringify(obj);
}


exports.findLast = (array, callback)=>{
    for(let i = array.length-1; i>-1; i--){
        let answer = callback(array[i]);
        if(answer == true){
            return array[i];
        }
    }
    return -1;
}

exports.findIndexByfield = (fieldName, val, array)=> { //only meant to find object's position according to a spesified field and val
    for (let i = 0; i < array.length; i++) {
      if (array[i][fieldName] === val) {
        return i;
      }
    }
    return -1; 
}