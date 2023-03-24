import React from "react";
import {sendHttpGetRequest} from "../clientTools";

export default class Login extends React.Component{
    constructor(props){
        super(props);
    }

    verifyLoginInserver = ()=>{
        sendHttpGetRequest(this.props.baseUrl+"api/login?email="+this.props.email+"&password="+this.props.password, (resopnse)=>{
            if(resopnse=== "wrong detailes"){
                console.log(resopnse);
            }
            else{
                resopnse = JSON.parse(resopnse);
                this.props.setContacts(resopnse.contacts);
                this.props.setMessages(resopnse.messages);
                this.props.setIsLogged();
            }
        });
    }

    render(){
        return(
            <div id="login">
                <input name="email" type="text" placeholder="Email" onChange={this.props.setEmail} ></input>
                <input name="password" type="password" placeholder="password" onChange={this.props.setPassword}></input>
                <button onClick={this.verifyLoginInserver}>Login</button>
                <button onClick={this.props.setPage}>register now</button>
            </div>
        );
    }
}