import React, { useState, useEffect, useCallback } from "react";
import { db, fireTab } from "../../firebase";
import Loader from "../Loader/Loader";
import Modal from "../Modal/Modal";
import ScrollTop from "../ScrollTop/ScrollTop";
import FormEdit from "./FormEdit";
import "./ListQuestions.scss";
import List from "./List";
import ConfirmSupp from "./ConfirmSupp";

function ListQuestions() {
  const baseID = "hz2fK3KpYDlCG7af12t9";

  //State Liste//
  const [questions, setQuestions] = useState([]);
  const [loader, setLoader] = useState(false);
  const [textSucces, setTextSucces] = useState("");
  const [displayModalSucces, setDisplayModalSucces] = useState(false);
  const [displayModalSupression, setDisplayModalSupression] = useState(false);
  const [displayModalForm, setDisplayModalForm] = useState(false);
  //State pour le filtre
  const [filtered, setFiltered] = useState([]);
  const [filtreTheme, setFiltreTheme] = useState("");
  const [filtreNiveau, setFiltreNiveau] = useState("");
  const [filtrePrivate, setFiltrePrivate] = useState("");
  const [filtreWord, setFiltreWord] = useState("");
  //State pour l'édition/suppression
  const [selection, setSelection] = useState(null);

  //Chargement de la base de donnée
  useEffect(() => {
    setLoader(true);
    db.collection("dataBase")
      .doc(baseID)
      .get()
      .then((doc) => {
        //console.table(doc.data().questions);
        const questions = doc.data().questions;

        questions.sort((a, b) => {
          if (a.theme > b.theme) return 1;
          if (a.theme < b.theme) return -1;
          return 0;
        });

        setQuestions(questions);
        setLoader(false);
      })
      .catch((err) => console.log(err));
  }, []);

  //Gestion de la suppression et l'édition par selection de la question en cours
  //CallBack pour eviter le render dans <List/>
  const handleDelete = useCallback((question) => {
    setSelection(question);
    setDisplayModalSupression(true);
  }, []);

  const handleEdit = useCallback((question) => {
    setSelection(question);
    setDisplayModalForm(true);
  }, []);

  const deleteQuestion = () => {
    //delete selection from questions by filter
    setQuestions(questions.filter((question) => question.id !== selection.id));

    //suppression de la question de la base de données
    db.collection("dataBase")
      .doc(baseID)
      .update({ questions: fireTab.arrayRemove(selection) });

    //Gestion des modales de confirmation
    setDisplayModalSupression(false);
    setTextSucces("Supprimé avec Succès");
    setDisplayModalSucces(true);
  };

  //Soumission du Formulaire Edition
  const handleSubmit = (e, editedQuest) => {
    e.preventDefault();

    const copyQuestion = [...questions];
    const index = copyQuestion.findIndex(
      (question) => question.id === selection.id
    );

    copyQuestion[index] = editedQuest;
    setQuestions(copyQuestion);

    // Suppression de la base de donnée
    db.collection("dataBase")
      .doc(baseID)
      .update({ questions: fireTab.arrayRemove(selection) });

    // Ajout dans la base de données
    db.collection("dataBase")
      .doc(baseID)
      .update({ questions: fireTab.arrayUnion(editedQuest) });

    setDisplayModalForm(false);
    setTextSucces("Modifié avec Succès");
    setDisplayModalSucces(true);
  };

  //Gestion du Filtre
  useEffect(() => {
    let finalFilter = [...questions];
    const privateCopy = filtrePrivate === "oui" ? true : false; //conversion string en boolean

    if (filtreTheme !== "")
      finalFilter = finalFilter.filter(
        (question) => question.theme === filtreTheme
      );

    if (filtreNiveau !== "")
      finalFilter = finalFilter.filter(
        (question) => question.niveau === filtreNiveau
      );

    if (filtrePrivate !== "")
      finalFilter = finalFilter.filter(
        (question) => question.private === privateCopy
      );

    if (filtreWord.length > 2)
      finalFilter = finalFilter.filter(
        (question) =>
          question.question.toLowerCase().includes(filtreWord.toLowerCase()) ||
          question.info.toLowerCase().includes(filtreWord.toLowerCase()) ||
          question.choix
            .join("")
            .toLowerCase()
            .includes(filtreWord.toLowerCase())
      );

    //to prevent refresh inutile, on compare les 2 listes
    if (JSON.stringify(finalFilter) !== JSON.stringify(filtered))
      setFiltered(finalFilter);
  }, [questions, filtreTheme, filtreNiveau, filtrePrivate, filtreWord]);

  /*********************Rendu JSX*********************/
  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <div className='ListQuestion'>
          <ScrollTop />
          <h1>Liste des Questions</h1>

          {/* SearchBar */}
          <fieldset className='fieldset-filtre'>
            <legend>
              <i className='fas fa-search'></i> Filtrer
            </legend>
            <select
              value={filtreTheme}
              onChange={(e) => setFiltreTheme(e.target.value)}
            >
              <option value=''>Choisir un Thème</option>
              <option value='compagnons'>Les Compagnons</option>
              <option value='coran'>Coran</option>
              <option value='culture'>Culture Générale</option>
              <option value='histoire'>Histoire</option>
              <option value='jurisprudence'>Jurisprudence</option>
              <option value='prophete'>Muhammad ﷺ</option>
              <option value='lesProphetes'>Les Prophètes</option>
              <option value='textes'>Textes en Islam</option>
            </select>

            <select
              value={filtreNiveau}
              onChange={(e) => setFiltreNiveau(e.target.value)}
            >
              <option value=''>Choisir un Niveau</option>
              <option value='1'>Débutant</option>
              <option value='2'>Intermédiaire</option>
              <option value='3'>Expert</option>
            </select>

            <select
              value={filtrePrivate}
              onChange={(e) => setFiltrePrivate(e.target.value)}
            >
              <option value=''>Caché?</option>
              <option value='oui'>Oui</option>
              <option value='non'>Non</option>
            </select>

            <input
              type='search'
              placeholder='Chercher un mot'
              value={filtreWord}
              onChange={(e) => setFiltreWord(e.target.value)}
            />

            <span className='nb-question'>
              {filtered.length}/{questions.length}
            </span>
          </fieldset>

          {/* Liste des Questions */}
          <List
            filtered={filtered}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />

          {/* Formulaire */}
          {displayModalForm && (
            <FormEdit
              question={selection}
              setDisplayModalForm={() => setDisplayModalForm(false)}
              handleSubmit={handleSubmit}
            />
          )}

          {/* Affichage du modal confirmation d'edition */}
          {displayModalSucces && (
            <Modal h1={textSucces} close={() => setDisplayModalSucces(false)} />
          )}

          {/* Affichage du modal confirmation de suppression */}
          {displayModalSupression && (
            <ConfirmSupp
              deleteQuestion={deleteQuestion}
              close={() => setDisplayModalSupression(false)}
            />
          )}
        </div>
      )}
    </>
  );
}

export default ListQuestions;
