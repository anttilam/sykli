// fetchFirestoreData.js
import admin from 'firebase-admin';
import { Parser } from 'json2csv';
import fs from 'fs';
import serviceAccount from './serviceAccountKey.json' assert {type: 'json'};
// import serviceAccount 
// const admin = require('firebase-admin');
// const { Parser } = require('json2csv');
// const fs = require('fs');

// Initialize Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const fetchFirestoreData = async () => {
    try {
        const snapshot = await db.collection('questionnaire').get();
        const data = snapshot.docs.map(doc => doc.data());

        const fields = ['computerHours', 'freeSpeech', 'isExternalMonitor', 'isMultiUse', 'tabAmount', 'userName', 'workEnviro'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(data);

        fs.writeFileSync('firestoreData.csv', csv);
        console.log('CSV file created successfully.');
    } catch (error) {
        console.error('Error fetching data from Firestore:', error);
    }
};

fetchFirestoreData();