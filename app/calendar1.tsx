"use client";
import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {
  Draggable,
  DropArg,
} from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon, ExclamationTriangleIcon } from "@heroicons/react/20/solid";

import { EventDropArg, EventSourceInput } from "@fullcalendar/core/index.js";
import rrulePlugin from "@fullcalendar/rrule";
import { Calendar } from "@fullcalendar/core";
import { RRule } from "rrule";
<<<<<<< Updated upstream
import equi_image from "./components/equiduct.jpeg";
import lansing_image from "./components/lansing_school_district.png";
import Image from "next/image";
import { CalendarResponse, parseICS } from "node-ical";
import listPlugin from "@fullcalendar/list";
=======
import listPlugin from "@fullcalendar/list";
import {
  db,
  getAllDocuments,
  DBsetNewEvent,
} from "./database-test/firebase-connection";
import equi_image from "./components/equiduct.jpeg";
import lansing_image from "./components/lansing_school_district.png";
import Image from "next/image";
import { doc, deleteDoc } from "firebase/firestore";

// import { CalendarResponse, parseICS } from "node-ical";
>>>>>>> Stashed changes

interface Event {
  title: string;
  start: Date | string;
  end: Date | string;
  allDay: boolean;
  startRecur?: Date | string; // Start date of recurrence
  endRecur?: Date | string; // End date of recurrence
  daysOfWeek?: number[]; // For weekly recurrence
  startHour: number;
  startMinute: number;
  startPeriod: string;
  endHour: number; // Add end hour variable
  endMinute: number; // Add end minute variable
  endPeriod: string; // Add end period variable
  groupId?: string; // An identifier for events to be handled together as a group
  id: number;
  type: string;
}

