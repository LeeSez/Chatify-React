export function sendHttpGetRequest(url,callback){
    let httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = ()=>{
        if(httpRequest.readyState == 4){
            if(httpRequest.status == 200){
                callback(httpRequest.response);
            }
            else{
                console.log("exited on:"+httpRequest.status+", and the server said:"+httpRequest.response);
            }
        }
    };
    
    httpRequest.open('GET',url,true);
    httpRequest.send();
} 

export function sendHttpPostRequest(url,body,callback){
    let httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = ()=>{
        if(httpRequest.readyState == 4){
            if(httpRequest.status == 200){
                callback(httpRequest.response);
            }
            else{
                console.log("exited on:"+httpRequest.status+", and the server said:"+httpRequest.response);
            }
        }
    };
    
    httpRequest.open('POST',url,true);
    httpRequest.send(body);
} 

export function deleteChildNodes(keepNumber, element){
    while(element.children.length > keepNumber){
        element.removeChild(element.lastChild);
    }
}

export function concatAnyArray(array1, array2){
    let newArray = [];
    for(let i = 0; i<array1.length; i++){
        newArray.push(array1[i]);
    }
    for(let i = 0; i<array2.length; i++){
        newArray.push(array2[i]);
    }
    return newArray;
}