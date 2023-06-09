import React from "react";
import {sendHttpPostRequest} from "../clientTools";
import Load from "./Load";
import Notification from "./Notification";

export default class EditProfile extends React.Component {

    imageDisplay = React.createRef(null);
    applyBtn = React.createRef(null);

    state ={
        newImage:"",
        newName:"",
        newPassword:"",
        success:false,
        loading:false
    }

    componentDidMount(){
        this.imageDisplay.current.style.backgroundImage = `url(${this.props.personalInfo.profile_picture})`;
    }

    renderImage = (event)=>{
        const reader = new FileReader();
        reader.addEventListener("load", ()=>{
            let uploadedImage = reader.result;
            this.imageDisplay.current.style.backgroundImage = `url(${uploadedImage})`;
            this.setState({newImage:uploadedImage});
        });
        
        let fileSize = event.target.files[0].size;
        let fileMb = fileSize / 1024 ** 2;
        
        if(fileMb < 1){
            reader.readAsDataURL(event.target.files[0]);
        }
        else{
            this.props.setNotification(true,"Image sixe can't go over 1MB");
        }
    };

    setNewName = (event)=>{
        if(event.target.value.length > 20){
            this.props.setNotification(true,"Name can not be over 20 letters long");
            return;
        }
        this.setState({newName:event.target.value});
    }

    discard = ()=>{
        this.setState({newImage:"", newName:""});
        this.imageDisplay.current.style.backgroundImage = `url(${this.props.personalInfo.profile_picture})`;
    }

    sendUpdateRequest =()=>{
        this.applyBtn.current.disabled = true;
     
        let body = {
            email:this.props.email,
            password:this.props.password,
            newName: (this.state.newName.length>2 && this.state.newName !== this.props.personalInfo.name) ? this.state.newName : false,
            newImage:this.state.newImage !== "" ? this.state.newImage : false,
            newPassword:false
        }
        this.setState({loading:true});

        sendHttpPostRequest(this.props.baseUrl+"api/updateUser",JSON.stringify(body),(response)=>{
            this.applyBtn.current.disabled = false;
            this.setState({success:true, loading:false});
            setTimeout(()=>{this.setState({success:false});}, 900);
        },
        (status, resopnse)=>{
            this.setState({loading:false});
            this.props.setNotification(true,resopnse);
        });
    }

    render(){
        return (
            <div className="editProfile flexCol"> 
                {this.state.success ? <Load success={true} loading={false} /> : ""}
                {this.state.loading ? <Load success={false} loading={true} /> : ""}

                <div id="back" className="backArrow" onClick={()=>this.props.setOpenPage("")}></div>
                
                <div className="flexCol">
                    <div id="displayImage" ref={this.imageDisplay}></div>
                    <input className="imageUpload" type="file" accept="image/png, image/jpeg" onChange={this.renderImage}/>

                    <input type="text" value={this.state.newName} onChange={this.setNewName} placeholder={this.props.personalInfo.name} />
                </div>

                <div className="flexRow buttons">
                    <button className="discard" onClick={this.discard}>Discard</button>
                    <button className="apply" onClick={this.sendUpdateRequest} ref={this.applyBtn}>Apply</button>
                </div>
            </div>
        );
    }
}