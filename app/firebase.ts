import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { useRouter } from "next/navigation";
import firebase from 'firebase/app'
import 'firebase/auth'


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwCxS7DKRorA-_MbbN597CZfS0z7EU6Jk",
  authDomain: "equiduct-286bd.firebaseapp.com",
  projectId: "equiduct-286bd",
  storageBucket: "equiduct-286bd.appspot.com",
  messagingSenderId: "1060783137686",
  appId: "1:1060783137686:web:e064b9cbe74d500283f3b7"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
export { auth };

// const login = document.querySelector('.login') as HTMLButtonElement;

// login.addEventListener('click', (e) => {
//  e.preventDefault();
//  const email = (document.querySelector('#email') as HTMLInputElement).value;
//  const password = (document.querySelector('#password') as HTMLInputElement).value;
//  loginUser({ email, password });
// });

// interface LoginUserParams {
//  email: string;
//  password: string;
// }

// async function loginUser({ email, password }: LoginUserParams) {
//  try {
//     const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;
//     const router = useRouter()
//     router.push('/')
//     console.log('You have successfully logged in!');

//  } catch (e: any) {
//     console.log(e.code);
//     console.log(e.message);
//     alert(e.message);
//     console.log("say something nice")
//  }
// }
