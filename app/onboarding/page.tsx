"use client";
import React from "react";
import Image from "next/image";
import equi_image from "./components/equiduct.jpeg";

export default function Onboarding() {
  return (
    <>
      <nav className="flex justify-between border-b p-4">
        <h1 className="font-bold text-2xl text-gray-700">Equiduct</h1>
      </nav>
      <div className="grid grid-cols-5 overflow-hidden">
        <div className="col-span-1 bg-zinc-200 h-dvh"></div>
        <div className="col-span-4">
          <div className="mt-6">
            <p className="p-3 text-6xl">Welcome!</p>
            <div className="pb-3">
              <div className="m-3 rounded-xl shadow-lg bg-zinc-100 pb-6">
                <p className="text-3xl p-3">
                  <b>Onboarding Requirements</b>
                </p>
                <div className="grid grid-cols-2 gap-1">
                  <div className="flex justify-center items-center bg-zinc-200 h-32 text-center text-2xl">
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
                  <div className="flex justify-center items-center bg-zinc-200 h-32 text-center text-2xl">
                    Complete
                  </div>
                  <div className="flex justify-center items-center bg-red-500 h-32 text-center text-2xl">
                    Incomplete
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
