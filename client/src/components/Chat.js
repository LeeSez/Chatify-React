import React from "react";
import Message from "./Message";
import KeyboardLine from "./KeyboardLine";

export default class Chat extends React.Component {
    constructor(props){
        super(props);
    }

    state = {
        messageToSend:""
    }

    render(){
        return (
            <div className="chat">
                <button onClick={()=>this.props.setOpenChat("")}>Exit</button>
                <div className="messagesContainer">

                </div>
                <KeyboardLine />
            </div>
        )
    }
}