import { useState } from "react";

//import { getDocs, collection, addDoc } from 'firebase/firestore';
import { addDoc, collection } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "../../config/firebase-config";

import RadioButtonGroup from "../../components/RadiobuttonGroup";
import {
    Box,
    FormControlLabel,
    FormGroup,
    MenuItem,
    Select,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import ThreeDRotation from "@mui/icons-material/ThreeDRotation";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

type RadioOption = {
    label: string;
    value: string;
};

type RadioOptionMultiUse = {
    label: string;
    value: boolean;
};

const tabAmountOptions: RadioOption[] = [
    { value: "Muutama (1-10)", label: "Muutama (1-10)" },
    { value: "Useampi (11-20)", label: "Useampi (11-20)" },
    { value: "Monta (21-50)", label: "Monta (21-50)" },
];

const multiUseOptions: RadioOptionMultiUse[] = [
    { value: false, label: "Yleensä vain yksi ohjelma kerrallaan auki" },
    { value: true, label: "Pidän useaa ohjelmaa samaan aikaa auki" },
];

const externalMonitorOptions: RadioOptionMultiUse[] = [
    { value: false, label: "Pelkkä läppärin näyttö" },
    { value: true, label: "Oli joo ulkoinen monitorin kiinni" },
];

const usedSoftwareOptions: RadioOptionMultiUse[] = [
    { value: false, label: "Eipä tullut käytettyä" },
    { value: true, label: "No okei okei, saatoin nyt vähän käyttääkkin" },
];

const Questionnaire = () => {
    const [isExternalMonitor, setIsExternalMonitor] = useState<boolean>(false);
    const [isSubmitPressed, setIsSubmitPressed] = useState<boolean>(false);
    const [isSoftwareUse, setIsSoftwareUse] = useState(false);

    const [softwareUseMins, setSoftwareUseMins] = useState<number>();
    const [userName, setUserName] = useState("");
    const [computerMinutes, setComputerMinutes] = useState<number>();
    const [selectedWorkEnviro, setSelectedWorkEnviro] = useState("Kotona");
    const [selectedWorkOtherEnviro, setSelectedWorkOtherEnviro] = useState<string>();
    const [teamsUse, setTeamsUse] = useState({
        didUseTeams: false,
        teamsSelfCameraOn: false,
        cameraMinutes: null,
        teamsMinutes: null,
    });
    // No need for this yet const [userAnswers, setUserAnswers] = useState([]) as any;
    const questionnaireCollectionFromDb = collection(db, "questionnaire");

    //*Varsinaista kyselyä varten
    const surveyCollectionFromDb = collection(db, "survey");

    // const handleTabValueChange = (newValue: string | boolean) => {
    //     if (typeof newValue === "string") {
    //         setTabValue(newValue);
    //     } else {
    //         console.error("Expected a string value");
    //     }
    // };

    const handleSoftwareUse = (newValue: boolean | string) => {
        if (typeof newValue === "boolean") {
            setIsSoftwareUse(newValue);
        } else {
            console.error("Expected a boolean value");
        }
    };
    const handleExternalMonitorChange = (newValue: boolean | string) => {
        if (typeof newValue === "boolean") {
            setIsExternalMonitor(newValue);
        } else {
            console.error("Expected a boolean value");
        }
    };

    //* No need yet
    // const getUserAnswers = async () => {
    //     try {
    //         const data = await getDocs(questionnaireCollectionFromDb);
    //         //the response from firebase is filled with extra data we don't need
    //         const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    //         //! doc.data() is a function to get collection data it seems
    //         //* No need yet. setUserAnswers(filteredData);
    //     }
    //     catch (err) {
    //         console.error(err);

    //     }
    // }

    //* No need yet. Need when implementing graphs or other based on user input
    // useEffect(() => {
    //     getUserAnswers();
    // }, [])
    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        try {
            await addDoc(surveyCollectionFromDb, {
                userName,
                softwareUseMins: softwareUseMins ?? 0,
                computerUseMins: computerMinutes ?? 0,
                selectedWorkEnviro: selectedWorkEnviro === 'somethingElse' ? selectedWorkOtherEnviro : selectedWorkEnviro,
                teamsUseMins: teamsUse.cameraMinutes ?? 0,
                selfCameraMins: teamsUse.cameraMinutes ?? 0
            });
            //* Get all user answers. No need yet. getUserAnswers();
        } catch (err) {
            console.error(err);
        }
        setIsSubmitPressed(true);
    };

    const logout = async () => {
        try {
            await signOut(auth);
            console.log("Log out success");
        } catch (err) {
            console.error(err);
        }
    };

    const handleTeamsUseChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        if (e.target.type === "number") {
            setTeamsUse({ ...teamsUse, [e.target.name]: e.target.value });
        }
        if (e.target.type === "checkbox") {
            const target = e.target as HTMLInputElement;
            setTeamsUse({ ...teamsUse, [e.target.name]: target.checked });
        }
    };

    function BasicTextFields() {
        return (
            <Box
                sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                    },
                    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white",
                    },
                    "& .MuiOutlinedInput-input": {
                        color: "white",
                    },
                    "&:hover .MuiOutlinedInput-input": {
                        color: "white",
                    },
                    "&:hover:not(.Mui-focused) .MuiOutlinedInput-input": {
                        color: "white",
                    },
                    "& .MuiInputLabel-root": {
                        color: "#ffffff",
                    },
                    "&:hover .MuiInputLabel-root": {
                        color: "#ffffff",
                    },
                    "&.Mui-focused .MuiInputLabel-root": {
                        color: "#ffffff",
                    },
                    "& .MuiSvgIcon-root": {
                        color: "#ffffff",
                    },
                }}
            >
                <h3>Kertoisitko kuka olet?</h3>
                <p>Nimimerkkikin on ok, kunhan se on joka kerta sama</p>
                <TextField
                    color="primary"
                    id="name"
                    label="Moi, olen.."
                    variant="outlined"
                    onChange={(e) => setUserName(e.target.value)}
                />

                <div className="box-question">
                    <h3>Käyttö yhteensä</h3>
                    <p>Arvioi montako minuuttia käytit konetta päivän aikana yhteensä. Puolen tunnin tarkkuus riittää.</p>
                    <TextField
                        type="number"
                        color="primary"
                        id="outlined-basic"
                        label="Koneella /min .."
                        variant="outlined"
                        onChange={(e) =>
                            setComputerMinutes(Number(e.target.value))}
                    />
                </div>

                <div className="box-question">
                    <h3>Videoneuvottelu -sovellusten käyttö</h3>
                    <p>
                        Tällä tarkoitetaan sovelluksia kuten Teams, Zoom, Google
                        Meet ja niin edelleen.
                    </p>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={teamsUse.didUseTeams}
                                    name="didUseTeams"
                                    onChange={(e) => handleTeamsUseChange(e)}
                                />
                            }
                            label="Jos käytit päivän aikana Teams:iä tai muuta, klikkaa tästä auki tarkemmat tiedot täytettäväksi."
                        />
                    </FormGroup>

                    {teamsUse.didUseTeams && (
                        <>
                            <div className="indent">
                                <div className="icon-text flex-container">
                                    <SubdirectoryArrowRightIcon fontSize="large" />
                                    <p>
                                        Arvioi montako minuuttia yhteensä koko
                                        päivänä? Puolen tunnin tarkkuus riittää.
                                        (Huom, nämä alemmat kentät ottavat
                                        vastaan vain numeroita)
                                    </p>
                                </div>
                                <div className="indent double">
                                    <TextField
                                        type="number"
                                        color="primary"
                                        id="outlined-basic"
                                        label="Teams käyttö /min .."
                                        variant="outlined"
                                        value={teamsUse.teamsMinutes}
                                        onChange={(e) =>
                                            handleTeamsUseChange(e)}
                                    />
                                    <div className="indent">
                                        <div className="icon-text flex-container">
                                            <SubdirectoryArrowRightIcon fontSize="large" />
                                            <p>
                                                Lisäkysymys liittyen Teamsin
                                                käyttöön. Oliko sinulla oma
                                                kamera päällä, tai jaoitko
                                                ruutuasi? Muistatko kuinka
                                                pitkään?
                                            </p>
                                        </div>
                                        <div className="indent double">
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={teamsUse
                                                            .teamsSelfCameraOn}
                                                        name="teamsSelfCameraOn"
                                                        onChange={(e) =>
                                                            handleTeamsUseChange(
                                                                e,
                                                            )}
                                                    />
                                                }
                                                label="Joo, käytin omaa kameraa tai jaoin ruutua. Napauta tästä laatikko auki täytettäväksi."
                                            />
                                        </div>
                                    </div>
                                    <div className="indent triple">
                                        {teamsUse.teamsSelfCameraOn && (
                                            <TextField
                                                type="number"
                                                color="primary"
                                                id="outlined-basic"
                                                name="cameraMinutes"
                                                label="Kamerani päällä /min.."
                                                variant="outlined"
                                                value={teamsUse.cameraMinutes}
                                                onChange={(e) =>
                                                    handleTeamsUseChange(e)}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className="box-question">
                    <h3>Käytitkö päivän aikana Wordia, Exceliä, Powerpointtia tai muuta ohjelmaa</h3>
                    <RadioButtonGroup
                        value={isSoftwareUse}
                        options={usedSoftwareOptions}
                        name={"usedSoftwareOptions"}
                        onChange={handleSoftwareUse}
                    />
                    {isSoftwareUse && (
                        <>
                            <div className="icon-text flex-container">
                                <SubdirectoryArrowRightIcon fontSize="large" />
                                <p>
                                    Muistatko kuinka monta minuuttia käytit yhteensä? Puolen tunnin tarkkuus riittää.
                                </p>
                            </div>
                            <div className="indent double">
                                <TextField
                                    value={softwareUseMins}
                                    type="number"
                                    label="Käytin /min .."
                                    variant="outlined"
                                    onChange={(e) =>
                                        setSoftwareUseMins(
                                            Number(e.target.value),
                                        )}
                                />
                            </div>
                        </>
                    )}
                </div>
                <div className="box-question">
                    <h3>Käytitkö ulkoista monitoria?</h3>
                    <RadioButtonGroup
                        value={isExternalMonitor}
                        options={externalMonitorOptions}
                        name={"externalMonitorOptions"}
                        onChange={handleExternalMonitorChange}
                    />

                    {isExternalMonitor && (
                        <>
                            <div className="icon-text flex-container">
                                <SubdirectoryArrowRightIcon fontSize="large" />

                                <p>
                                    Muistatko kuinka monta minuuttia se oli
                                    käytössäsi? Puolen tunnin tarkkuus riittää.
                                </p>
                            </div>
                            <div className="indent double">
                                <TextField
                                    type="number"
                                    label="Monitori oli käytössä /min .."
                                    variant="outlined"
                                    onChange={(e) =>
                                        setSelectedWorkOtherEnviro(
                                            e.target.value,
                                        )}
                                />
                            </div>
                        </>
                    )}
                </div>
                <div className="box-question">
                    <h3>Missä työskentelit?</h3>
                    <p>Oletko kotona tai ehkä toimistolla?</p>
                    <div>
                        {selectedWorkEnviro === "somethingElse"
                            ? (
                                <>
                                    <p>
                                        Valitsit joku muu. Missä se mahtaisi
                                        olla?
                                    </p>
                                    <TextField
                                        label="Kerro toki.."
                                        variant="outlined"
                                        onChange={(e) =>
                                            setSelectedWorkOtherEnviro(
                                                e.target.value,
                                            )}
                                    />
                                </>
                            )
                            : (
                                <Select
                                    value={selectedWorkEnviro}
                                    onChange={(e) =>
                                        setSelectedWorkEnviro(e.target.value)}
                                >
                                    <MenuItem value="Kotona">Kotona</MenuItem>
                                    <MenuItem value="Toimistolla">
                                        Toimistolla
                                    </MenuItem>
                                    <MenuItem value="somethingElse">
                                        Jokin muu, mikä?
                                    </MenuItem>
                                </Select>
                            )}
                    </div>
                </div>
                {
                    /* <div className="box-question">
                    <h3>Pidätkö selaimessasi päällä useita välilehtiä kerralla? </h3>
                    <p>Arvioi keskimääräistä välilehtien määrää selaimessasi.</p>
                    <RadioButtonGroup value={tabValue} options={tabAmountOptions} name={'tabOptions'} onChange={handleTabValueChange} />
                </div> */
                }

                {
                    /* <div className="box-question">
                    <h3>
                        Käytätkö konetta yleensä yhden asian tekemiseen
                        kerralla?
                    </h3>
                    <p>
                        Kysymyksen tarkoitus on kartoittaa, että pyöriikö Syklin
                        tyypeillä koneella yleensä taustaprosesseja. Yhden asian
                        tekeminen kerralla tässä tarkoittaa, että koneella on
                        auki ja aktiivisena vain se yksi ohjelma. Esimerkiksi
                        Word, ei muuta. Esimerkki 'monesta asiasta kerralla' on
                        vaikka musiikin kuuntelu selaimessa youtubesta ja samaan
                        aikaan kirjoittaminen Wordilla.
                    </p>
                    <RadioButtonGroup
                        value={multiUse}
                        options={multiUseOptions}
                        name={"multiUseOptions"}
                        onChange={handleMultiUseChange}
                    />
                </div> */
                }

                {/* <div className="box-question">
                    <h3>
                        Vapaa sana. Onko sinulla ajatuksia mitä haluaisit
                        tutkittavan kannettavan tietokoneen käytön tai
                        energiatehokkuuden suhteen?
                    </h3>
                    <TextField
                        style={{ width: "50%" }}
                        color="primary"
                        id="outlined-basic"
                        multiline
                        label="Vapaa sana.."
                        variant="outlined"
                        onChange={(e) => setFreeword(e.target.value)}
                    />
                </div> */}
            </Box>
        );
    }

    return (
        <>
            {!isSubmitPressed && (
                <form onSubmit={handleSubmit}>
                    {BasicTextFields()}
                    <button
                        style={{
                            backgroundColor: "#22936e",
                            color: "black",
                            padding: "0.5em 2em",
                            marginTop: "20px",
                        }}
                        type="submit"
                    >
                        Lähetä
                    </button>
                </form>
            )}
            {isSubmitPressed && (
                <div style={{ marginTop: "50px" }}>
                    <h4>
                        Kiitos vastauksista! Olet nyt tukenut näyttötyötäni joten lähetän sinulle hyviä vibraatiota <AutoAwesomeIcon fontSize="large" style={{color: 'burlywood', verticalAlign : 'middle'}} />
                    </h4>
                    {/* <button onClick={logout}>Kirjaudu ulos</button> */}
                </div>
            )}
        </>
    );
};

export default Questionnaire;
