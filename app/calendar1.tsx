"use client";
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
import { EventSourceInput } from "@fullcalendar/core/index.js";
import rrulePlugin from "@fullcalendar/rrule";
import { Calendar } from "@fullcalendar/core";
import { RRule } from "rrule";

interface Event {
  title: string;
  start: Date | string;
  end?: Date | string;
  allDay?: boolean;
  startRecur?: Date | string; // Start date of recurrence
  endRecur?: Date | string; // End date of recurrence
  daysOfWeek?: number[]; // For weekly recurrence
  startTime?: string; // Start time of the event
  endTime?: string; // End time of the event
  groupId?: string; // An identifier for events to be handled together as a group
  id: number;
}

export default function Home() {
  const [events, setEvents] = useState([
    { title: "event 1", id: "1" },
    { title: "event 2", id: "2" },
    { title: "event 3", id: "3" },
    { title: "event 4", id: "4" },
    { title: "event 5", id: "5" },
  ]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [newEvent, setNewEvent] = useState<Event>({
    title: "",
    start: "",
    allDay: false,
    id: 0,
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
    setNewEvent({
      title: "",
      start: "",
      allDay: false,
      id: 0,
    });
    setShowDeleteModal(false);
    setIdToDelete(null);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewEvent({
      ...newEvent,
      title: e.target.value,
    });
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

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

    // Set up start and end dates for recurrence
    // Set up recurrence rule
    let rruleConfig = {};
    if (repeatInterval === "days") {
      rruleConfig = {
        freq: RRule.DAILY,
        interval: customTime,
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
      };
    } else if (repeatInterval === "months") {
      // Example: Repeat on the 15th of every month
      rruleConfig = {
        freq: RRule.MONTHLY,
        bymonthday: parseInt(monthlyrepeatInterval),
        interval: customTime,
      };
    } else if (repeatInterval === "years") {
      // Example: Repeat on January 1st every year
      const [month, day] = yearlyrepeatInterval.split("-");
      rruleConfig = {
        freq: RRule.YEARLY,
        bymonth: parseInt(month),
        bymonthday: parseInt(day),
      };
    } else if (repeatInterval === "norepeat") {
      rruleConfig = {
        freq: RRule.YEARLY,
        dtstart: startDate,
        until: startDate,
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

    setAllEvents([...allEvents, ...recurringEvents]);

    // Reset form and close modal
    setShowModal(false);
    setNewEvent({
      title: "",
      start: "",
      end: "",
      allDay: false,
      id: 0,
    });
  }

  return (
    <>
      <nav className="flex justify-between mb-12 border-b border-violet-100 p-4">
        <h1 className="font-bold text-2xl text-gray-700">Calendar</h1>
      </nav>
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="grid grid-cols-10">
          <div className="col-span-8">
            <FullCalendar
              plugins={[
                dayGridPlugin,
                interactionPlugin,
                timeGridPlugin,
                rrulePlugin,
              ]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "resourceTimelineWook, dayGridMonth,timeGridWeek",
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
            />
          </div>
          <div
            id="draggable-el"
            className="ml-8 w-full border-2 p-2 rounded-md mt-16 lg:h-1/2 bg-violet-50"
          >
            <h1 className="font-bold text-lg text-center">Drag Event</h1>
            {events.map((event) => (
              <div
                className="fc-event border-2 p-1 m-2 w-full rounded-md ml-auto text-center bg-white"
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
                          Add Event
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
