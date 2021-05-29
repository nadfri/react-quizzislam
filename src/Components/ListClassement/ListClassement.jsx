import React from 'react';
import './ListClassement.scss';

function ListClassement(props) {
	const { pseudo, score, classementFinal } = props;
	//console.log(classementFinal);

	const userID = (user) =>
		user.pseudo === pseudo && user.score === score ? 'userID' : null;

	return (
		<div className='ListClassement'>

			<table>
				<thead>
					<tr>
						<th className='rank'>Rang</th>
						<th className='pseudo'>Pseudo</th>
						<th className='score'>Score</th>
						<th className='note'>Note</th>
					</tr>
				</thead>
				<tbody>
					<tr className='gold'>
						<td>
							<i className='fas fa-trophy'></i>
						</td>
						<td id={userID(classementFinal[0])}>{classementFinal[0].pseudo}</td>
						<td>{classementFinal[0].score.toLocaleString()}</td>
						<td>{classementFinal[0].note}</td>
					</tr>
					<tr className='silver'>
						<td>
							<i className='fas fa-trophy'></i>
						</td>

						<td id={userID(classementFinal[1])}>{classementFinal[1].pseudo}</td>
						<td>{classementFinal[1].score.toLocaleString()}</td>
						<td>{classementFinal[1].note}</td>
					</tr>
					<tr className='bronze'>
						<td>
							<i className='fas fa-trophy'></i>
						</td>
						<td id={userID(classementFinal[2])}>{classementFinal[2].pseudo}</td>
						<td>{classementFinal[2].score.toLocaleString()}</td>
						<td>{classementFinal[2].note}</td>
					</tr>
					{classementFinal
						.slice(3)
						.filter((user) => user.pseudo !== '')
						.map((user, index) => (
							<tr key={index} id={userID(user)}>
								<td>{index + 4}</td>
								<td>{user.pseudo}</td>
								<td>{user.score.toLocaleString()}</td>
								<td>{user.note}</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
}

export default ListClassement;
