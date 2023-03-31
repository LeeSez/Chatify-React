import React from "react";

export default class Logo extends React.Component {
    constructor(props){
        super(props);
    }
    
    render() {
        
        return (
            <div className="logo">
                {this.props.size=="big" ? 
                <div className="bigLogo flexRow">Chatify</div> : 
                <div className="smallBack flexRow">
                    <div className="SmallLogo flexRow">c</div>
                </div>
                }
            </div>
        );
    }
}