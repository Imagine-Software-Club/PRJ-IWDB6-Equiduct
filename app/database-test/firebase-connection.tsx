import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import {
  getFirestore,
  connectFirestoreEmulator,
  collection,
  getDocs,
  DocumentData,
  Timestamp,
} from "firebase/firestore";

import { doc, setDoc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { useRouter } from "next/navigation";

import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCgEkFXCd-e1-dqNlKlfRNNp3QytnIMlIs",
  authDomain: "eqiduct.firebaseapp.com",
  projectId: "eqiduct",
  storageBucket: "eqiduct.appspot.com",
  messagingSenderId: "941139133264",
  appId: "1:941139133264:web:9f3e5ccc5de43b9c2b6255",
};

// Event obj structure
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
  id: string; // uuid
  type: string; // role
  state?: string; // pending | denied | accepted
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore();


// temporary role filtering
let temp_role = "Admin";
//let temp_role = 'Junior Achievement'
// Admin, Mentorship, Tutor, Junior Achievement, Select Role

// used for document id
let name = "event";

// get all documents from events collection
function getAllDocuments(): Promise<Event[]> {
  return new Promise((resolve, reject) => {
    const collectionRef = collection(db, "events");
    const allEvents: Event[] = [];

    getDocs(collectionRef)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const eventData = doc.data() as Event; // Cast the document data to Event type
          if (temp_role !== "Admin" && eventData.type !== temp_role) return;
        
          // Casting startDate data type to Date type
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
            start: startDate,
          };
          //console.log("DEBUG!!!")
          //console.log(event);
          allEvents.push(event);
        });
        resolve(allEvents);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// Set event
function DBsetNewEvent(events: Event[]) {
  events.forEach((event) => {
    setDoc(doc(db, "events", name + event.id), event);
  });
}

// Delete event
function deleteEvent(eventId: string): Promise<void> {
  eventId = name + eventId;
  return deleteDoc(doc(db, "events", eventId)).then(() => {
    console.log(`Event with ID ${eventId} deleted successfully.`);
  });
}

// update event
function updateEvent(
  eventId: string,
  updatedEvent: Partial<Event>
): Promise<void> {
  eventId = name + eventId;
  return updateDoc(doc(db, "events", eventId), updatedEvent)
    .then(() => {
      console.log(`Event with ID ${eventId} updated successfully.`);
    })
    .catch((error) => {
      console.error("Error updating event:", error);
      throw error; // Rethrow the error to propagate it to the caller
    });
}

export {
  auth,
  db,
  DBsetNewEvent,
  getAllDocuments,
  deleteEvent,
  updateEvent,
};
