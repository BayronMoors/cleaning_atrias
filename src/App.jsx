import React, { useState } from 'react'
import './App.css'

function App() {
      const [resultat, setResultat] = React.useState("");
      const [numeroAgent, setNumeroAgent] = React.useState("");
      const [oldNumber, setOldNumber] = React.useState("");
      const [oldNumberExclu, setOldNumberExclu] = React.useState("");
      const [soldePga, setSoldePga] = React.useState("");
      const [indexJour, setIndexJour] = React.useState("");
      const [indexNuit, setIndexNuit] = React.useState("");
      const [indexTotal, setIndexTotal] = React.useState("");
      const [indexExcluNuit, setIndexExcluNuit] = React.useState("");


      // checkbox
      const [checkboxes, setCheckboxes] = React.useState({
        pga: false,
        pgaActive: false,
        bihoraire: false,
        excluNuit: false,
      });

      // pga
      const resetPga = () => {
        if (checkboxes['pga'] == false && checkboxes['pgaActive'] == true) {
          setCheckboxes(prev => ({
            ...prev,
            ['pgaActive']: false
          }));
        }
        if (checkboxes['pga'] == false && oldNumber.length > 1) {
          setOldNumber('');
        }
      }

      // exclu nuit
      const resetExclu = () => {
        if (checkboxes['excluNuit'] == false && oldNumberExclu.length > 1) {
          setOldNumberExclu('');
        }
        if (checkboxes['excluNuit'] == false && indexExcluNuit.length > 1) {
          setIndexExcluNuit('');
        }
      }

      // alert
      const [alert, setAlert] = React.useState(false);
      const [alertValue, setAlertValue] = React.useState("");


      const handleCheckBox = (name , checked) => {
        setCheckboxes(prev => ({
          ...prev,
          [name]: checked
        }));
        resetPga();
        resetExclu();
      }

      // generateur de texte
      const genererTexte = () => {
        const separator = `
----------------------------------------
        `;
        const text = [];
        // en tete
        let textAgent = `${numeroAgent} - CLEANING ATRIAS - REMPLACEMENT${checkboxes['pga'] ? !checkboxes['pgaActive'] ? ' DU COMPTEUR PGA INACTIF CODE 502' : ' DU COMPTEUR PGA ACTIF' : ' DU COMPTEUR'} PAR UN COMPTEUR COMMUNICANT`;
        text.push(textAgent);
        text.push(separator);
        text.push(`COMPTEUR RADIE ${oldNumber} `);
        text.push(separator);

        // pga
        const index = [`
${checkboxes['pga'] ? !checkboxes['pgaActive'] ? 'COMPTEUR PGA (INACTIF)' : 'COMPTEUR PGA (ACTIF)' : 'ANCIEN COMPTEUR'} ${oldNumber}
                                        | INDEX JOUR  : ( ${indexJour} ) ${indexJour}KWH `
        ]
        if (indexNuit.length > 1) index.push(`                                        | INDEX NUIT  : ( ${indexNuit} ) ${indexNuit}KWH`);
        if (indexTotal.length > 1) index.push(`                                        | INDEX TOTAL  : ( ${indexTotal} ) ${indexTotal}KWH`);
        if (checkboxes['pga']) {
          if (!checkboxes['pgaActive']) {
            index.push(`\nSOLDE RESTANT 0 EURO CAR PGA INACTIF CODE 502`);
          } else {
            index.push(`\nSOLDE RESTANT ${soldePga} EURO`);
          }
        }
        text.push(index.join('\n'));
        text.push(separator);
        // exclu nuit
        
        if(checkboxes['excluNuit']){
        text.push(`COMPTEUR EXCLUSIF NUIT ${oldNumberExclu}
                                        | INDEX NUIT  : ( ${indexExcluNuit} ) ${indexExcluNuit}KWH `);
        text.push(separator);
        }



        setAlert(true);
        setTimeout(() => setAlert(false), 3000);
        navigator.clipboard.writeText(text.join('\n')).then(() => {
          setAlertValue("✅ Texte copié dans le presse-papier !");
        }).catch(err => {
          setAlertValue("❌ Erreur lors de la copie : " + err);
        });
        setResultat(text.join('\n'));
      };
  return (
            <div>
          <h1 className="title">Cleaning Atrias</h1>

          <main className="container">
            <div id="old">
              <h2>Ancien Compteur</h2>
              <div className="grid">
                {/*pga####################################*/}
                <span>PGA</span>
                <label className="checkBox">
                  <input id="chpga" type="checkbox" checked={checkboxes['pga']} onChange={e => handleCheckBox("pga", e.target.checked)} />
                  <div className="transition"></div>
                </label>


                <span hidden={!checkboxes['pga']}>Actif</span>
                <div hidden={!checkboxes['pga']}>
                  <label className="checkBox">
                    <input id="chpgaActive" type="checkbox" checked={checkboxes['pgaActive']} onChange={e => handleCheckBox("pgaActive", e.target.checked)} />
                    <div className="transition"></div>
                  </label>
                </div>
                {/*exclu nuit####################################*/}
                <span className="next" >Exclusif nuit</span>
                <label className="checkBox">
                  <input id="chpga" type="checkbox" checked={checkboxes['excluNuit']} onChange={e => handleCheckBox("excluNuit", e.target.checked)} />
                  <div className="transition"></div>
                </label>

                {/*ancien compteur####################################*/}

                <span className="next" hidden={checkboxes['pga']}>Numero de l'ancien compteur</span>
                <input hidden={checkboxes['pga']} type="text" placeholder="" className="input" value={oldNumber} onChange={e => setOldNumber(e.target.value.toUpperCase())} />


                <span className="next" hidden={!checkboxes['pga']}>Numero du PGA</span>
                <input hidden={!checkboxes['pga']} type="text" placeholder="" className="input" value={oldNumber} onChange={e => setOldNumber(e.target.value.toUpperCase())} />

                <span className="next" hidden={!checkboxes['pgaActive']}>Solde du PGA</span>
                <input hidden={!checkboxes['pgaActive']} type="text" placeholder="" className="input" value={soldePga} onChange={e => setSoldePga(e.target.value.toUpperCase())} />
                <span hidden={!checkboxes['pgaActive']}>€</span>
                {/*index####################################*/}

                <span className="next" >Index de Jour</span>
                <input type="text" placeholder="" className="input" value={indexJour} onChange={e => setIndexJour(e.target.value)} />KWH

                <span className="next" >Index de Nuit</span>
                <input type="text" placeholder="" className="input" value={indexNuit} onChange={e => setIndexNuit(e.target.value)} />KWH

                <span className="next" hidden={!checkboxes['pga']} >Index Total PGA</span>
                <input hidden={!checkboxes['pga']} type="text" placeholder="" className="input" value={indexTotal} onChange={e => setIndexTotal(e.target.value)} />
                <span hidden={!checkboxes['pga']}>KWH</span>
                {/*exclu nuit ####################################*/}

                <span className="next" hidden={!checkboxes['excluNuit']}>Numero de l'Exclusif Nuit</span>
                <input hidden={!checkboxes['excluNuit']} type="text" placeholder="" className="input" value={oldNumberExclu} onChange={e => setOldNumberExclu(e.target.value.toUpperCase())} />

                {/*exclu nuit index ####################################*/}

                <span className="next" hidden={!checkboxes['excluNuit']}>Index Exclusif Nuit</span>
                <input hidden={!checkboxes['excluNuit']} type="text" placeholder="" className="input" value={indexExcluNuit} onChange={e => setIndexExcluNuit(e.target.value)} />
                <span hidden={!checkboxes['excluNuit']}>KWH</span>


              </div>
            </div>
            <div id="new">
              <h2>Agent</h2>
              <div className="grid">
                <span className="next">Numero</span>
                <input type="text" placeholder="" className="input" value={numeroAgent} onChange={e => setNumeroAgent(e.target.value.toUpperCase())} />
              </div>
              <pre className="resultat">{resultat}</pre>
            </div>


          </main>
          <div className='btn_container'>
            <button className="btn" onClick={genererTexte} >Genere le text</button>
          </div>
          <div className={`alert ${alert ? "active" : ""}`}>{alertValue}</div>
        </div>
  )
}

export default App
