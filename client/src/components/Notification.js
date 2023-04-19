import React from "react";

export default class Notification extends React.Component{
    constructor(props){
        super(props);
        this.timeout="";
    }

    componentDidMount(){
        this.timeout = setTimeout(() => {
            this.props.setNotification(false);
        }, 4000);
    }

    componentWillUnmount(){
        clearTimeout(this.timeout);
    }

    render(){
        return(
            <div className="notification">
                <p><strong>Error</strong></p>
                <p>{this.props.message}</p>
            </div>
        );
    }
}
