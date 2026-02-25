//Librairies
import fire from '../firebase';
import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

//Composants
import Header from '../Components/Header/Header';
import NavBar from '../Components/NavBar/NavBar';
import PwaButton from '../Components/PwaButton/PwaButton';

import Home from '../pages/Home/Home';

import Entrainement from '../pages/Entrainement/Entrainement';
import Niveau from '../pages/Entrainement/Niveau/Niveau';
import Quizz from '../pages/Entrainement/Quizz/Quizz';

import Competition from '../pages/Competition/Competition';

import Connexion from '../pages/Login/Connexion/Connexion';
import Forget from '../pages/Login/Forget/Forget';

import Classement from '../pages/Classement/Classement';

import Settings from '../pages/Settings/Settings';

import Admin from '../pages/Admin/Admin';
import AjoutQuestions from '../pages/Admin/AjoutQuestions/AjoutQuestions';
import ListQuestions from '../pages/Admin/ListQuestions/ListQuestions';

import Apropos from '../pages/Apropos/Apropos';

import Suggestion from '../pages/Suggestion/Suggestion';
import Proposition from '../pages/Proposition/Proposition';
import Signalement from '../pages/Signalement/Signalement';

//CSS
import './App.scss';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [user, setUser] = useState('');

  useEffect(() => authListener(), []);

  const authListener = () => {
    fire.auth().onAuthStateChanged((user) => {
      if (user) setUser(user);
      else setUser('');
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
          <Route exact path='/entrainement/quizz/:theme/:niveau' component={Quizz} />

          <Route exact path='/classement' component={Classement} />

          <Route exact path='/connexion' component={Connexion} />

          <Route exact path='/settings' component={Settings} />
          <Route exact path='/settings/signalement' component={Signalement} />
          <Route exact path='/settings/forget' component={Forget} />
          <Route exact path='/settings/apropos' component={Apropos} />

          <Route exact path='/settings/suggestion' component={Suggestion} />
          <Route exact path='/settings/proposition' component={Proposition} />

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
        {/* Toast */}
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}

export default App;
