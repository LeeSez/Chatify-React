import React from "react";
import Contact from "./Contact";
import Chat from "./Chat";
import {sendHttpGetRequest, concatAnyArray} from "../clientTools";

export default class Home extends React.Component{
    constructor(props){
        super(props);
    }

    state={
        contactsElements:[],
        openChat: ""
    }

    setEmailOpenChat = (event)=>{ //only for openning the chat 
        this.setState({openChat:event.target.id});
    }

    setOpenChat = (val)=>{ 
        this.setState({openChat:val});
    }

    componentDidMount(){
        this.refresh();
    }

    refresh = ()=>{
        sendHttpGetRequest(this.props.baseUrl+"api/pull?email="+this.props.email+"&password="+this.props.password+"&lastId="+this.props.messages[this.props.messages.length-1].id, (resopnse)=>{
            if(resopnse=== "wrong detailes"){
                console.log(resopnse);
            }
            else{
                resopnse = JSON.parse(resopnse);
                let newMessages = concatAnyArray(this.props.messages, resopnse.messages, true);
                this.props.setContacts(resopnse.contacts);
                this.props.setMessages(newMessages);
                this.setState({contactsElements:this.props.contacts.map((val)=> <Contact key={val.email} contact={val} email={this.props.email} setEmailOpenChat={this.setEmailOpenChat}/>)});
            }
            if(this.props.isLogged) setTimeout(this.refresh, 500);
        });
    }

    render(){
        return(
            <div id="home">
                home
                {this.state.openChat == "" ?
                this.state.contactsElements
                : <Chat 
                recipient={this.state.openChat} 
                messages={this.props.messages} 
                setOpenChat={this.setOpenChat}
                email={this.props.email}
                password={this.props.password}
                baseUrl={this.props.baseUrl}
                />
                }
            </div>
        );
    }
}