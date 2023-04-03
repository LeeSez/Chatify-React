import React from "react";
import Contact from "./Contact";
import Chat from "./Chat";
import Logo from "./Logo";
import Footer from "./Footer";
import {sendHttpGetRequest, concatAnyArray} from "../clientTools";

export default class Home extends React.Component{
    constructor(props){
        super(props);
    }

    state={
        contactsElements:[],
        openChat: ""
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
                this.setState({contactsElements:this.props.contacts.map((val)=> <Contact key={val.email} contact={val} email={this.props.email} setOpenChat={()=>this.setOpenChat(val.email)}/>)});
            }
            if(this.props.isLogged) setTimeout(this.refresh, 500);
        });
    }

    render(){
        let contactName;
        if(this.state.openChat != "" && this.props.contacts){
            contactName = this.props.contacts.find((element) => element.email==this.state.openChat);
            contactName = contactName.name;
            //contactName = this.props.contacts[contactName].name;
        }
        return(
            <div id="home" className="flexCol">
                {this.state.openChat == "" ?
                <div className="flexCol">
                    <div className="flexRow titleWrapper">
                        <Logo size="small"/>
                        <p className="title flexRow homeTitle">CHATS</p>
                    </div>
                    <div className="flexCol contactList">
                        {this.state.contactsElements}
                    </div>
                    <Footer />
                </div>
                : <Chat 
                recipient={this.state.openChat}
                recipientName={contactName} 
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