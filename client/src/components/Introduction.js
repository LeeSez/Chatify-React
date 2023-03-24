import React from "react";
import Login from "./Login";
import Register from "./Register";

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
            <div id="intro">
                <h1>Chatify</h1>
                {this.state.page === "empty" && <div className="flexRow">
                    <button onClick={()=>this.setPage("login")}>Login</button>
                    <button onClick={()=>this.setPage("register")}>Register</button>
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