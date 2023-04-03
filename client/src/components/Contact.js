import React from "react";
import { formateTime } from "../clientTools";

export default class Contact extends React.Component{
    constructor(props){
        super(props);
    }

    style={
        backgroundImage:this.props.contact.profile_picture == "" ? "" :`url(${this.props.contact.profile_picture})`
    }

    render(){
        let time = new Date(this.props.contact.lastmessage.time);
        let now = new Date(Date.now());
        let relativeDay;
        if((time.getDate() == now.getDate())&& (time.getMonth() == now.getMonth()) && (time.getFullYear() == now.getFullYear())){
            relativeDay =formateTime(time.getHours())+":"+formateTime(time.getMinutes());
        } 
        else if((time.getMonth() == now.getMonth()) && (time.getDate() + 1 == now.getDate())) relativeDay = "Yesterday";

        return(
            <div className="contact flexRow" id={this.props.contact.email} onClick={this.props.setOpenChat}>
                <div className="recipientImage" style={this.style}></div>
                <div className="recipientWrap">
                    <div className="flexRow nameRow">
                        <p className="contactName">{this.props.contact.name}</p>
                        <p>{relativeDay ? relativeDay : time.getDate()+ " "+ convertToStrMonth(time.getMonth())}</p>
                    </div>
                    <p className="lastMessage">{this.props.contact.lastmessage.content}</p>
                </div>
            </div>
        );
    }
}

function convertToStrMonth(number){
    if(number== 0) return "Jan";
    if(number== 1) return "Feb";
    if(number== 2) return "Mar";
    if(number== 3) return "Apr";
    if(number== 4) return "May";
    if(number== 5) return "Jun";
    if(number== 6) return "Jul";
    if(number== 7) return "Aug";
    if(number== 8) return "Sept";
    if(number== 9) return "Oct";
    if(number== 10) return "Nov";
    if(number== 11) return "Dec";  
}