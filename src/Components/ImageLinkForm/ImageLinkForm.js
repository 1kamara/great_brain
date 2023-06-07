import React from "react";
import './ImageLinkForm.css';

const ImageLinkForm = ({ onInputChange, onSubmitButton }) => {
    return (
     <div>
      <p className="f3">
        {`This is Tech brain will detect faces in your photos! Give it a try!`}
        </p>
        <div className="center">
            <div className="form center pa4 br3 shadow-5">
        <input className="f4 pa2 w-70 center" type="text" onChange={onInputChange}/>
        <button 
        className="w-30 grow f4 link ph23 pv2 dib white bg-light-purple"
        onClick={onSubmitButton}>Detect</button>
        </div>
        </div>
     </div>
     
    )
}
export default ImageLinkForm;