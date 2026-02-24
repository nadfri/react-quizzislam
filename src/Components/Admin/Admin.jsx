import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Settings/Settings';
import { db } from '../../firebase';


function Admin() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadDb = async () => {
    if (isDownloading) {
      return;
    }

    setIsDownloading(true);

    try {
      const doc = await db.collection('dataBase').doc(process.env.REACT_APP_DB_ID).get();

      if (!doc.exists) {
        console.error(`Le document est introuvable.`);
        return;
      }

      const json = JSON.stringify(doc.data(), null, 2);
      const today = new Date();

      const formattedDate = `${String(today.getDate()).padStart(2, '0')}-${String(
        today.getMonth() + 1,
      ).padStart(2, '0')}-${today.getFullYear()}`;

      const anchor = document.createElement('a');

      anchor.href = `data:application/json;charset=utf-8,${encodeURIComponent(json)}`;
      anchor.download = `db-${formattedDate}.json`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    } catch (error) {
      console.error('Erreur lors du téléchargement de la DB Firebase :', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className='Settings'>
      <Link to='/settings/ajout'>Ajouter des Questions</Link>
      <Link to='/settings/list'>Liste des Questions</Link>
      <button
        className='btn-dl'
        type='button'
        onClick={handleDownloadDb}
        disabled={isDownloading}>
        {isDownloading ? 'Téléchargement...' : 'Télécharger la DB'}
      </button>
    </div>
  );
}

export default Admin;
