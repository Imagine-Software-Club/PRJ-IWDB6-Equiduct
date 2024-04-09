"use client";
import React from "react";
import styles from "./login.module.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "../database-test/firebase-connection";
import { signInWithEmailAndPassword } from "@firebase/auth";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [passwordOne, setPasswordOne] = useState("");
  const router = useRouter();
  const [error, setError] = useState(null);

  function logSubmit() {
    signInWithEmailAndPassword(auth, email, passwordOne)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
        console.log("you do login");
        window.location.href = "/onboarding";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("doesn't work");
      });
  }
  return (
    <>
      <script src="./login.ts" type="module"></script>
      <nav className="flex justify-between border-b border-violet-100 p-4">
        <h1 className="font-bold text-2xl text-gray-700">Equiduct</h1>
      </nav>
      <div className="flex justify-center">
        <div className="bg-white w-3/5">
          <div className={styles.form_center}>
            <h1 className={styles.h1}>Log in to Tutor Dashboard</h1>
            <div className={styles.actual_form}>
              <div className={styles.column}>
                <label htmlFor="email" className={styles.small_font}>
                  Enter your tutor email address
                </label>
                <input
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className={styles.input}
                  value={email}
                  placeholder="email@email.com"
                  type="email"
                  name="email"
                />
              </div>

              <div className={styles.column}>
                <label htmlFor="password" className={styles.small_font}>
                  Enter your tutor password
                </label>
                <input
                  onChange={(event) => setPasswordOne(event.target.value)}
                  className={styles.input}
                  required
                  type="password"
                  name="password"
                  value={passwordOne}
                  placeholder="••••••••••••"
                />
              </div>
              <div className={styles.middle}>
                <button
                  className={styles.login}
                  id="submit"
                  onClick={logSubmit}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
