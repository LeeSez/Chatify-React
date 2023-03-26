import React from "react";

export default class KeyboardLine extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="keyboardLine">
                <input value={this.props.messageToSend} onChange={this.props.setMessageToSend}/>
                <button onClick={this.props.sendFunction}>send</button>
            </div>
       )
    }
}