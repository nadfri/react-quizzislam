import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Classement from '../Classement/Classement';
import Competition from '../Competition/Competition';
import Entrainement from '../Entrainement/Entrainement';
import Header from '../Header/Header';
import Home from '../Home/Home';
import NavBar from '../NavBar/NavBar';
import Quizz from '../Quizz/Quizz';
import './App.scss';
import wallpaper from './background2.jpg';

function App() {

  const background = { backgroundImage: `url(${wallpaper})` };



	return (
		<BrowserRouter>
			<div className='App' style={background}>
				<Header />

				<Switch>
					<Route exact path='/' component={Home} />
					<Route exact path='/competition' component={Competition} />
					<Route exact path='/entrainement' component={Entrainement} />
					<Route exact path='/entrainement/quizz/:theme' component={Quizz} />
					<Route exact path='/classement' component={Classement} />
					<Route component={Home} />
				</Switch>

				<NavBar />
			</div>
		</BrowserRouter>
	);
}

export default App;
