import React from "react";
import "../App.css";


function Interact({onClose}) {
    return (
        <div className="share-modal">
        <h2>Add something to your room</h2>
        

        <button className="close-button" onClick={onClose}>Close</button>

        </div>
    );
}

export default Interact;