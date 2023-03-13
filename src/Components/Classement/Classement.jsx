import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import ListClassement from '../ListClassement/ListClassement';
import Loader from '../Loader/Loader';
import ScrollTop from '../ScrollTop/ScrollTop';
import './Classement.scss';

function Classement() {
	const classementID = 'XXJ9yQ0slzmwKLLEr1fI';
	const [classement, setClassement] = useState(null);
	const [loader, setLoader] = useState(false);
	const TOP = 300;

	useEffect(() => {
		setLoader(true);
		//Chargement du Classement
		db.collection('classement')
			.doc(classementID)
			.get()
			.then((doc) => {
				//console.log(doc.data().classement);
				setClassement(doc.data().classement);
				setLoader(false);
			})
			.catch((err) => console.log(err));
	}, []);

	return (
		<>
			<ScrollTop />
			{loader ? (
				<Loader />
			) : (
				<div className='Classement'>
					<h1>TOP {TOP}</h1>
					{classement && <ListClassement classementFinal={classement} />}
				</div>
			)}
		</>
	);
}

export default Classement;
