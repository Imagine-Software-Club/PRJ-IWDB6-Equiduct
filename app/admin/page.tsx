"use client";
import React from "react";
import equi_image from "../components/equiduct.jpeg";
import Image from "next/image";
import Calendar from "../components/calendar2";

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
          <br></br>
          <p>This is the signup page that you have to go to:</p>
          <p>
            <a
              className="text-sky-400"
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
        </div>
      </div>
    </>
  );
}
