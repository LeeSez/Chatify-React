import React from "react";
import check from "../images/check-mark.png"

export default class Success extends React.Component{
    render(){
        return(
            <div className="success flexRow">
                <img className="check" src={check}/>
            </div>
        );
    }
}