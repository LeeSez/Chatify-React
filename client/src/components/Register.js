import React from "react";
import {sendHttpPostRequest, sendHttpGetRequest} from "../clientTools";
import Load from "./Load";
import Notification from "./Notification"

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
        profileImage:"",
        success:false,
        loading:false
    }

    style = {
        email:this.state.valid.email === false ? {borderBottom:"2px solid var(--red)"} : {},
        name:this.state.valid.name === false ? {borderBottom:"2px solid var(--red)"} : {},
        password:this.state.valid.password === false ? {borderBottom:"2px solid var(--red)"} : {}
    }

    renderImage = (event)=>{
        const reader = new FileReader();
        reader.addEventListener("load", ()=>{
            let uploadedImage = reader.result;
            this.imageDisplay.current.style.backgroundImage = `url(${uploadedImage})`;
            this.setState({profileImage:uploadedImage})
        });

        let fileSize = event.target.files[0].size;
        let fileMb = fileSize / 1024 ** 2;
        
        if(fileMb < 1){
            reader.readAsDataURL(event.target.files[0]);
        }
        else{
            this.props.setNotification(true,"Image sixe can't go over 1MB");
        }
    };

    componentDidMount(){
        if(this.state.refresh === 0){
            sendHttpGetRequest(this.props.baseUrl+"api/registerParameters", (response)=>{
                let parameters = JSON.parse(response);
                this.setState({parameters:parameters, refresh:1});
            });
        }
    }
    componentDidUpdate(){
        this.style = {
            email:this.state.valid.email === false ? {borderBottom:"2px solid var(--red)"} : {},
            name:this.state.valid.name === false ? {borderBottom:"2px solid var(--red)"} : {},
            password:this.state.valid.password === false ? {borderBottom:"2px solid var(--red)"} : {}
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

                    this.setState({loading:true});
                    sendHttpPostRequest(this.props.baseUrl+"api/register", JSON.stringify(body), 
                    (response)=>{
                        this.setState({loading:false});
                        this.buttonRef.current.disabled = false;
                        if(response === "successful"){
                            this.setState({success:true});
                            setTimeout(()=>{
                                this.setState({success:false});
                                this.props.setPage(); 
                                return;
                            },900); 
                        }
                    },
                    (status,response)=>{
                        //error callback
                        this.setState({loading:false});
                        this.buttonRef.current.disabled = false;
                        this.props.setNotification(true,"User already exists");
                        if(status === 500){
                            //duplicated information
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

    checkEnter =(event)=>{
        if(event.key === "Enter"){
            this.verifyRegiseterInserver();
        }
    }

    render(){
        return(
            <div id="register" className="flexCol">
                {this.state.success ? <Load success={true} loading={false} /> : ""}
                {this.state.loading ? <Load success={false} loading={true} /> : ""}

                <div className="flexCol">
                    <div id="displayImage" ref={this.imageDisplay}></div>
                    <input className="imageUpload" type="file" accept="image/png, image/jpeg" onChange={this.renderImage} onKeyDown={this.checkEnter}/>

                    <input name="name" type="text" placeholder="Name" onChange={this.setName} style={this.style.name} onKeyDown={this.checkEnter}/>
                    <small>{this.state.parameters.name}</small>
                    
                    <input name="email" type="text" placeholder="Email" onChange={this.props.setEmail} style={this.style.email} onKeyDown={this.checkEnter}/>
                    <small>{this.state.parameters.email}</small>

                    <input name="password" type="password" placeholder="Password" onChange={this.props.setPassword} style={this.style.password} onKeyDown={this.checkEnter}/>
                    <small>{this.state.parameters.password}</small>
                    
                    <input name="passwordRepeat" type="password" placeholder="Password Repeat" onChange={this.setPasswordRepeat} style={this.style.password} onKeyDown={this.checkEnter}/>
                    
                    <button onClick={this.verifyRegiseterInserver} className="continue" ref={this.buttonRef}>CONTINUE</button>
                </div>
                <p className="info flexCol">Already connected before? Go back to<strong onClick={this.props.setPage}> Login!</strong></p>
            </div>
        );
    }
}