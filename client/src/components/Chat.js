import React from "react";
import Message from "./Message";
import {sendHttpPostRequest, formatDate, convertMonth} from "../clientTools"
import KeyboardLine from "./KeyboardLine";

export default class Chat extends React.Component {
    constructor(props){
        super(props);
        this.messageScroll = React.createRef(null);
        this.messagesArray = this.props.messages.filter(message => message.sender==this.props.recipient || message.recipient==this.props.recipient);
        this.messageComaprison = (message,index)=>{
            if(index != 0){
                let lastTime = new Date(this.messagesArray[index-1].time);
                let today = new Date(this.messagesArray[index].time);

                lastTime = lastTime.getDate() + " " +convertMonth(lastTime.getMonth());
                today = today.getDate() + " " + convertMonth(today.getMonth());

                if(lastTime != today){
                    //differnt day
                    return [<div className="timeMark" key={index+0.5}>{today}</div>, <Message key={index} messageItSelf={message} email={this.props.email}/>]
                }
                else{
                    return <Message key={message.id} messageItSelf={message} email={this.props.email}/>;
                }
            }
            else{
                // first message
                let today = new Date(this.messagesArray[index].time);
                today = today.getDate() + " " + convertMonth(today.getMonth());

                return [<div className="timeMark" key={index+0.5}>{today}</div>, <Message key={index} messageItSelf={message} email={this.props.email}/> ];
            }
        }
        this.messageElements = this.messagesArray.map((message, index) =>{
            return this.messageComaprison(message, index);
        });
        this.messageElements = this.messageElements.flat(Infinity);
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
    
    openVisualChat = ()=>{
        this.messageScroll.current.scrollTop = this.messageScroll.current.scrollHeight;
        this.messageScroll.current.style.scrollBehavior = "smooth";
    }

    componentDidMount(){
        this.openVisualChat();
    }
    componentDidUpdate(){
        this.messagesArray = this.props.messages.filter(message => message.sender==this.props.recipient || message.recipient==this.props.recipient);
        this.messageElements = this.messagesArray.map(message => <Message key={message.id} messageItSelf={message} email={this.props.email}/>);
        this.messageElements = this.messagesArray.map((message, index) =>{
            return this.messageComaprison(message, index);
        });
        this.messageElements = this.messageElements.flat(Infinity);
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
                <div className="messagesContainer" ref={this.messageScroll}>
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
