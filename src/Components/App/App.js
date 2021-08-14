import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Classement from "../Classement/Classement";
import Competition from "../Competition/Competition";
import Entrainement from "../Entrainement/Entrainement";
import Header from "../Header/Header";
import Home from "../Home/Home";
import NavBar from "../NavBar/NavBar";
import Quizz from "../Quizz/Quizz";
import "./App.scss";
import fire from "../../firebase";
import Connexion from "../Login/Connexion/Connexion";
import ListQuestions from "../ListQuestions/ListQuestions";
import Settings from "../Settings/Settings";
import Forget from "../Login/Forget/Forget";
import AjoutQuestions from "../AjoutQuestions/AjoutQuestions";
import Niveau from "../Niveau/Niveau";
import Apropos from "../Apropos/Apropos";
import Admin from "../Admin/Admin";
import Signalement from "../Signalement/Signalement";
import Suggestion from "../Suggestion/Suggestion";
import PwaButton from "../PwaButton/PwaButton";

function App() {
  const [user, setUser] = useState("");
  useEffect(() => authListener(), []);

  const authListener = () => {
    fire.auth().onAuthStateChanged((user) => {
      if (user) setUser(user);
      else setUser("");
    });
  };

  return (
    <BrowserRouter>
      <div className='App' id='App'>
        {/* Header */}
        <Header />

        {/* Main Content */}
        <PwaButton />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/competition' component={Competition} />
          <Route exact path='/entrainement' component={Entrainement} />
          <Route exact path='/entrainement/quizz/:theme' component={Niveau} />
          <Route
            exact
            path='/entrainement/quizz/:theme/:niveau'
            component={Quizz}
          />
          <Route exact path='/classement' component={Classement} />
          <Route exact path='/connexion' component={Connexion} />
          <Route exact path='/settings' component={Settings} />
          <Route exact path='/settings/signalement' component={Signalement} />
          <Route exact path='/settings/forget' component={Forget} />
          <Route exact path='/settings/apropos' component={Apropos} />
          <Route exact path='/settings/suggestion' component={Suggestion} />

          <Route
            exact
            path='/settings/ajout'
            render={() => (user ? <AjoutQuestions /> : <Connexion />)}
          />
          <Route
            exact
            path='/settings/list'
            render={() => (user ? <ListQuestions /> : <Connexion />)}
          />
          <Route
            exact
            path='/settings/admin'
            render={() => (user ? <Admin /> : <Connexion />)}
          />

          <Route component={Home} />

        </Switch>

         {/* NavBar  */}
        <NavBar />
      </div>
    </BrowserRouter>
  );
}

export default App;
