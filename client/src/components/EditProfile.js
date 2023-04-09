import React from "react";
export default class EditProfile extends React.Component {

    imageDisplay = React.createRef(null);
    renderImage = React.createRef(null);

    state ={
        newImage:""
    }

    componentDidMount(){
        this.imageDisplay.current.style.backgroundImage = `url(${this.props.personalInfo.profile_picture})`;
    }

    renderImage = (event)=>{
        const reader = new FileReader();
        reader.addEventListener("load", ()=>{
            let uploadedImage = reader.result;
            this.imageDisplay.current.style.backgroundImage = `url(${uploadedImage})`;
        });
        reader.readAsDataURL(event.target.files[0]);
    };

    setNewImage = (event)=>{
        this.setState({newImage:event.target.value});
    }

    discard = ()=>{
        this.setState({newImage:""});
        this.imageDisplay.current.style.backgroundImage = `url(${this.props.personalInfo.profile_picture})`;
    }

    

    render(){
        return (
            <div className="editProfile flexCol"> 
                <div id="back" className="backArrow" onClick={()=>this.props.setOpenPage("")}></div>
                
                <div className="flexCol">
                    <div id="displayImage" ref={this.imageDisplay}></div>
                    <input className="imageUpload" type="file" accept="image/png, image/jpeg" onChange={this.renderImage}/>

                    <input type="text" value={this.state.newImage} onChange={this.setNewImage} placeholder={this.props.personalInfo.name} />
                </div>

                <div className="flexRow buttons">
                    <button className="discard" onClick={this.discard}>Discard</button>
                    <button className="apply">Apply</button>
                </div>
            </div>
        );
    }
}