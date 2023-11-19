import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

function List(props) {
  const tabNiveau = ["", "Débutant", "Intermédiaire", "Expert"];

  return props.filtered.map((question, index) => (
    <fieldset key={question.id}>
      <legend>Question #{index + 1}</legend>
      <ul>
        <li>
          <b>Thème: </b>
          {question.theme}
        </li>
        <li>
          <b>Caché: </b>
          {question.private ? "Oui" : "Non"}
        </li>
        <li>
          <b>Niveau: </b>
          {tabNiveau[question.niveau]}
        </li>
        <li>
          <b>Question: </b>
          {question.question}
        </li>
        <li>
          <b>Choix</b>
          <ul>
            {question.choix.map((choice, index) => (
              <li key={index}>{choice}</li>
            ))}
          </ul>
        </li>
        <li>
          <b>Réponse: </b>
          {question.reponse}
        </li>
        <li>
          <b>Explication: </b>
          {question.info}
        </li>
      </ul>

      <div className='container-icons'>
        <div className='icons' onClick={() => props.handleEdit(question)}>
          <MdEdit className="icon" />
        </div>
        <div className='icons' onClick={() => props.handleDelete(question)}>
          <FaTrashAlt className="icon" />
        </div>
      </div>
    </fieldset>
  ));
}

export default React.memo(List);
