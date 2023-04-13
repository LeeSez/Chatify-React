import React from "react";

export default class MainSetting extends React.Component{

    render(){
        let options = this.props.options;
        let optionElements = options.map((option, index)=>{
            if(option.name == "Log out"){
                return <button key={index} className="flexRow red" onClick={()=>option.action()}>{option.name}</button>
            }
            else{
                return <button key={index} className="flexRow" onClick={()=>option.action()}>{option.name}</button>
            }
        });

        return(
            <div className="settings">
                {optionElements}
            </div>
        )
    }
}