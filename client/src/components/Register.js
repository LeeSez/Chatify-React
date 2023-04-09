import React from "react";
import {sendHttpPostRequest, sendHttpGetRequest} from "../clientTools";

export default class Register extends React.Component{
    constructor(props){
        super(props);
        this.buttonRef = React.createRef(null);
        this.imageDisplay = React.createRef(null);
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
        serverMessage:"",
        profileImage:""
    }

    style = {
        email:this.state.valid.email == false ? {borderBottom:"2px solid var(--red)"} : {},
        name:this.state.valid.name == false ? {borderBottom:"2px solid var(--red)"} : {},
        password:this.state.valid.password == false ? {borderBottom:"2px solid var(--red)"} : {}
    }

    renderImage = (event)=>{
        const reader = new FileReader();
        reader.addEventListener("load", ()=>{
            let uploadedImage = reader.result;
            this.imageDisplay.current.style.backgroundImage = `url(${uploadedImage})`;
            this.setState({profileImage:uploadedImage})
        });
        reader.readAsDataURL(event.target.files[0]);
    };

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
                    
                    let body = {
                        email:this.props.email,
                        password:this.props.password,
                        name:this.state.name,
                        image:this.state.profileImage
                    }

                    sendHttpPostRequest(this.props.baseUrl+"api/register", JSON.stringify(body), 
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
                    });
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
                    <div id="displayImage" ref={this.imageDisplay}></div>
                    <input className="imageUpload" type="file" accept="image/png, image/jpeg" onChange={this.renderImage}/>

                    <input name="name" type="text" placeholder="Name" onChange={this.setName} style={this.style.name}></input>
                    <small>{this.state.parameters.name}</small>
                    
                    <input name="email" type="text" placeholder="Email" onChange={this.props.setEmail} style={this.style.email}></input>
                    <small>{this.state.parameters.email}</small>

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