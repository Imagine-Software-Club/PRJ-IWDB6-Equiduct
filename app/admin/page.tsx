"use client";
import React from "react";
import equi_image from "../components/equiduct.jpeg";
import Image from "next/image";
import Calendar from "../components/calendar2";

import styles from "./admin.module.css";
/*
 CARDS - USER
  - WHAT TYPE
  - HOURS
  - EMAIL
  - ONBOARDING
*/

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
          <div className={styles.smallCard}>
            <p className={styles.p}>Holiday Weekend</p>
            <button className={styles.accept}>Accept</button>
            <button className={styles.deny}>Deny</button>
          </div>
          <div className={styles.smallCard}>
            <p className={styles.p}>Holiday Weekend</p>
            <button className={styles.accept}>Accept</button>
            <button className={styles.deny}>Deny</button>
          </div>
          <div className={styles.smallCard}>
            <p className={styles.p}>Holiday Weekend</p>
            <button className={styles.accept}>Accept</button>
            <button className={styles.deny}>Deny</button>
          </div>
          <div className={styles.smallCard}>
            <p className={styles.p}>Holiday Weekend</p>
            <button className={styles.accept}>Accept</button>
            <button className={styles.deny}>Deny</button>
          </div>
          <div className={styles.smallCard}>
            <p className={styles.p}>Holiday Weekend</p>
            <button className={styles.accept}>Accept</button>
            <button className={styles.deny}>Deny</button>
          </div>
          <div className={styles.smallCard}>
            <p className={styles.p}>Holiday Weekend</p>
            <button className={styles.accept}>Accept</button>
            <button className={styles.deny}>Deny</button>
          </div>
          <div className={styles.smallCard}>
            <p className={styles.p}>Holiday Weekend</p>
            <button className={styles.accept}>Accept</button>
            <button className={styles.deny}>Deny</button>
          </div>
          <div className={styles.smallCard}>
            <p className={styles.p}>Holiday Weekend</p>
            <button className={styles.accept}>Accept</button>
            <button className={styles.deny}>Deny</button>
          </div>
          <div className={styles.smallCard}>
            <p className={styles.p}>Holiday Weekend</p>
            <button className={styles.accept}>Accept</button>
            <button className={styles.deny}>Deny</button>
          </div>
          <p>
            <a
              className="m-5 text-sky-400"
              href="localhost:3000/hsadf8uafs8AHSUId9"
            >
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
          <p>
            <a>
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
        </div>
      </div>
    </>
  );
}
