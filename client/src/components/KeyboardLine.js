import React from "react";

export default class KeyboardLine extends React.Component {

    checkEnter = (event)=>{
        if(event.key === "Enter"){
            this.props.sendFunction();
        }
    }

    render(){
        return(
            <div className="keyboardLine">
                <div className="flexRow keyWraper">
                    <textarea value={this.props.messageToSend} onKeyDown={this.checkEnter} onChange={this.props.setMessageToSend} placeholder="Message.."/>
                    <button onClick={this.props.sendFunction}></button>
                </div>
                <div id="lightLine"></div>
                <div id="darkLine"></div>
            </div>
       )
    }
}
