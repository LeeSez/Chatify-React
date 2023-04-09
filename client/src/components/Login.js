import React from "react";
import {sendHttpGetRequest} from "../clientTools";

export default class Login extends React.Component{
    constructor(props){
        super(props);
    }

    state = {
        incorrect: false
    };

    setIncoreect = (val)=>{
        this.setState({incorrect:val});
    }

    verifyLoginInserver = ()=>{
        sendHttpGetRequest(this.props.baseUrl+"api/login?email="+this.props.email+"&password="+this.props.password, (resopnse)=>{
            if(resopnse=== "wrong detailes"){
                console.log(resopnse);
                this.setIncoreect(true);
            }
            else{
                this.setIncoreect(false);
                resopnse = JSON.parse(resopnse);
                this.props.setContacts(resopnse.contacts);
                this.props.setMessages(resopnse.messages);
                this.props.setPersonalInfo(resopnse.presonalInfo);
                this.props.setIsLogged();
            }
        });
    }

    render(){
        return(
            <div id="login" className="flexCol">
                <div className="flexCol">
                    <input name="email" type="text" placeholder="Email" onChange={this.props.setEmail} ></input>
                    <input name="password" type="password" placeholder="Password" onChange={this.props.setPassword}></input>
                    <p onClick={this.verifyLoginInserver} className="continue">CONTINUE</p>
                </div>
                {this.state.incorrect && <p className="note">Email or/and Password don't match, Try again.</p>}
                <p className="info flexCol">Haven’t yet signed up? Go back to<strong onClick={this.props.setPage}> Register!</strong></p>
            </div>
        );
    }
}