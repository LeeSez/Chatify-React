import './App.css';
import React from "react"
import Introduction from "./components/Introduction";
import Home from "./components/Home";

export default class App extends React.Component {
  constructor(props){
    super(props);
  }

  baseUrl = "http://localhost:8080/";

  state = {
    isLoggedin:false,
    email:"",
    password:"",
    contacts:[],
    messages:[],
    personalInfo:{}
  };

  setEmail = (event)=>{
    this.setState({email:event.target.value});
  }

  setPassword = (event)=>{
    this.setState({password:event.target.value});
  }

  setIsLogged = ()=>{
    this.setState((prevVal)=>({
      ...prevVal,
      isLoggedin:!prevVal.isLoggedin
  }))};

  setContacts = (contactArray)=>{
    this.setState({contacts:contactArray});
  }

  setMessages = (messArray)=>{
    this.setState({messages:messArray});
  }

  setPersonalInfo = (personal)=>{
    this.setState({personalInfo:personal});
  }

  render(){
    return (
      <div className="App">
        {this.state.isLoggedin ? 
        
        <Home 
        email={this.state.email} 
        password={this.state.password} 
        baseUrl={this.baseUrl}
        setContacts={this.setContacts}
        setMessages={this.setMessages}
        setPersonalInfo={this.setPersonalInfo}
        messages={this.state.messages}
        contacts={this.state.contacts}
        personalInfo={this.state.personalInfo}
        isLogged={this.state.isLoggedin}
        /> : 
        
        <Introduction 
        email={this.state.email} 
        password={this.state.password} 
        setEmail={this.setEmail} 
        setPassword={this.setPassword} 
        baseUrl={this.baseUrl}
        setContacts={this.setContacts}
        setMessages={this.setMessages}
        setIsLogged={this.setIsLogged}
        setPersonalInfo={this.setPersonalInfo}
        />}
      </div>
    );
  }
}


