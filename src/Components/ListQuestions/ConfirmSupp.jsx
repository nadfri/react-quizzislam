import React from "react";

function ConfirmSupp(props) {
  return (
    <div className='Modal'>
      <div className='box'>
        <h1>Confirmer la Suppression ?</h1>

        <button className='red' onClick={props.deleteQuestion}>
          Supprimer
        </button>
        <button onClick={props.close}>Annuler</button>
      </div>
    </div>
  );
}

export default ConfirmSupp;
