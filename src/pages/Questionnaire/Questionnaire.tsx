import { useEffect, useState } from "react";

import { getDocs, collection, addDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../config/firebase-config'

import RadioButtonGroup from '../../components/RadiobuttonGroup';
import { MenuItem, Select } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';



type RadioOption = {
    label: string;
    value: string;
}

type RadioOptionMultiUse = {
    label: string;
    value: boolean;
}

const tabAmountOptions: RadioOption[] = [
    { value: 'Muutama (1-10)', label: 'Muutama (1-10)' },
    { value: 'Useampi (11-20)', label: 'Useampi (11-20)' },
    { value: 'Monta (21-50)', label: 'Monta (21-50)' },
]

const multiUseOptions: RadioOptionMultiUse[] = [
    { value: false, label: 'Yleensä vain yksi ohjelma kerrallaan auki' },
    { value: true, label: 'Pidän useaa ohjelmaa samaan aikaa auki' },
]

const externalMonitorOptions: RadioOptionMultiUse[] = [
    { value: false, label: 'Käytän yleensä pelkkää kannettavan näyttöä' },
    { value: true, label: 'Kytken ulkoisen monitorin kiinni' },
]
const Questionnaire = () => {


    const [freeWord, setFreeword] = useState('');
    const [userName, setUserName] = useState('');
    const [tabValue, setTabValue] = useState<string>('');
    const [multiUse, setMultiUse] = useState<boolean>(false);
    const [computerHours, setComputerHours] = useState<number>(0);
    const [isExternalMonitor, setIsExternalMonitor] = useState<boolean>(false);
    const [isSubmitPressed, setIsSubmitPressed] = useState<boolean>(false);
    const [selectedWorkEnviro, setSelectedWorkEnviro] = useState('Kotona');
    const [userAnswers, setUserAnswers] = useState([]) as any;

    const questionnaireCollectionFromDb = collection(db, "questionnaire");

    const handleTabValueChange = (newValue: string | boolean) => {
        if (typeof newValue === 'string') {
            setTabValue(newValue);
        } 
        else {
            console.error("Expected a string value");
        }
    };

    const handleMultiUseChange = (newValue: boolean | string) => {
        if (typeof newValue === 'boolean') {
            setMultiUse(newValue);
        } else {
            console.error("Expected a boolean value");
        }
    };
    const handleExternalMonitorChange = (newValue: boolean | string) => {
        if (typeof newValue === 'boolean') {
            setIsExternalMonitor(newValue);
        } else {
            console.error("Expected a boolean value");
        }
    };

    const getUserAnswers = async () => {
        try {
            const data = await getDocs(questionnaireCollectionFromDb);
            //the response from firebase is filled with extra data we don't need
            const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            //! doc.data() is a function to get collection data it seems
            setUserAnswers(filteredData);
        }
        catch (err) {
            console.error(err);

        }
    }

    useEffect(() => {
        getUserAnswers();
    }, [])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await addDoc(questionnaireCollectionFromDb, {
                userName: userName,
                freeSpeech: freeWord,
                tabAmount: tabValue,
                isMultiUse: multiUse,
                isExternalMonitor,
                computerHours,
                workEnviro: selectedWorkEnviro
            })
            getUserAnswers();
        }
        catch (err) {
            console.error(err);
        }
        setIsSubmitPressed(true);
    }

    const logout = async () => {
        try {
            await signOut(auth);
            console.log("Log out success");
        }
        catch (err) {
            console.error(err);
        }
    }

    function BasicTextFields() {
        return (
            <Box sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white', // Set the border color to red
                },
                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white', // Set the focused border color to green
                },
                '& .MuiOutlinedInput-input': {
                    color: 'white', // Set the text color to white
                },
                '&:hover .MuiOutlinedInput-input': {
                    color: 'white', // Set the hover text color to purple
                },

                '&:hover:not(.Mui-focused) .MuiOutlinedInput-input': {
                    color: 'white', // Set the hover text color to red
                },
                '& .MuiInputLabel-root': {
                    color: '#ffffff', // Set the default label color to red
                },
                '&:hover .MuiInputLabel-root': {
                    color: '#ffffff', // Set the hover label color to green
                },
                '&.Mui-focused .MuiInputLabel-root': {
                    color: '#ffffff', // Set the focused label color to blue
                },
                '& .MuiSvgIcon-root': {
                    color: '#ffffff',
                },
            }}>
                <h3>Haluatko kertoa kuka olet? Ei ole pakko</h3>
                <TextField color="primary" id="name" label="Moi, olen.." variant="outlined" onChange={e => setUserName(e.target.value)} />
                <div className="box-question">
                    <h3>Pidätkö selaimessasi päällä useita välilehtiä kerralla? </h3>
                    <p>Arvioi keskimääräistä välilehtien määrää selaimessasi.</p>
                    <RadioButtonGroup value={tabValue} options={tabAmountOptions} name={'tabOptions'} onChange={handleTabValueChange} />
                </div>
                <div className="box-question">
                    <h3>Käytätkö konetta yleensä yhden asian tekemiseen kerralla? </h3>
                    <p>Kysymyksen tarkoitus on kartoittaa, että pyöriikö Syklin tyypeillä koneella yleensä taustaprosesseja.
                        Yhden asian tekeminen kerralla tässä tarkoittaa, että koneella on auki ja aktiivisena vain se yksi ohjelma. Esimerkiksi Word, ei muuta.
                        Esimerkki 'monesta asiasta kerralla' on vaikka musiikin kuuntelu selaimessa youtubesta ja samaan aikaan kirjoittaminen Wordilla.</p>
                    <RadioButtonGroup value={multiUse} options={multiUseOptions} name={'multiUseOptions'} onChange={handleMultiUseChange} />
                </div>
                <div className="box-question">
                    <h3>Tykkäätkö käyttää ulkoista monitoria?</h3>
                    <p>Jos ulkoinen monitori on saatavilla, niin kytketkö sen kiinni?</p>
                    <RadioButtonGroup value={isExternalMonitor} options={externalMonitorOptions} name={'externalMonitorOptions'} onChange={handleExternalMonitorChange} />
                </div>
                <div className="box-question">
                    <h3>Missä työskentelet useimmiten?</h3>
                    <p>Oletko kotona tai ehkä toimistolla?</p>
                    <div>
                        {selectedWorkEnviro === 'somethingElse' ? (
                            <>
                                <p>Valitsit joku muu. Missä se mahtaisi olla?</p>
                                <TextField label="Kerro toki.." variant="outlined" onChange={e => setSelectedWorkEnviro(e.target.value)} />
                            </>
                        ) : (
                            <Select value={selectedWorkEnviro} onChange={e => setSelectedWorkEnviro(e.target.value)}>
                                <MenuItem value="Kotona">Kotona</MenuItem>
                                <MenuItem value="Toimistolla">Toimistolla</MenuItem>
                                <MenuItem value="somethingElse">Jokin muu, mikä?</MenuItem>
                            </Select>
                        )}
                    </div>

                </div>
                <div className="box-question">
                    <h3>Arvioi montako tuntia olet päivässä koneen äärellä</h3>
                    <TextField type="number" color="primary" id="outlined-basic" label="Suunnilleen näin monta tuntia.." variant="outlined" onChange={e => setComputerHours(Number(e.target.value))} />
                </div>

                <div className="box-question">
                    <h3>Vapaa sana. Onko sinulla ajatuksia mitä haluaisit tutkittavan kannettavan tietokoneen käytön tai energiatehokkuuden suhteen?</h3>
                    <TextField style={{ width: '50%' }} color="primary" id="outlined-basic" multiline label="Vapaa sana.." variant="outlined" onChange={e => setFreeword(e.target.value)} />
                </div>
            </Box>
        );
    }

    return (
        <>
            {!isSubmitPressed && (
                <form onSubmit={handleSubmit}>
                    {BasicTextFields()}
                    <button style={{ backgroundColor: '#22936e', color: 'black', padding: '0.5em 2em', marginTop: '20px' }} type="submit">Lähetä</button>
                </form>
            )}
            {isSubmitPressed && (
                <div style={{ marginTop: '50px' }}>
                    <h3>Kiitos vastauksista! Voit nyt kirjautua ulos jos haluat.</h3>
                    <button onClick={logout}>Kirjaudu ulos</button>
                </div>
            )}
        </>
    );
}


export default Questionnaire;