export default function Home() {
  const [events, setEvents] = useState([]);
  /* const [events, setEvents] = useState([
    { title: "event 1", id: "1" },
    { title: "event 2", id: "2" },
    { title: "event 3", id: "3" },
    { title: "event 4", id: "4" },
    { title: "event 5", id: "5" },
  ]); */
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [newEvent, setNewEvent] = useState<Event>({
    title: "",
    start: "",
    end: "",
    startHour: 0,
    startMinute: 0,
    startPeriod: "AM",
    endHour: 0,
    endMinute: 0,
    endPeriod: "AM",
    allDay: false,
    id: 0,
    type: "",
  });

  useEffect(() => {
    let draggableEl = document.getElementById("draggable-el");
    if (draggableEl) {
      new Draggable(draggableEl, {
        itemSelector: ".fc-event",
        eventData: function (eventEl) {
          let title = eventEl.getAttribute("title");
          let id = eventEl.getAttribute("data");
          let start = eventEl.getAttribute("start");
          return { title, id, start };
        },
      });
    }
  }, []);

  function handleDateClick(arg: { date: Date; allDay: boolean }) {
    setNewEvent({
      ...newEvent,
      start: arg.date,
      allDay: arg.allDay,
      id: new Date().getTime(),
    });
    setShowModal(true);
  }

  function handleEventClick(data: { event: { id: string } }) {
    const clickedEventId = Number(data.event.id);
    const clickedEvent = allEvents.find(
      (event) => Number(event.id) === clickedEventId
    );

    if (clickedEvent) {
      setNewEvent({
        title: clickedEvent.title,
        start: clickedEvent.start,
        end: clickedEvent.end,
        allDay: clickedEvent.allDay,
        id: clickedEvent.id,
        //type: clickedEvent.type,
        startHour: clickedEvent.startHour, // Initialize start hour variable
        startMinute: clickedEvent.startMinute, // Initialize start minute variable
        startPeriod: clickedEvent.startPeriod, // Initialize start period variable
        endHour: clickedEvent.endHour, // Initialize start hour variable
        endMinute: clickedEvent.endMinute, // Initialize start minute variable
        endPeriod: clickedEvent.endPeriod, // Initialize start period variable
        type: clickedEvent.type,
      });
      setShowModal(true);
    } else {
      console.error("Clicked event not found in allEvents array");
    }
  }

  function addEvent(data: DropArg) {
    const clickedDate = data.date;
    const rrule = new RRule({
      freq: RRule.WEEKLY,
      byweekday: [RRule.SU, RRule.TU], // Example: Repeat on Sundays and Tuesdays
      dtstart: clickedDate, // Start date of the recurring event
      until: new Date("2024-12-31"), // End date of the recurring event
    });

    const occurrences = rrule.all();
    const recurringEvents: Event[] = occurrences.map((date) => ({
      ...newEvent,
      start: date,
      title: data.draggedEl.innerText,
      groupId: "recurring-events",
      id: new Date().getTime(),
    }));

    setAllEvents([...allEvents, ...recurringEvents]);
  }

  function handleEventDrop(info: EventDropArg) {
    const { event } = info;

    // Check for the presence of event.start to satisfy TypeScript's strict null checks.
    // Default to the current date if event.start is somehow null, though in practice it should always be set.
    const startDate = event.start || new Date();

    const updatedEvents = allEvents.map((existingEvent) => {
      if (Number(existingEvent.id) === Number(event.id)) {
        // Assume event.end might also be null and handle accordingly.
        let newEnd = event.end || new Date(startDate.getTime()); // Use startDate's time if end is null.

        // If the existing event has an end date, calculate the duration and apply it to the new start date.
        if (existingEvent.end && startDate) {
          const duration =
            new Date(existingEvent.end).getTime() -
            new Date(existingEvent.start).getTime();
          newEnd = new Date(startDate.getTime() + duration);
        }

        return {
          ...existingEvent,
          start: startDate, // This is guaranteed to be a Date object.
          end: newEnd, // This is also guaranteed to be a Date object.
        };
      }
      return existingEvent;
    });

    setAllEvents(updatedEvents);
  }

  function handleDeleteModal(data: { event: { id: string } }) {
    setShowDeleteModal(true);
    setIdToDelete(Number(data.event.id));
  }

  function handleDelete() {
    setAllEvents(
      allEvents.filter((event) => Number(event.id) !== Number(idToDelete))
    );
    setShowDeleteModal(false);
    setIdToDelete(null);
  }

  function handleCloseModal() {
    setShowModal(false);
    setShowDeleteModal(false);
    setNewEvent({
      title: "",
      start: "",
      end: "",
      startHour: 0,
      startMinute: 0,
      startPeriod: "AM",
      endHour: 0,
      endMinute: 0,
      endPeriod: "AM",
      allDay: false,
      id: 0,
      type: "",
    });
    //setShowDeleteModal(false);
    setIdToDelete(null);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, checked } = e.target;
    setNewEvent((prevState) => ({
      ...prevState,
      [name]: name === "allDay" ? checked : value,
    }));
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Get the selected hour, minute, and period values from the dropdowns
    const selectedHour = newEvent.startHour;
    const selectedMinute = newEvent.startMinute;
    const selectedPeriod = newEvent.startPeriod;

    //get the event type -> Mentorship, Junior Achievement, Tutor, Admin
    const eventType = newEvent.type;

    // Adjustments inside handleSubmit function
    let endHour =
      newEvent.endPeriod === "PM" ? newEvent.endHour + 12 : newEvent.endHour;
    endHour = endHour === 12 && newEvent.endPeriod === "AM" ? 0 : endHour;
    const endDate = new Date(newEvent.end);
    endDate.setHours(endHour, newEvent.endMinute);

    // Convert the selected hour to 24-hour format if it's in PM
    let hour = selectedPeriod === "PM" ? selectedHour + 12 : selectedHour;
    // Adjust hour if it's 12 AM (midnight)
    hour = hour === 12 && selectedPeriod === "AM" ? 0 : hour;

    // Create a new Date object with the selected date and time
    const selectedDate = new Date(newEvent.start);
    selectedDate.setHours(hour, selectedMinute);

    // Extract form data...
    const repeatIntervalElement =
      e.currentTarget.elements.namedItem("repeatInterval");
    let repeatInterval = "";
    if (repeatIntervalElement instanceof HTMLSelectElement) {
      repeatInterval = repeatIntervalElement.value;
    }

    const customTimeElement = e.currentTarget.elements.namedItem("customTime");
    const customTime = Number((customTimeElement as HTMLInputElement)?.value);

    const dayrepeatIntervalElement =
      e.currentTarget.elements.namedItem("dayrepeatInterval");
    const dayrepeatInterval = Number(
      (dayrepeatIntervalElement as HTMLInputElement)?.value
    );

    const weekdayrepeatIntervalElement = e.currentTarget.elements.namedItem(
      "weekdayrepeatInterval"
    );
    const weekdayrepeatInterval = (
      weekdayrepeatIntervalElement as HTMLInputElement
    )?.value;

    const monthlyrepeatIntervalElement = e.currentTarget.elements.namedItem(
      "monthlyrepeatInterval"
    );
    const monthlyrepeatInterval = (
      monthlyrepeatIntervalElement as HTMLInputElement
    )?.value;

    const yearlyrepeatIntervalElement = e.currentTarget.elements.namedItem(
      "yearlyrepeatInterval"
    );
    const yearlyrepeatInterval = (
      yearlyrepeatIntervalElement as HTMLInputElement
    )?.value;

    const eventDescriptionElement =
      e.currentTarget.elements.namedItem("eventDescription");
    const eventDescription = (eventDescriptionElement as HTMLInputElement)
      ?.value;

    // Now you have all the form data, you can use it as needed.
    console.log("Repeat Interval:", repeatInterval);
    console.log("Custom Time:", customTime);
    //console.log("Number of Repeats:", numRepeats);
    console.log("Day Repeat Interval:", dayrepeatInterval);
    console.log("Weekday Repeat Interval:", weekdayrepeatInterval);
    console.log("Monthly Repeat Interval:", monthlyrepeatInterval);
    console.log("Yearly Repeat Interval:", yearlyrepeatInterval);
    console.log("Event Description:", eventDescription);
    //console.log(numRepeats);

    const startDate = new Date(newEvent.start);
    startDate.setHours(selectedHour, selectedMinute);

    // Set up start and end dates for recurrence
    // Set up recurrence rule
    let rruleConfig = {};
    if (repeatInterval === "days") {
      rruleConfig = {
        freq: RRule.DAILY,
        interval: customTime,
        dtstart: startDate,
        until: endDate,
      };
    } else if (repeatInterval === "weeks") {
      // Example: Repeat on selected days of the week
      const selectedDays: number[] = [];
      const checkboxes = e.currentTarget.querySelectorAll<HTMLInputElement>(
        'input[name="weekdayrepeatInterval"]:checked'
      );
      checkboxes.forEach((checkbox: HTMLInputElement) => {
        selectedDays.push(parseInt(checkbox.value));
      });

      rruleConfig = {
        freq: RRule.WEEKLY,
        byweekday: selectedDays,
        interval: customTime,
        dtstart: startDate,
        until: endDate,
      };
    } else if (repeatInterval === "months") {
      // Example: Repeat on the 15th of every month
      rruleConfig = {
        freq: RRule.MONTHLY,
        bymonthday: parseInt(monthlyrepeatInterval),
        interval: customTime,
        dtstart: startDate,
        until: endDate,
      };
    } else if (repeatInterval === "years") {
      // Example: Repeat on January 1st every year
      const [month, day] = yearlyrepeatInterval.split("-");
      rruleConfig = {
        freq: RRule.YEARLY,
        bymonth: parseInt(month),
        bymonthday: parseInt(day),
        dtstart: startDate,
        until: endDate,
      };
    } else if (repeatInterval === "norepeat") {
      rruleConfig = {
        freq: RRule.YEARLY,
        dtstart: startDate,
        until: endDate,
        count: 1,
      };
    }

    const rrule = new RRule({
      ...rruleConfig,
      dtstart: startDate, // Start date of the recurring event
      until: new Date("2024-12-31"), // End date of the recurring event
    });

    const occurrences = rrule.all();
    const recurringEvents: Event[] = occurrences.map((date, index) => ({
      ...newEvent,
      title: newEvent.title,
      start: date,
      groupId: "recurring-events",
      id: new Date().getTime() + index,
    }));

    /*
    // Check if the new event already exists in allEvents
    const existingEventIndex = allEvents.findIndex(
      (event) => Number(event.id) === Number(newEvent.id)
    );

    if (existingEventIndex !== -1) {
      // If it exists, update the existing event in allEvents
      const updatedEvents = [...allEvents];
      updatedEvents[existingEventIndex] = {
        ...newEvent,
        start: selectedDate,
        end: endDate,
      };
      setAllEvents(updatedEvents);
    } else {
      // If it doesn't exist, add the new event to allEvents
      setAllEvents([
        ...allEvents,
        { ...newEvent, start: selectedDate, end: endDate },
      ]);
    }
    */
    setAllEvents([...allEvents, ...recurringEvents]);

    // Reset form and close modal
    setShowModal(false);
    setNewEvent({
      title: "",
      start: "",
      end: "",
      startHour: 0,
      startMinute: 0,
      startPeriod: "AM",
      endHour: 0,
      endMinute: 0,
      endPeriod: "AM",
      allDay: false,
      id: 0,
      type: "",
    });
  }

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
        <div className="col-span-1 bg-zinc-200">
          <p className="p-3">
            It is the responsibility of each mentor to coordinate events with
            their mentees. Once mentors have discussed plans with their mentee,
            they are expected to email Kristy Haggerty,
            <b>ecacclansing@gmail.com</b>, with their plans and the projected
            costs for the event 48 hours prior to the date of the event.{" "}
          </p>
          <p className="p-3">
            Once Kristy approves the event, you may coordinate the event with
            your mentee. Please keep or photograph receipts from mentorship
            events. We encourage you to take photographs during these events.
            After each event, please send all photos of the event and all
            receipts to Kristy for reimbursement. Reimbursement is handled by
            ECAC via checks that can be picked up from Kristy at ECAC.
          </p>
          <p className="p-3">
            An admin will approve your event after you have added/edited an
            event
          </p>
          <p className="text-2xl text-center pt-20">Your Tutoring Location</p>
          <div className="h-1 bg-violet-300"></div>
          {/* <Image
            className="pt-24"
            src={lansing_image}
            width={400}
            height={20}
          /> */}
          <p className=" p-2">Lansing Student Development Program</p>
          <p className=" p-2 pt-3">
            Tutoring every Monday-Thursday at 3:30pm-5:30pm
          </p>
          <p className=" p-2 pt-3">Located at the Dan Johnson Field House</p>
          <p className="text-cyan-500 pl-2 pr-2">220 N Pennsylvania Ave</p>
          <p className="text-cyan-500 pl-2 pr-2">Lansing, MI 48912</p>
          <p className="text-cyan-500 pl-2 pr-2">United States</p>
          <p className=" pl-2 pr-2 pt-5">Program Director: Johnathon Horford</p>
          <p className="text-cyan-500 pl-2 pr-2">johnathonhorford@gmail.com</p>
        </div>
        <div className="col-span-4">
          <div className="p-10 bg-neutral-100 m-5 rounded-3xl">
            <FullCalendar
              plugins={[
                dayGridPlugin,
                interactionPlugin,
                timeGridPlugin,
                rrulePlugin,
                listPlugin,
              ]}
              headerToolbar={{
                left: "title prev next",
                center: "",
                right: "dayGridMonth,timeGridWeek listMonth",
              }}
              events={allEvents as EventSourceInput}
              nowIndicator={true}
              editable={true}
              droppable={true}
              selectable={true}
              selectMirror={true}
              dateClick={handleDateClick}
              drop={(data) => addEvent(data)}
              eventClick={(data) => handleDeleteModal(data)}
              eventDrop={handleEventDrop}
              initialView="dayGridMonth"
