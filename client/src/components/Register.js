import React from "react";
import {sendHttpGetRequest} from "../clientTools";

export default class Register extends React.Component{
    constructor(props){
        super(props);
        this.buttonRef = React.createRef(null);
    }



    state={
        passwordRepeat:"",
        name:"",
        parameters:{},
        refresh:0,
        valid:{
            password:true,
            email:true,
            name:true
        },
        serverMessage:""
    }

    style = {
        email:this.state.valid.email == false ? {borderBottom:"2px solid var(--red)"} : {},
        name:this.state.valid.name == false ? {borderBottom:"2px solid var(--red)"} : {},
        password:this.state.valid.password == false ? {borderBottom:"2px solid var(--red)"} : {}
    }

    componentDidMount(){
        if(this.state.refresh == 0){
            sendHttpGetRequest(this.props.baseUrl+"api/registerParameters", (response)=>{
                let parameters = JSON.parse(response);
                this.setState({parameters:parameters, refresh:1});
            });
        }
    }
    componentDidUpdate(){
        this.style = {
            email:this.state.valid.email == false ? {borderBottom:"2px solid var(--red)"} : {},
            name:this.state.valid.name == false ? {borderBottom:"2px solid var(--red)"} : {},
            password:this.state.valid.password == false ? {borderBottom:"2px solid var(--red)"} : {}
        }
    }

    setPasswordRepeat =(event)=>{
        this.setState({passwordRepeat:event.target.value})
    };

    setName =(event)=>{
        this.setState({name:event.target.value})
    };

    verifyRegiseterInserver = ()=>{
        this.buttonRef.current.disabled = true;
        if(this.props.email.includes("@") && this.props.email.length > 7 && this.props.email.length < 40){
            if(this.state.name.length > 2 && this.state.name.length < 20){
                if(this.props.password === this.state.passwordRepeat && this.props.password.length > 7 && this.props.password.length < 45 && /[A-Z]/.test(this.props.password)){
                    sendHttpGetRequest(this.props.baseUrl+"api/register?email="+this.props.email+"&password="+this.props.password+"&name="+this.state.name,
                    (response)=>{
                        this.buttonRef.current.disabled = false;
                        this.setState({serverMessage:""});
                        if(response == "successful"){
                            this.props.setPage();
                            return;
                        }
                    },
                    (status,response)=>{
                        //error callback
                        this.buttonRef.current.disabled = false;
                        if(status == 500){
                            //duplicated information
                            this.setState({serverMessage:response});
                            return;
                        }
                    }
                    );
                    this.setState((prevVal)=>{
                        return ({
                            ...prevVal,
                            valid:{
                                password:true,
                                email:true,
                                name:true
                            }
                        });
                    });
                }
                else{
                    //passwords dont match
                    this.buttonRef.current.disabled = false;
                    this.setState((prevVal)=>{
                        return ({
                            ...prevVal,
                            valid:{
                                password:false,
                                email:true,
                                name:true
                            }
                        });
                    });
                }
            }
            else{
                // no name
                this.buttonRef.current.disabled = false;
                this.setState((prevVal)=>{
                    return ({
                        ...prevVal,
                        valid:{
                            password:true,
                            email:true,
                            name:false
                        }
                    });
                });
            }
        }
        else{
            //no email
            this.buttonRef.current.disabled = false;
            this.setState((prevVal)=>{
                return ({
                    ...prevVal,
                    valid:{
                        password:true,
                        email:false,
                        name:true
                    }
                });
            });
        }
    };

    render(){
        return(
            <div id="register" className="flexCol">
                <div className="flexCol">
                    <input name="email" type="text" placeholder="Email" onChange={this.props.setEmail} style={this.style.email}></input>
                    <small>{this.state.parameters.email}</small>
                    
                    <input name="name" type="text" placeholder="Name" onChange={this.setName} style={this.style.name}></input>
                    <small>{this.state.parameters.name}</small>
                    
                    <input name="password" type="password" placeholder="Password" onChange={this.props.setPassword} style={this.style.password}></input>
                    <small>{this.state.parameters.password}</small>
                    
                    <input name="passwordRepeat" type="password" placeholder="Password Repeat" onChange={this.setPasswordRepeat} style={this.style.password}></input>
                    
                    <button onClick={this.verifyRegiseterInserver} className="continue" ref={this.buttonRef}>CONTINUE</button>
                    <p id="serverMessage">{this.state.serverMessage}</p>
                </div>
                <p className="info flexCol">Already connected before? Go back to<strong onClick={this.props.setPage}> Login!</strong></p>
            </div>
        );
    }
}