"use client";
import React from "react";
import { useState } from "react";
import Image from "next/image";
import equi_image from "./components/equiduct.jpeg";

export default function Onboarding() {
  // Define the color array with explicit types
  function chooseDiv() {
    const color = ["#3C9EE7", "#E7993C" ];

    // Use the document.querySelector method to get the div element
    const divElement: HTMLElement | null = document.querySelector("div");

    // Check if the div element exists before adding an event listener
    if (divElement) {
        divElement.addEventListener("mouseover", () => {
            // Ensure the div element exists before setting its style
            if (divElement) {
                divElement.style.background = color[Math.floor(Math.random() * color.length)];
            }
        });
  }
}
  return (
    <>
      <nav className="flex justify-between border-b p-4">
        <h1 className="font-bold text-2xl text-gray-700">Equiduct</h1>
      </nav>
      <div className="grid grid-cols-5 overflow-hidden">
        <div className="col-span-1 bg-zinc-200 h-dvh">
          <div className="p-3 bg-zinc-50 m-5 rounded-xl">
            <h2 className="text-lg">Please fill these background forms out:</h2>
            <p className="text-sky-600 m-3"><a href="https://madisondiocese.org/documents/2017/1/onlinelingo.pdf"download>Background Check #1</a></p>

            {/* the above link is just a random pdf that i have to replace */}
            <p className="text-sky-600 m-3"><a href="https://madisondiocese.org/documents/2017/1/onlinelingo.pdf"download>Background Check #2</a></p>
            {/* same with this one too*/}
            <p className="text-lg pt-5">Once you have filled out the background check forms, please email the completed forms to: <b>maddenlu@msu.edu</b></p>
            </div>
        </div>
        <div className="col-span-4">
          <div className="mt-6">
            <p className="p-3 text-6xl">Welcome!</p>
            <div className="pb-3">
              <div className="m-3 rounded-xl shadow-lg bg-zinc-100 pb-6">
                <p className="text-3xl p-3">
                  <b>Onboarding Requirements</b>
                </p>
                <div className="grid grid-cols-2 gap-1">
                  <div onClick={chooseDiv} className="flex justify-center items-center bg-zinc-200 h-32 text-center text-2xl">
                    Background Check 1
                  </div>
                  <div className="flex justify-center items-center bg-green-500 h-32 text-center text-2xl">
                    Complete
                  </div>
                  <div className="flex justify-center items-center bg-zinc-200 h-32 text-center text-2xl">
                    Tutor Training
                  </div>
                  <div className="flex justify-center items-center bg-green-500 h-32 text-center text-2xl">
                    Complete
                  </div>
                </div>
              </div>
            </div>
            <div className="m-3 rounded-xl shadow-lg bg-zinc-100">
              <p className="text-3xl p-3">
                <b>Links to Onboarding Files</b>
              </p>
              <div className="pl-20 pr-20 pb-20">
                <p className="text-xl p-4">Background Check 1</p>
                <p className="text-xl p-4"> Background Check 2</p>
                <p className="text-xl pl-4 pr-4 pt-4">Tutor Training</p>
                <p className="pl-4 pr-4 pt-1">
                  ALL Equiduct tutors must complete a tutor training seminar
                  before they are added to the schedule for their assigned
                  location. These seminars are 20-30 minute presentations
                  conducted over zoom at this link.
                </p>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </>
  );
}
