import React from 'react';
import './ListClassement.scss';
import { FaTrophy } from 'react-icons/fa';

function ListClassement(props) {
  const { pseudo, score, classement } = props;


  const userID = (user) =>
    user?.pseudo === pseudo && user?.score === score ? 'userID' : "";

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
              <FaTrophy className='icon' />
            </td>
            <td id={userID(classement[0])}>{classement[0]?.pseudo}</td>
            <td>{classement[0]?.score?.toLocaleString()}</td>
            <td>{classement[0]?.note}</td>
          </tr>
          <tr className='silver'>
            <td>
              <FaTrophy className='icon' />
            </td>

            <td id={userID(classement[1])}>{classement[1]?.pseudo}</td>
            <td>{classement[1]?.score?.toLocaleString()}</td>
            <td>{classement[1]?.note}</td>
          </tr>
          <tr className='bronze'>
            <td>
              <FaTrophy className='icon' />
            </td>
            <td id={userID(classement[2])}>{classement[2]?.pseudo}</td>
            <td>{classement[2]?.score.toLocaleString()}</td>
            <td>{classement[2]?.note}</td>
          </tr>
          {classement
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
