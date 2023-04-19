import React from "react";
import check from "../images/check-mark.png";
import loadImg from "../images/refresh.png";

export default class Load extends React.Component{
    render(){
        console.log(this.props.loading );
        return(
            <div className="load flexRow">
                {this.props.success && <img alt="check mark" className="check" src={check}/>}
                {this.props.loading && <img alt="loading circle" className="loading" src={loadImg}/>}
            </div>
        );
    }
}