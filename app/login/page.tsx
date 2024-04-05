"use client";
import React from "react";
import styles from "./login.module.css";
import { useEffect } from "react";
import { useState } from "react";

export default function Contact() {
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
            <form method="post" action="/" className={styles.actual_form}>
              <div className={styles.column}>
                <label htmlFor="email" className={styles.small_font}>
                  Enter your tutor email address
                </label>
                <input
                  required
                  className={styles.input}
                  placeholder="email@email.com"
                  type="email"
                  name="email"
                  id="username-field"
                />
              </div>

              <div className={styles.column}>
                <label htmlFor="password" className={styles.small_font}>
                  Enter your tutor password
                </label>
                <input
                  className={styles.input}
                  required
                  id="password-field"
                  type="password"
                  name="password"
                  placeholder="••••••••••••"
                />
              </div>
              <div className={styles.middle}>
                <button
                  className={styles.login}
                  value="login"
                  id="login-form-submit"
                  type="submit"
                >
                  Login
                </button>
              </div>
            </form>
            <a href="/signup"> Don't have an account? Signup.</a>
          </div>
        </div>
      </div>
    </>
  );
}
