import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { useRouter } from "next/navigation";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCgEkFXCd-e1-dqNlKlfRNNp3QytnIMlIs",
    authDomain: "eqiduct.firebaseapp.com",
    projectId: "eqiduct",
    storageBucket: "eqiduct.appspot.com",
    messagingSenderId: "941139133264",
    appId: "1:941139133264:web:9f3e5ccc5de43b9c2b6255"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const login = document.querySelector('.login') as HTMLButtonElement;

login.addEventListener('click', (e) => {
 e.preventDefault();
 const email = (document.querySelector('#email') as HTMLInputElement).value;
 const password = (document.querySelector('#password') as HTMLInputElement).value;
 loginUser({ email, password });
});

interface LoginUserParams {
 email: string;
 password: string;
}

async function loginUser({ email, password }: LoginUserParams) {
 try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const router = useRouter()
    router.push('/')
    console.log('You have successfully logged in!');

 } catch (e: any) {
    console.log(e.code);
    console.log(e.message);
    alert(e.message);
    console.log("say something nice")
 }
}
