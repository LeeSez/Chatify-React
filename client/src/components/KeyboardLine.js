import React from "react";

export default class KeyboardLine extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="keyboardLine">
                <div className="flexRow keyWraper">
                    <textarea value={this.props.messageToSend} onChange={this.props.setMessageToSend} placeholder="Message.."/>
                    <button onClick={this.props.sendFunction}></button>
                </div>
                <div id="lightLine"></div>
                <div id="darkLine"></div>
            </div>
       )
    }
}
