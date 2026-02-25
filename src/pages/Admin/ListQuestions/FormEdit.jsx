import React, { useState } from 'react';

export default function FormEdit(props) {
  const { theme, niveau, question, choix, reponse, info, id } = props.question;

  const [state, setState] = useState({
    theme,
    niveau,
    private: props.question.private, //private use reserved
    question,
    choix,
    reponse,
    info,
    id,
  });

  //Modifier l'enregistrement de choix dans le state
  const handleChoix = (value, id) => {
    const conversion = { choix1: 0, choix2: 1, choix3: 2, choix4: 3 };
    const copyChoix = [...state.choix];
    const index = conversion[id];
    copyChoix[index] = value.replace('sws', 'ﷺ');
    setState({ ...state, choix: copyChoix });
  };

  return (
    <div className='form-container'>
      <form className='form' onSubmit={(e) => props.handleSubmit(e, state)}>
        <h1>Editer la Question ?</h1>
        <fieldset>
          <legend>Thème*</legend>
          <select
            value={state.theme}
            onChange={(e) => setState({ ...state, theme: e.target.value })}
            required>
            <option value=''>Choisir un Thème</option>
            <option value='compagnons'>Les Compagnons</option>
            <option value='coran'>Coran</option>
            <option value='culture'>Culture Générale</option>
            <option value='histoire'>Histoire</option>
            <option value='jurisprudence'>Jurisprudence</option>
            <option value='prophete'>Muhammad ﷺ</option>
            <option value='lesProphetes'>Les Prophètes</option>
            <option value='textes'>Textes en Islam</option>
          </select>
        </fieldset>

        <fieldset>
          <legend>Niveau*</legend>

          <span className='radio'>
            <input
              type='radio'
              id='debutant'
              name='niveau'
              value='1'
              checked={state.niveau === '1'}
              onChange={(e) => setState({ ...state, niveau: e.target.value })}
              required
            />
            <label htmlFor='debutant'>Débutant</label>
          </span>
          <span className='radio '>
            <input
              type='radio'
              id='intermediaire'
              name='niveau'
              value='2'
              checked={state.niveau === '2'}
              onChange={(e) => setState({ ...state, niveau: e.target.value })}
            />
            <label htmlFor='intermediaire'>Intermédiaire</label>
          </span>
          <span className='radio'>
            <input
              type='radio'
              id='expert'
              name='niveau'
              value='3'
              checked={state.niveau === '3'}
              onChange={(e) => setState({ ...state, niveau: e.target.value })}
            />
            <label htmlFor='expert'>Expert</label>
          </span>
        </fieldset>

        <fieldset>
          <legend>Uniquement en Compétition*</legend>
          <span className='radio large'>
            <input
              type='radio'
              id='non'
              name='private'
              value={false}
              checked={state.private === false}
              onChange={(e) =>
                setState({
                  ...state,
                  private: e.target.value === 'true' ? true : false,
                })
              }
              required
            />
            <label htmlFor='non'>Non</label>
          </span>
          <span className='radio large'>
            <input
              type='radio'
              id='oui'
              name='private'
              value={true}
              checked={state.private === true}
              onChange={(e) =>
                setState({
                  ...state,
                  private: e.target.value === 'true' ? true : false,
                })
              }
            />
            <label htmlFor='oui'>Oui</label>
          </span>
        </fieldset>

        <fieldset>
          <legend>Question*</legend>
          <textarea
            rows='3'
            value={state.question}
            onChange={(e) =>
              setState({
                ...state,
                question: e.target.value.replace('sws', 'ﷺ'),
              })
            }
            placeholder='Ecrire ici la question'
            required
            spellCheck='true'
          />
        </fieldset>

        <fieldset className='column'>
          <legend>Choix</legend>
          <input
            type='text'
            id='choix1'
            value={state.choix[0]}
            onChange={(e) => handleChoix(e.target.value, e.target.id)}
            required
            placeholder='Choix 1*'
          />

          <input
            type='text'
            id='choix2'
            value={state.choix[1]}
            onChange={(e) => handleChoix(e.target.value, e.target.id)}
            required
            placeholder='Choix 2*'
          />

          <input
            type='text'
            id='choix3'
            value={state.choix[2]}
            onChange={(e) => handleChoix(e.target.value, e.target.id)}
            placeholder='Choix 3'
          />
          <input
            type='text'
            id='choix4'
            value={state.choix[3]}
            onChange={(e) => handleChoix(e.target.value, e.target.id)}
            placeholder='Choix 4'
          />
        </fieldset>

        <fieldset>
          <legend>Bonne Réponse*</legend>

          <span className='radio medium'>
            <input
              type='radio'
              id='rep1'
              name='reponse'
              value='1'
              checked={state.reponse === '1'}
              //   onChange={(e) => setReponse(e.target.value)}
              onChange={(e) => setState({ ...state, reponse: e.target.value })}
              required
            />
            <label htmlFor='rep1'>#1</label>
          </span>

          <span className='radio medium'>
            <input
              type='radio'
              id='rep2'
              name='reponse'
              value='2'
              checked={state.reponse === '2'}
              onChange={(e) => setState({ ...state, reponse: e.target.value })}
            />
            <label htmlFor='rep2'>#2</label>
          </span>

          <span className='radio medium'>
            <input
              type='radio'
              id='rep3'
              name='reponse'
              value='3'
              checked={state.reponse === '3'}
              onChange={(e) => setState({ ...state, reponse: e.target.value })}
            />
            <label htmlFor='rep3'>#3</label>
          </span>

          <span className='radio medium'>
            <input
              type='radio'
              id='rep4'
              name='reponse'
              value='4'
              checked={state.reponse === '4'}
              onChange={(e) => setState({ ...state, reponse: e.target.value })}
            />
            <label htmlFor='rep4'>#4</label>
          </span>
        </fieldset>

        <fieldset>
          <legend>Explication</legend>
          <textarea
            rows='3'
            value={state.info}
            onChange={(e) =>
              setState({ ...state, info: e.target.value.replace('sws', 'ﷺ') })
            }
            placeholder="Complément d'information sur la réponse"
            spellCheck='true'
          />
        </fieldset>

        <div className='container-button'>
          <button type='submit'>Modifier</button>
          <button className='gray' type='button' onClick={props.setDisplayModalForm}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
