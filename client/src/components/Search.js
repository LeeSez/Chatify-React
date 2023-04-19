import React from "react";
import {sendHttpGetRequest} from "../clientTools";

export default class Search extends React.Component{
    constructor(props){
        super(props);
        this.inputRef = React.createRef(null);
        this.timeCount ="";
    }

    state={
        searchChar:"",
        result:[],
        resultElements:[]
    };

    setSearchChar =(event)=>{
        this.setState({searchChar:event.target.value});
        clearTimeout(this.timeCount);
        if(event.target.value === "" || event.target.value ===" "){
            return;
        }
        this.timeCount = setTimeout(()=>{
            this.sendSearchRequest();
        },700);
    };

    sendSearchRequest = ()=>{
        sendHttpGetRequest(this.props.baseUrl+"api/search?email="+this.props.email+"&password="+this.props.password+"&searchChar="+this.state.searchChar, (resopnse)=>{
            resopnse = JSON.parse(resopnse);
            console.log(resopnse);
            let elements = resopnse.map((contact,index) => {
                let style = {
                    backgroundImage:contact.profile_picture === "" ? "" :`url(${contact.profile_picture})`
                }
                let openChat = (contact)=>{
                    this.props.setOpenChat(contact);
                    this.props.setOpenPage("");
                }
                return (
                    <div key={index} className=" contact flexRow" onClick={()=>openChat(contact)}>
                        <div className="recipientImage" style={style}></div>
                        {contact.name}
                    </div>
                );
            });
            this.setState({result:resopnse, resultElements:elements});
        });
        clearTimeout(this.timeCount);
    };

    render(){
        return(
            <div id="search" className="flexCol">
                <div className="inputWrap flexRow">
                    <input ref={this.inputRef} type="text" placeholder="User's Name" value={this.state.searchChar} onChange={this.setSearchChar}/>
                    <div id="back" onClick={()=>this.props.setOpenPage("")}></div>
                </div>
                <div id="searchList">{this.state.resultElements}</div>
            </div>
        );
    }
}