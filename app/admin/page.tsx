"use client";
import React, { useEffect, useState } from "react";
import equi_image from "../components/equiduct.jpeg";
import Image from "next/image";
import Calendar from "../components/calendar2";
import styles from "./admin.module.css";
import {
  auth,
  loadAndLogUserDocument,
} from "../database-test/firebase-connection";
/*
 CARDS - USER
  - WHAT TYPE
  - HOURS
  - EMAIL
  - ONBOARDING
*/

export default function Home() {
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (auth.currentUser != null) {
      loadAndLogUserDocument(auth.currentUser.uid).then((value) => {
        console.log(value);
        if (value != undefined) {
          setIsVerified(value.type == "admin");
        }
      });
    } else {
      setIsVerified(false);
      console.log("bruh");
    }
  }, []);

  return (
    <>
      <nav className="flex justify-between border-b p-4">
        <Image
          src={equi_image}
          width={200}
          height={10}
          alt="this is a picture"
        />
      </nav>
      <div className="grid grid-cols-5">
        <div className="col-span-1 bg-zinc-200 h-dvh">
          <p className="">This is the notifications</p>
          <p>Types of notifications</p>
          <br></br>
          <p>Add an event</p>
          <p>Delete an event</p>
          <p>"Edit an event"</p>
          <p>When a user signs up</p>
          <p></p>
          <br></br>
          <p>This is the signup page that you have to go to:</p>
          <p>
            <a
              className="text-sky-400"
              href="localhost:3000/hsadf8uafs8AHSUId9men"
            >
              <b>Go to SignUp page</b>
            </a>
          </p>
        </div>
        <div className="m-5 flex flex-row col-span-4">
          <div className="flex flex-wrap">
            <div className={styles.card}>
              <p>user name</p>
              <p>this is their email</p>
              <p>this is their onboarding</p>
            </div>
            <div className={styles.card}></div>
            <div className={styles.card}></div>
            <div className={styles.card}></div>
            <div className={styles.card}></div>
            <div className={styles.card}></div>
          </div>
        </div>
      </div>
    </>
  );
}
