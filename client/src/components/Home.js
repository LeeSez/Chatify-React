import React from "react";
import Contact from "./Contact";
import Chat from "./Chat";
import Logo from "./Logo";
import Footer from "./Footer";
import {sendHttpGetRequest, concatAnyArray} from "../clientTools";
import EditProfile from "./EditProfile";
import MainSetting from "./MainSetting";
import Search from "./Search";

export default class Home extends React.Component{
    constructor(props){
        super(props);
        this.refreshTime = "";
        this.stop = false;
        this.setting = [
            {name:"Notifications", action:""},
            {name:"Log out", action:this.logout}
        ];
    }

    state={
        contactsElements:[],
        openChat: "",
        openPage: "",
        openSetting: false,
        clear:false
    }

    setOpenPage = (val)=>{ 
        this.setState({openPage:val});
    }

    setOpenChat = (val)=>{ 
        this.setState({openChat:val});
    }

    setOpenSetting = ()=>{
        let currentVal = this.state.openSetting;
        this.setState({openSetting:!currentVal});
    }

    componentDidMount(){
        this.refresh();
    }

    componentWillUnmount(){
        clearTimeout(this.refreshTime);
    }

    refresh = ()=>{
        let lastId = this.props.messages.length > 0 ? this.props.messages[this.props.messages.length-1].id : 0;
        sendHttpGetRequest(this.props.baseUrl+"api/pull?email="+this.props.email+"&password="+this.props.password+"&lastId="+lastId, (resopnse)=>{
            if(resopnse=== "wrong detailes"){
                console.log(resopnse);
            }
            else{
                resopnse = JSON.parse(resopnse);
                let newMessages = concatAnyArray(this.props.messages, resopnse.messages, true);
                this.props.setContacts(resopnse.contacts);
                this.props.setMessages(newMessages);
                this.props.setPersonalInfo(resopnse.presonalInfo);
                this.setState({contactsElements:this.props.contacts.map((val)=> <Contact key={val.email} contact={val} email={this.props.email} setOpenChat={()=>this.setOpenChat(val)}/>)});
            }
            if(!this.stop) this.refreshTime = setTimeout(this.refresh, 500);
            else clearTimeout(this.refreshTime);
        });
    }

    logout = ()=>{
        this.stop = true;
        this.setState({
            contactsElements:[],
            openChat: "",
            openPage: "",
            openSetting: false,
        });       
        this.props.resetState();
    };

    render(){

        return(
            <div id="home" className="flexCol">

                {this.state.openChat === "" ?
                    this.state.openPage === "" ?
                    <div className="flexCol">

                        {this.state.openSetting && <MainSetting options={this.setting}/>}

                        <div className="flexRow titleWrapper">
                            <Logo size="small"/>
                            <p className="title flexRow homeTitle">CHATS</p>
                        </div>
                        <div className="flexCol contactList">
                            {this.state.contactsElements.length > 0 ? this.state.contactsElements : "There are no chats yet"}
                        </div>
                        <Footer setOpenPage={this.setOpenPage} openSetting={this.setOpenSetting}/>
                    </div>

                    :this.state.openPage === "editPage" ?
                        <EditProfile 
                        personalInfo={this.props.personalInfo}
                        setOpenPage={this.setOpenPage}
                        email={this.props.email}
                        password={this.props.password}
                        baseUrl={this.props.baseUrl}
                        setNotification={this.props.setNotification}
                        notificationState={this.props.notification}
                        />
                        :
                        <Search 
                        email={this.props.email}
                        password={this.props.password}
                        baseUrl={this.props.baseUrl}
                        setOpenChat={this.setOpenChat}
                        setOpenPage={this.setOpenPage}
                        />

                : <Chat 
                recipient={this.state.openChat.email}
                recipientName={this.state.openChat.name} 
                profile_picture={this.state.openChat.profile_picture}
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