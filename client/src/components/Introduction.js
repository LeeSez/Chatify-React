import React from "react";
import Login from "./Login";
import Register from "./Register";
import Logo from "./Logo";

export default class Introduction extends React.Component {
    constructor(props){
        super((props));
    }

    state = {
        page:"empty"
    };

    setPage = (page) =>{
        this.setState({page:page});
    }
    render(){
        return(
            <div id="intro" className="flexCol">
                
                {this.state.page== "empty" ?
                <div id="introLogo">
                    <Logo size="big"/>
                </div> :
                <Logo size="small"/>
                }

                {this.state.page === "empty" && 
                <div className="flexCol" id="btnsWrapper">
                    <button onClick={()=>this.setPage("login")} id="btnLogin"> <p>Login</p> </button>
                    <button onClick={()=>this.setPage("register")} id="btnRegister">Register</button>
                </div>}
                
                {this.state.page === "login" && 
                <Login 
                email={this.props.email}
                setEmail={this.props.setEmail}
                password={this.props.password}
                setPassword={this.props.setPassword}
                baseUrl={this.props.baseUrl}
                setIsLogged={this.props.setIsLogged}
                setContacts={this.props.setContacts}
                setMessages={this.props.setMessages}
                setPage={()=>this.setPage("register")}/>}

                {this.state.page === "register" && 
                <Register 
                email={this.props.email}
                setEmail={this.props.setEmail}
                password={this.props.password}
                setPassword={this.props.setPassword}
                baseUrl={this.props.baseUrl}
                setPage={()=>this.setPage("login")}/>}
            </div>
        );
    }
}