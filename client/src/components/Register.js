import React from "react";
import {sendHttpGetRequest} from "../clientTools";

export default class Register extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div id="register">
                register
                <button onClick={this.props.setPage}>login now</button>
            </div>
        );
    }
}