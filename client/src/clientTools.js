export function sendHttpGetRequest(url,callback, errorCallback){
    let httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = ()=>{
        if(httpRequest.readyState == 4){
            if(httpRequest.status == 200){
                callback(httpRequest.response);
            }
            else{
                if(errorCallback){
                    errorCallback(httpRequest.status,httpRequest.response);
                }
                console.log("exited on:"+httpRequest.status+", and the server said:"+httpRequest.response);
            }
        }
    };
    
    httpRequest.open('GET',url,true);
    httpRequest.send();
} 

export function sendHttpPostRequest(url,body,callback, errorCallback){
    let httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = ()=>{
        if(httpRequest.readyState == 4){
            if(httpRequest.status == 200){
                callback(httpRequest.response);
            }
            else{
                console.log("exited on:"+httpRequest.status+", and the server said:"+httpRequest.response);
                errorCallback(httpRequest.response);
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

export function concatAnyArray(array1, array2, preventDuplicates){
    let newArray = [];
    for(let i = 0; i<array1.length; i++){
        newArray.push(array1[i]);
    }
    for(let i = 0; i<array2.length; i++){
        if(preventDuplicates && !newArray.some(message => message.id == array2[i].id)) newArray.push(array2[i]);
        else if(!preventDuplicates) newArray.push(array2[i]);
    }
    return newArray;
}

export function formatDate(){
    let date = new Date();
    let month = (date.getMonth()+1) < 10 ? "0"+(date.getMonth()+1) : (date.getMonth()+1);
    let day = date.getDate() < 10 ? "0"+date.getDate() : date.getDate();
    let hour = date.getHours() < 10 ? "0"+date.getHours() : date.getHours();
    let min = date.getMinutes() < 10 ? "0"+date.getMinutes() : date.getMinutes();
    let sec = date.getSeconds() < 10 ? "0"+date.getSeconds() : date.getSeconds();
    let strDate = date.getFullYear()+"-"+month+"-"+day+" "+hour+":"+min+":"+sec;
    return strDate;
}

export function formateTime(number){
    //this is only in favor of displaying the time correctly 9:2 => 09:02
    if(number<10) return "0"+number;
    return number;
}

