import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import ListClassement from '../ListClassement/ListClassement';
import Loader from '../Loader/Loader';
import ScrollTop from '../ScrollTop/ScrollTop';
import { CLASSEMENT, CLASSEMENT_ID, TOP } from '../../utils/constants';
import './Classement.scss';

function Classement() {
  const [classement, setClassement] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setLoader(true);
    //Chargement du Classement
    db.collection(CLASSEMENT)
      .doc(CLASSEMENT_ID)
      .get()
      .then((doc) => {
        setClassement(doc.data().classement);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  }, []);

  return (
    <>
      <ScrollTop />
      {loader ? (
        <Loader />
      ) : (
        <div className='Classement'>
          <h1>TOP {TOP}</h1>
          <ListClassement classement={classement} />

          {classement.length === 0 && (
            <p className='classement-zero'>Le classement a été remis à zéro</p>
          )}
        </div>
      )}
    </>
  );
}

export default Classement;
