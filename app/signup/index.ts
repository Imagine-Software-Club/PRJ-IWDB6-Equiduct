import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, UserCredential } from "firebase/auth";
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

const signupBtn = document.querySelector('.signup-btn') as HTMLButtonElement;

signupBtn.addEventListener('click', (e) => {
 e.preventDefault();
 const email = (document.querySelector('#email') as HTMLInputElement).value;
 const password = (document.querySelector('#password') as HTMLInputElement).value;
 signUpUser({ email, password });
});

interface SignUpUserParams {
 email: string;
 password: string;
}

async function signUpUser({ email, password }: SignUpUserParams) {
 try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // const router = useRouter()
    // router.push('/')

    alert('You have successfully signed up!');
 } catch (e: any) {
    console.log(e.code);
    console.log(e.message);
    alert(e.message);
 }
}
