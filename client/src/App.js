import './App.css';
import React from "react"
import Introduction from "./components/Introduction";
import Home from "./components/Home";
import Notification from './components/Notification';

export default class App extends React.Component {
  constructor(props){
    super(props);
  }

  /*baseUrl = "http://localhost:8080/";*/
  baseUrl = "/";

  state = {
    isLoggedin:false,
    email:"",
    password:"",
    contacts:[],
    messages:[],
    personalInfo:{},
    notification:false,
    errorMessage:""
  };

  setNotification = (val, message)=>{
    this.setState({notification:val, errorMessage:message});
  }

  setEmail = (event)=>{
    let lower = event.target.value;
    lower =lower.toLowerCase();
    this.setState({email:lower});
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

  resetState = ()=>{
    this.setState({
      isLoggedin:false,
      email:"",
      password:"",
      contacts:[],
      messages:[],
      personalInfo:{}
    });
  }

  render(){
    return (
      <div className="App">
        {this.state.notification === true && <Notification 
        message={this.state.errorMessage}
        setNotification={this.setNotification}
        />}
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
        resetState={this.resetState}
        setNotification={this.setNotification}
        notificationState={this.state.notification}
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
        setNotification={this.setNotification}
        notificationState={this.state.notification}
        />}
      </div>
    );
  }
}


