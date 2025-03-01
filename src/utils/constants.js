export const DATABASE =
  process.env.NODE_ENV === 'development' ? 'dataBase-dev' : 'dataBase';

export const DB_ID =
  process.env.NODE_ENV === 'development'
    ? process.env.REACT_APP_DB_ID_DEV
    : process.env.REACT_APP_DB_ID;

export const CLASSEMENT =
  process.env.NODE_ENV === 'development' ? 'classement-dev' : 'classement';

export const CLASSEMENT_ID =
  process.env.NODE_ENV === 'development'
    ? process.env.REACT_APP_CLASSEMENT_ID_DEV
    : process.env.REACT_APP_CLASSEMENT_ID;

export const TOP = 500;
export const DURATION = process.env.NODE_ENV === 'development' ? 20 : 240;
export const BONUS = 1000;
export const MALUS = 400;
export const MIN_POINT = 200;
