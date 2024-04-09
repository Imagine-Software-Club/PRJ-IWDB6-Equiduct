"use client";
import React from "react";
import equi_image from "../components/equiduct.jpeg";
import Image from "next/image";
import Calendar from "../components/calendar2";
<<<<<<< Updated upstream
=======
import styles from "./admin.module.css";
/*
 CARDS - USER
  - WHAT TYPE
  - HOURS
  - EMAIL
  - ONBOARDING
*/
>>>>>>> Stashed changes

export default function Home() {
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
<<<<<<< Updated upstream
=======
          <p>Types of notifications</p>
          <br></br>
          <p>Add an event</p>
          <p>Delete an event</p>
          <p>"Edit an event"</p>
          <p>When a user signs up</p>
          <p></p>
>>>>>>> Stashed changes
          <br></br>
          <p>This is the signup page that you have to go to:</p>
          <p>
            <a
              className="text-sky-400"
              href="localhost:3000/hsadf8uafs8AHSUId9"
            >
<<<<<<< Updated upstream
              <b>localhost:3000/hsadf8uafs8AHSUId9</b>
            </a>
          </p>
        </div>
        <div className="col-span-4 h-dvh">
          <p>This is where the main calendar is going to be</p>
          <p>
            Underneath this is where there is going to be the hours log which I
            don't know if I can do right now
          </p>
=======
              <b>Go to SignUp page</b>
            </a>
          </p>
        </div>
        <div className="m-5 flex flex-row col-span-4">
          <div className="flex flex-wrap">
            <div className={styles.card}></div>
            <div className={styles.card}></div>
            <div className={styles.card}></div>
            <div className={styles.card}></div>
            <div className={styles.card}></div>
            <div className={styles.card}></div>
          </div>
>>>>>>> Stashed changes
        </div>
      </div>
    </>
  );
}
