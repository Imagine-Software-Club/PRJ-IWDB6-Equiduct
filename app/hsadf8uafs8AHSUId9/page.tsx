"use client";
import React from "react";
import styles from "./signup.module.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [passwordOne, setPasswordOne] = useState("");
  const router = useRouter();
  const [error, setError] = useState(null);
  const [name, setName] = useState("");

  function onSubmit() {
    createUserWithEmailAndPassword(auth, email, passwordOne)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        localStorage.setItem("username", userCredential.user.uid);
        console.log("it works!");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`not work ${errorMessage}`);
        // ..
      });
  }
  return (
    <>
      <nav className="flex justify-between border-b border-violet-100 p-4">
        <h1 className="font-bold text-2xl text-gray-700">Equiduct</h1>
      </nav>
      <div className="flex justify-center">
        <div className="bg-white w-3/5">
          <div className={styles.form_center}>
            <h1 className={styles.h1}>Sign up Tutor Dashboard</h1>
            <div className={styles.actual_form}>
              <div className={styles.column}>
                <label htmlFor="name" className={styles.small_font}>
                  Enter your name!
                </label>
                <input
                  onChange={(event) => setName(event.target.value)}
                  required
                  className={styles.input}
                  placeholder="email@email.com"
                  type="name"
                  name="name"
                  value={name}
                  id="name"
                />
                <label htmlFor="email" className={styles.small_font}>
                  Enter your tutor email address
                </label>
                <input
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className={styles.input}
                  placeholder="email@email.com"
                  type="email"
                  name="email"
                  value={email}
                  id="signUpEmail"
                />
              </div>

              <div className={styles.column}>
                <label htmlFor="password" className={styles.small_font}>
                  Enter your tutor password
                </label>
                <input
                  className={styles.input}
                  onChange={(event) => setPasswordOne(event.target.value)}
                  required
                  id="password-field"
                  type="password"
                  name="passwordOne"
                  value={passwordOne}
                  placeholder="••••••••••••"
                />
              </div>
              <div className={styles.middle}>
                <button
                  onClick={onSubmit}
                  className={styles.login}
                  id="login-form-submit"
                >
                  Signup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
