import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Classement from '../Classement/Classement';
import Competition from '../Competition/Competition';
import Config from '../Config/Config';
import Entrainement from '../Entrainement/Entrainement';
import Header from '../Header/Header';
import Home from '../Home/Home';
import NavBar from '../NavBar/NavBar';
import Quizz from '../Quizz/Quizz';
import './App.scss';
import fire from '../../firebase';
import Connexion from '../Login/Connexion/Connexion';
import ListQuestions from '../Config/ListQuestions/ListQuestions';

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
				<Header />

				<Switch>
					<Route exact path='/' component={Home} />
					<Route exact path='/competition' component={Competition} />
					<Route exact path='/entrainement' component={Entrainement} />
					<Route exact path='/entrainement/quizz/:theme' component={Quizz} />
					<Route exact path='/classement' component={Classement} />
					<Route exact path='/connexion' component={Connexion} />
					<Route
						exact
						path='/config'
						render={() => (user ? <Config /> : <Connexion />)}
					/>
					<Route
						exact
						path='/config/list'
						render={() => (user ? <ListQuestions /> : <Connexion />)}
					/>

					<Route component={Home} />
				</Switch>

				<NavBar />
			</div>
		</BrowserRouter>
	);
}

export default App;
