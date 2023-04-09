import React from "react";

export default class Footer extends React.Component{
    render(){
        return (
            <footer>
                <div className="footerButtons flexRow">
                    <div className="flexCol"><img src="../images/settings.png"/></div>
                    <div className="flexCol" onClick={()=>this.props.setOpenPage("editPage")}><img src="../images/user.png"/></div>
                    <div className="flexCol"><img src="../images/search.png"/></div>
                </div>
                <div id="lightLine"></div>
                <div id="darkLine"></div>
            </footer>
        );
    }
}