<<<<<<< Updated upstream
              height="110vh"
=======
              height="120vh"
>>>>>>> Stashed changes
            />
          </div>
          <div
            id="draggable-el"
            className="ml-8 w-full border-2 p-2 rounded-md mt-16 lg:h-1/2 bg-violet-50"
          >
            <h1 className="font-bold text-lg text-center">Drag Event</h1>
            {events.map((event) => (
              <div
                className="fc-event border-2 w-full rounded-md ml-auto text-center bg-white"
                title={event.title}
                key={event.id}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>

        <Transition.Root show={showDeleteModal} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={setShowDeleteModal}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel
                    className="relative transform overflow-hidden rounded-lg
                   bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
                  >
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div
                          className="mx-auto flex h-12 w-12 flex-shrink-0 items-center 
                      justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
                        >
                          <ExclamationTriangleIcon
                            className="h-6 w-6 text-red-600"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <Dialog.Title
                            as="h3"
                            className="text-base font-semibold leading-6 text-gray-900"
                          >
                            Delete Event
                          </Dialog.Title>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Are you sure you want to delete this event?
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm 
                      font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                        onClick={handleDelete}
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 
                      shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={handleCloseModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
        <Transition.Root show={showModal} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setShowModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                    <div>
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <CheckIcon
                          className="h-6 w-6 text-green-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:mt-5">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          {newEvent.title ? "Edit Event" : "Add Event"}
                        </Dialog.Title>
                        <form action="submit" onSubmit={handleSubmit}>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="title"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 
                            shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                            focus:ring-2 
                            focus:ring-inset focus:ring-violet-600 
                            sm:text-sm sm:leading-6"
                              value={newEvent.title}
                              onChange={(e) => handleChange(e)}
                              placeholder="Title"
                            />
                          </div>
                          <div className="mt-2">
                            <select
                              name="eventType"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 
              shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
              focus:ring-2 
              focus:ring-inset focus:ring-violet-600 
              sm:text-sm sm:leading-6"
                              value={newEvent.type}
                              onChange={(e) =>
                                setNewEvent({
                                  ...newEvent,
                                  type: e.target.value,
                                })
                              }
                            >
                              <option value="">Select Role</option>
                              <option value="Mentorship">Mentorship</option>
                              <option value="Junior Achievement">
                                Junior Achievement
                              </option>
                              <option value="Tutor">Tutor</option>
                              <option value="Admin">Admin</option>
                            </select>
                          </div>
                          <div className="mt-2 grid grid-cols-3 gap-3"></div>

                          {/* First new dropdown box */}
                          <div className="mt-2">
                            <select
                              name="dropdown1"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 
    shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
    focus:ring-2 
    focus:ring-inset focus:ring-violet-600 
    sm:text-sm sm:leading-6"
                              // Add necessary value and onChange handlers
                              value={newEvent.startHour} // Set value to reflect the state
                              onChange={(e) =>
                                setNewEvent({
                                  ...newEvent,
                                  startHour: parseInt(e.target.value),
                                })
                              }
                            >
                              <option>Start Hour</option>
                              {/* Add options for the dropdown */}
                              {[...Array(11)].map((_, index) => (
                                <option key={index + 1} value={index + 1}>
                                  {index + 1}
                                </option>
                              ))}
                              <option value={0}>12</option>
                            </select>
                          </div>
                          {/* Second new dropdown box */}
                          <div className="mt-2">
                            <select
                              name="dropdown2"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 
              shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
              focus:ring-2 
              focus:ring-inset focus:ring-violet-600 
              sm:text-sm sm:leading-6"
                              // Add necessary value and onChange handlers
                              value={newEvent.startMinute} // Set value to reflect the state
                              onChange={(e) =>
                                setNewEvent({
                                  ...newEvent,
                                  startMinute: parseInt(e.target.value),
                                })
                              }
                            >
                              <option>Start Minute</option>
                              {/* Add options for the dropdown */}
                              {[...Array(60)].map((_, index) => (
                                <option key={index} value={index}>
                                  {index < 10 ? `0${index}` : `${index}`}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="mt-2">
                            <select
                              name="dropdown1"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 
              shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
              focus:ring-2 
              focus:ring-inset focus:ring-violet-600 
              sm:text-sm sm:leading-6"
                              // Add necessary value and onChange handlers
                              value={newEvent.startPeriod} // Set value to reflect the state
                              onChange={(e) =>
                                setNewEvent({
                                  ...newEvent,
                                  startPeriod: e.target.value,
                                })
                              }
                            >
                              <option value="">Start Period</option>
                              {/* Add options for the dropdown */}
                              <option value="AM">AM</option>
                              <option value="PM">PM</option>
                            </select>
                          </div>

                          <div className="mt-2 grid grid-cols-3 gap-3">
                            {/* First new dropdown box */}
                            <div className="mt-2">
                              <select
                                name="dropdown1"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 
              shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
              focus:ring-2 
              focus:ring-inset focus:ring-violet-600 
              sm:text-sm sm:leading-6"
                                // Add necessary value and onChange handlers
                                value={newEvent.endHour} // Set value to reflect the state
                                onChange={(e) =>
                                  setNewEvent({
                                    ...newEvent,
                                    endHour: parseInt(e.target.value),
                                  })
                                }
                              >
                                <option>End Hour</option>
                                {/* Add options for the dropdown */}
                                {[...Array(11)].map((_, index) => (
                                  <option key={index + 1} value={index + 1}>
                                    {index + 1}
                                  </option>
                                ))}
                                <option value={0}>12</option>
                              </select>
                            </div>
                            {/* Second new dropdown box */}
                            <div className="mt-2">
                              <select
                                name="dropdown2"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 
                            shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                            focus:ring-2 
                            focus:ring-inset focus:ring-violet-600 
                            sm:text-sm sm:leading-6"
                                // Add necessary value and onChange handlers
                                value={newEvent.endMinute} // Set value to reflect the state
                                onChange={(e) =>
                                  setNewEvent({
                                    ...newEvent,
                                    endMinute: parseInt(e.target.value),
                                  })
                                }
                              >
                                <option>End Minute</option>
                                {/* Add options for the dropdown */}
                                {[...Array(60)].map((_, index) => (
                                  <option key={index} value={index}>
                                    {index < 10 ? `0${index}` : `${index}`}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="mt-2">
                              <select
                                name="dropdown1"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 
                            shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                            focus:ring-2 
                            focus:ring-inset focus:ring-violet-600 
                            sm:text-sm sm:leading-6"
                                // Add necessary value and onChange handlers
                                value={newEvent.endPeriod} // Set value to reflect the state
                                onChange={(e) =>
                                  setNewEvent({
                                    ...newEvent,
                                    endPeriod: e.target.value,
                                  })
                                }
                              >
                                <option value="">End Period</option>
                                {/* Add options for the dropdown */}
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                              </select>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center">
                            <input
                              type="checkbox"
                              id="allDay"
                              name="allDay"
                              className="rounded text-violet-600 focus:ring-violet-500 h-4 w-4"
                              checked={newEvent.allDay}
                              onChange={handleChange}
                            />
                            <label
                              htmlFor="allDay"
                              className="ml-2 text-sm text-gray-700"
                            >
                              All Day
                            </label>
                          </div>
                          <div className="mt-2">
                            <label htmlFor="repeatInterval">
                              Repeat Every:
                            </label>
                            <select id="repeatInterval" name="repeatInterval">
                              <option value="norepeat">NoRepeat</option>
                              <option value="days">Days</option>
                              <option value="weeks">Weeks</option>
                              <option value="months">Months</option>
                              <option value="years">Years</option>
                            </select>
                          </div>
                          <div className="mt-2">
                            <label htmlFor="dayrepeatInterval">
                              Repeat Every (Days):
                            </label>
                            <input
                              type="number"
                              id="dayrepeatInterval"
                              name="dayrepeatInterval"
                            />
                          </div>

                          <div className="mt-2" id="weekdayrepeatInterval">
                            <label>Repeat Every (Days):</label>
                            <br />
                            <input
                              type="checkbox"
                              name="weekdayrepeatInterval"
                              value="0"
                            />
                            <label htmlFor="dayMonday">Monday</label>
                            <br />
                            <input
                              type="checkbox"
                              name="weekdayrepeatInterval"
                              value="1"
                            />
                            <label htmlFor="dayTuesday">Tuesday</label>
                            <br />
                            <input
                              type="checkbox"
                              name="weekdayrepeatInterval"
                              value="2"
                            />
                            <label htmlFor="dayWednesday">Wednesday</label>
                            <br />
                            <input
                              type="checkbox"
                              name="weekdayrepeatInterval"
                              value="3"
                            />
                            <label htmlFor="dayThursday">Thursday</label>
                            <br />
                            <input
                              type="checkbox"
                              name="weekdayrepeatInterval"
                              value="4"
                            />
                            <label htmlFor="dayFriday">Friday</label>
                            <br />
                            <input
                              type="checkbox"
                              name="weekdayrepeatInterval"
                              value="5"
                            />
                            <label htmlFor="daySaturday">Saturday</label>
                            <br />
                            <input
                              type="checkbox"
                              name="weekdayrepeatInterval"
                              value="6"
                            />
                            <label htmlFor="daySunday">Sunday</label>
                            <br />
                          </div>

                          <div className="mt-2">
                            <label htmlFor="monthlyrepeatInterval">
                              Repeat Every (Months):
                            </label>
                            <input
                              type="text"
                              id="monthlyrepeatInterval"
                              name="monthlyrepeatInterval"
                            />
                          </div>
                          <div className="mt-2">
                            <label htmlFor="yearlyrepeatInterval">
                              Repeat Every (Years):
                            </label>
                            <input
                              type="text"
                              id="yearlyrepeatInterval"
                              name="yearlyrepeatInterval"
                            />
                          </div>
                          <div className="mt-2">
                            <label htmlFor="customTime">
                              Repeat Number Interval:
                            </label>
                            <input
                              type="number"
                              id="customTime"
                              name="customTime"
                              min="1"
                            />
                          </div>
                          <div className="mt-2">
                            <label htmlFor="eventDescription">
                              Description:
                            </label>
                            <input
                              type="text"
                              id="eventDescription"
                              name="eventDescription"
                            />
                          </div>
                          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                            <button
                              type="submit"
                              className="inline-flex w-full justify-center rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:col-start-2 disabled:opacity-25"
                              disabled={newEvent.title === ""}
                            >
                              Create
                            </button>
                            <button
                              type="button"
                              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                              onClick={handleCloseModal}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </>
  );
}
