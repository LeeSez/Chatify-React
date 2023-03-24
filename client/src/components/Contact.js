import React from "react";

export default class Contact extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        let time = new Date(this.props.contact.lastmessage.time);
        let now = new Date(Date.now());
        let relativeDay;
        if((time.getDate() == now.getDate())&& (time.getMonth() == now.getMonth()) && (time.getFullYear() == now.getFullYear())) relativeDay = time.getHours()+":"+time.getMinutes();
        else if((time.getMonth() == now.getMonth()) && (time.getDate() + 1 == now.getDate())) relativeDay = "Yesterday";

        return(
            <div className="contact" id={this.props.contact.email} onClick={this.props.setEmailOpenChat}>
                <h5>{this.props.contact.name}</h5>
                <p>{relativeDay ? relativeDay : time.getDate()+ " "+ convertToStrMonth(time.getMonth())}</p>
                <p>{this.props.email == this.props.contact.lastmessage.sender? "You" : this.props.contact.name}: {this.props.contact.lastmessage.content}</p>
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