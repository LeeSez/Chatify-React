import React from "react";
import Message from "./Message";
import {sendHttpPostRequest, formatDate} from "../clientTools"
import KeyboardLine from "./KeyboardLine";

export default class Chat extends React.Component {
    constructor(props){
        super(props);
    }

    state = {
        messageToSend:""
    }

    setMessageToSend = (event)=>{
        this.setState({messageToSend:event.target.value});
    }

    sendMessage = ()=>{
        if(this.state.messageToSend != "" || this.state.messageToSend != " "){
            let time = formatDate();
            let body = {
                "email":this.props.email,
                "password":this.props.password,
                "recipient":this.props.recipient,
                "content":this.state.messageToSend,
                "time":time
            };
            sendHttpPostRequest(this.props.baseUrl+"api/send",JSON.stringify(body), (response)=>{
                console.log(response);
                this.setState({messageToSend:""});
            });
        }
    }
    
    messageElements = [];
    openVisualChat = ()=>{
        this.messagesArray = this.props.messages.filter(message => message.sender==this.props.recipient || message.recipient==this.props.recipient);
        this.messageElements = this.messagesArray.map(message => <Message key={message.id} messageItSelf={message} email={this.props.email}/>);
    }

    componentDidMount(){
        this.openVisualChat();
    }
    componentDidUpdate(){
        this.openVisualChat();
    }

    style={
        backgroundImage:this.props.profile_picture == "" ? "" :`url(${this.props.profile_picture})`
    }

    render(){
        return (
            <div className="chat flexCol">
                <div className="top flexRow">
                    <div className="recipientImage" style={this.style}></div>
                    <p>{this.props.recipientName}</p>
                    <div id="back" onClick={()=>this.props.setOpenChat("")}></div>
                </div>
                <div className="messagesContainer">
                    {this.messageElements}
                </div>
                <KeyboardLine 
                messageToSend={this.state.messageToSend} 
                setMessageToSend={this.setMessageToSend} 
                sendFunction={this.sendMessage}
                />
            </div>
        )
    }
}

// <button onClick={()=>this.props.setOpenChat("")}>Exit</button>