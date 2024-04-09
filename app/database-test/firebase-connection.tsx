import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';
import { getFirestore, connectFirestoreEmulator, collection, getDocs, DocumentData, Timestamp } from "firebase/firestore";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { useRouter } from "next/navigation";
import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDjnqTDp6o4uep2yY-WWo-lWH0joKkIxyE",
    authDomain: "equiducttest.firebaseapp.com",
    projectId: "equiducttest",
    storageBucket: "equiducttest.appspot.com",
    messagingSenderId: "30081829745",
    appId: "1:30081829745:web:defffb0094f6e242ea04d0"
};

interface Event {
    title: string;
    start: Date | string;
    end: Date | string;
    allDay: boolean;
    startRecur?: Date | string; // Start date of recurrence
    endRecur?: Date | string; // End date of recurrence
    daysOfWeek?: number[]; // For weekly recurrence
    startHour: number;
    startMinute: number;
    startPeriod: string;
    endHour: number; // Add end hour variable
    endMinute: number; // Add end minute variable
    endPeriod: string; // Add end period variable
    groupId?: string; // An identifier for events to be handled together as a group
    id: number;
    type: string;
    state?: string;
}

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


//this is for the database

const db = getFirestore();
// connectFirestoreEmulator(db, '127.0.0.1', 8080);

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// setDoc(doc(db, "cities", "LA"), {
//     name: "Los Angeles",
//     state: "CA",
//     country: "USA"
// });
let name = 'event'
let cnt = 100

function getAllDocuments(): Promise<Event[]> {
    return new Promise((resolve, reject) => {
        const collectionRef = collection(db, 'events');
        const allEvents: Event[] = [];

        getDocs(collectionRef).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                cnt += 1;
                const eventData = doc.data() as Event; // Cast the document data to Event type

                let startDate: Date;
                if (eventData.start instanceof Timestamp) {
                    startDate = eventData.start.toDate();
                } else if (eventData.start instanceof Date) {
                    startDate = eventData.start;
                } else {
                    startDate = new Date(eventData.start);
                }

                const event: Event = {
                    ...eventData,
                    start: startDate
                };
                console.log("DEBUG!!!")
                console.log(event);
                allEvents.push(event);
            });
            resolve(allEvents);
        }).catch((error) => {
            reject(error);
        });
    });
}

function tmp_set1(event: any) {
    setDoc(doc(db, "events", name + cnt), event);
    cnt += 1;
}

function DBsetNewEvent(events: Event[]) {
    events.forEach(event => {
        setDoc(doc(db, "events", name + event.id), event);
    })
}

// const docRef = doc(db, "cities", "SF");
// const docSnap = await getDoc(docRef);

// if (docSnap.exists()) {
//   console.log("Document data:", docSnap.data());
// } else {
//   // docSnap.data() will be undefined in this case
//   console.log("No such document!");
// }

async function tmpGetAllEvents() {
    let i = 1;
    let allEvents = [];
    while (1) {
        let docRef = doc(db, "events", name + i);
        let docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            allEvents.push(docSnap.data())
            i += 1;
        }
        else {
            break;
        }
    }
    return allEvents;
}

// const event = {
//     start: [2018, 5, 30, 6, 30],
//     duration: { hours: 6, minutes: 30 },
//     title: 'Bolder Boulder',
//     description: 'Annual 10-kilometer run in Boulder, Colorado',
//     location: 'Folsom Field, University of Colorado (finish line)',
//     url: 'http://www.bolderboulder.com/',
//     geo: { lat: 40.0095, lon: 105.2669 },
//     categories: ['10k races', 'Memorial Day Weekend', 'Boulder CO'],
//     status: 'CONFIRMED',
//     busyStatus: 'BUSY',
//     organizer: { name: 'Admin', email: 'Race@BolderBOULDER.com' },
//     attendees: [
//       { name: 'Adam Gibbons', email: 'adam@example.com', rsvp: true, partstat: 'ACCEPTED', role: 'REQ-PARTICIPANT' },
//       { name: 'Brittany Seaton', email: 'brittany@example2.org', dir: 'https://linkedin.com/in/brittanyseaton', role: 'OPT-PARTICIPANT' }
//     ]
//   }


export { auth, db, tmp_set1, DBsetNewEvent, getAllDocuments }
