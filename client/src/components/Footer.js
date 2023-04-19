import React from "react";
import sp from "../images/settings.png";
import user from "../images/user.png";
import search from "../images/search.png";

export default class Footer extends React.Component{
    render(){
        return (
            <footer>
                <div className="footerButtons flexRow">
                    <div className="flexCol" onClick={()=>this.props.openSetting()}><img alt="settings gear" src={sp}/></div>
                    <div className="flexCol" onClick={()=>this.props.setOpenPage("editPage")}><img alt="userEdit" src={user}/></div>
                    <div className="flexCol" onClick={()=>this.props.setOpenPage("searchPage")}><img alt="search" src={search}/></div>
                </div>
                <div id="lightLine"></div>
                <div id="darkLine"></div>
            </footer>
        );
    }
}