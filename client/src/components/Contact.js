import React from "react";
import {relativeDate} from "../clientTools";

export default class Contact extends React.Component{
    style={
        backgroundImage:this.props.contact.profile_picture === "" ? "" :`url(${this.props.contact.profile_picture})`
    }

    render(){
        let time = new Date(this.props.contact.lastmessage.time);
        let now = new Date(Date.now());
        let relativeDay = relativeDate(now,time,true);
        
        return(
            <div className="contact flexRow" id={this.props.contact.email} onClick={this.props.setOpenChat}>
                <div className="recipientImage" style={this.style}></div>
                <div className="recipientWrap">
                    <div className="flexRow nameRow">
                        <p className="contactName">{this.props.contact.name}</p>
                        <p>{relativeDay}</p>
                    </div>
                    <p className="lastMessage">{this.props.contact.lastmessage.content}</p>
                </div>
            </div>
        );
    }
}
