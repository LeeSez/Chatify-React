import React from "react";
import { formateTime } from "../clientTools"; 

export default class Message extends React.Component {

    render(){
        let classy = "message";
        if(this.props.messageItSelf.sender === this.props.email){
            classy = "message myMessage";
        }

        let time = new Date(this.props.messageItSelf.time);
        time = formateTime(time.getHours()) + ":" + formateTime(time.getMinutes());
        return(
            <div className={classy}>
                <p className="messageContent">{this.props.messageItSelf.content}</p>
                <p className=" flexRow time">{time}</p>
            </div>
        )
    }
}