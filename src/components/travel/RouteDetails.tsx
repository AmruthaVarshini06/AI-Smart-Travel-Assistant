"use client";

import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Plane,
  Train,
  Bus,
  Car,
  MapPin,
  Clock,
  CheckCircle2,
  CreditCard,
  CalendarX,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { showSuccess } from "@/utils/toast";

import InteractiveMap from "./InteractiveMap";

import { cn } from "@/lib/utils";

import {
  TravelRoute,
  TransportMode,
} from "@/lib/mock-data";

interface RouteDetailsProps {
  route: TravelRoute | null;
  isOpen: boolean;
  onClose: () => void;

  searchedSource?: string;
  searchedDest?: string;
  searchedDate?: string;

  showBooking?: boolean;
  isSatellite?: boolean;
}

const ModeIcon = ({
  mode,
}: {
  mode: TransportMode;
}) => {
  switch (mode) {
    case "flight":
      return (
        <Plane className="w-5 h-5 text-blue-500" />
      );

    case "train":
      return (
        <Train className="w-5 h-5 text-indigo-600" />
      );

    case "bus":
      return (
        <Bus className="w-5 h-5 text-amber-500" />
      );

    case "cab":
      return (
        <Car className="w-5 h-5 text-emerald-600" />
      );

    default:
      return (
        <MapPin className="w-5 h-5 text-slate-400" />
      );
  }
};

const RouteDetails = ({
  route,
  isOpen,
  onClose,
  searchedSource,
  searchedDest,
  searchedDate,
  showBooking = true,
  isSatellite = false,
}: RouteDetailsProps) => {
  if (!route) return null;

  const isPastDate = searchedDate
    ? new Date(searchedDate) <
      new Date(new Date().setHours(0, 0, 0, 0))
    : false;

  const handleBook = () => {
    const existingTrips = JSON.parse(
      localStorage.getItem("bookedTrips") || "[]"
    );

    const newTrip = {
      id: Date.now().toString(),

      destination:
        searchedDest ||
        route.segments[
          route.segments.length - 1
        ].to,

      source:
        searchedSource ||
        route.segments[0].from,

      date:
        searchedDate ||
        new Date().toISOString().split("T")[0],

      status: "Upcoming",

      mode:
        route.segments[0].mode
          .charAt(0)
          .toUpperCase() +
        route.segments[0].mode.slice(1),

      cost: `₹${route.totalCost.toLocaleString()}`,

      fullRoute: route,
    };

    localStorage.setItem(
      "bookedTrips",
      JSON.stringify([newTrip, ...existingTrips])
    );

    showSuccess("Trip booked successfully!");

    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent
        className="
          max-w-6xl
          bg-white
          border-slate-200
          text-slate-900
          rounded-[2.5rem]
          p-0
          overflow-hidden
          flex
          flex-col
          lg:flex-row
          h-[85vh]
          lg:h-[600px]
        "
      >
        {/* MAP SECTION */}
        <div
          className="
            lg:w-1/2
            h-[300px]
            lg:h-auto
            relative
            shrink-0
            border-b
            lg:border-b-0
            lg:border-r
            border-slate-100
          "
        >
          <InteractiveMap
            source={
              searchedSource ||
              route.segments[0].from
            }
            destination={
              searchedDest ||
              route.segments[
                route.segments.length - 1
              ].to
            }
            segments={route.segments}
            isSatellite={isSatellite}
          />
        </div>

        {/* DETAILS SECTION */}
        <div
          className="
            lg:w-1/2
            flex
            flex-col
            overflow-hidden
            bg-white
          "
        >
          <div
            className="
              p-8
              space-y-6
              overflow-y-auto
              custom-scrollbar
              flex-1
            "
          >
            <DialogHeader>
              <div className="flex items-center justify-between mb-2">
                <DialogTitle
                  className="
                    text-3xl
                    font-black
                    tracking-tight
                    text-slate-900
                  "
                >
                  Journey Details
                </DialogTitle>

                <span
                  className="
                    text-[10px]
                    font-black
                    bg-primary/10
                    text-primary
                    px-4
                    py-1.5
                    rounded-full
                    uppercase
                    tracking-[0.2em]
                  "
                >
                  {route.type}
                </span>
              </div>

              <DialogDescription className="text-slate-500 text-base">
                Itinerary from{" "}
                <span className="text-slate-900 font-bold">
                  {searchedSource ||
                    route.segments[0].from}
                </span>{" "}
                to{" "}
                <span className="text-slate-900 font-bold">
                  {searchedDest ||
                    route.segments[
                      route.segments.length - 1
                    ].to}
                </span>
              </DialogDescription>
            </DialogHeader>

            {/* SUMMARY */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className="
                  bg-slate-50
                  p-4
                  rounded-2xl
                  border
                  border-slate-100
                  text-center
                "
              >
                <p
                  className="
                    text-[9px]
                    font-black
                    text-slate-400
                    uppercase
                    tracking-widest
                    mb-1
                  "
                >
                  Total Time
                </p>

                <p className="text-lg font-black text-slate-900">
                  {Math.floor(
                    route.totalDuration / 60
                  )}
                  h{" "}
                  {Math.round(
                    route.totalDuration % 60
                  )}
                  m
                </p>
              </div>

              <div
                className="
                  bg-slate-50
                  p-4
                  rounded-2xl
                  border
                  border-slate-100
                  text-center
                "
              >
                <p
                  className="
                    text-[9px]
                    font-black
                    text-slate-400
                    uppercase
                    tracking-widest
                    mb-1
                  "
                >
                  Total Cost
                </p>

                <p className="text-lg font-black text-primary">
                  ₹{route.totalCost.toLocaleString()}
                </p>
              </div>
            </div>

            {/* SEGMENTS */}
            <div
              className="
                relative
                space-y-4
                before:absolute
                before:left-[23px]
                before:top-2
                before:bottom-2
                before:w-0.5
                before:bg-slate-100
              "
            >
              {route.segments.map(
                (segment, idx) => (
                  <div
                    key={idx}
                    className="
                      relative
                      pl-14
                      group
                    "
                  >
                    <div
                      className={cn(
                        `
                        absolute
                        left-0
                        top-0
                        w-12
                        h-12
                        rounded-2xl
                        bg-white
                        border-2
                        flex
                        items-center
                        justify-center
                        z-10
                        transition-colors
                        shadow-sm
                        `,
                        segment.mode ===
                          "flight"
                          ? "border-blue-100"
                          : segment.mode ===
                            "train"
                          ? "border-indigo-100"
                          : segment.mode ===
                            "cab"
                          ? "border-emerald-100"
                          : "border-slate-200"
                      )}
                    >
                      <ModeIcon
                        mode={segment.mode}
                      />
                    </div>

                    <div
                      className="
                        bg-slate-50/50
                        p-5
                        rounded-[2rem]
                        border
                        border-slate-100
                      "
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4
                            className="
                              font-black
                              text-base
                              capitalize
                              text-slate-900
                            "
                          >
                            {segment.mode}
                          </h4>

                          <p className="text-xs text-slate-500">
                            {segment.from} →{" "}
                            {segment.to}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-black text-lg text-primary">
                            ₹{segment.cost}
                          </p>
                        </div>
                      </div>

                      <div
                        className="
                          flex
                          items-center
                          gap-4
                          text-[10px]
                          font-black
                          text-slate-400
                          uppercase
                          tracking-wider
                        "
                      >
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-primary" />
                          {segment.departureTime} -{" "}
                          {segment.arrivalTime}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          On Time
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* FOOTER */}
          <DialogFooter
            className="
              p-8
              border-t
              border-slate-100
              bg-white
              shrink-0
            "
          >
            <Button
              variant="ghost"
              onClick={onClose}
              className="
                rounded-2xl
                text-slate-400
                font-bold
                px-6
              "
            >
              Close
            </Button>

            {showBooking &&
              (isPastDate ? (
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    text-amber-600
                    bg-amber-50
                    px-6
                    py-3
                    rounded-2xl
                    border
                    border-amber-100
                  "
                >
                  <CalendarX className="w-5 h-5" />

                  <span
                    className="
                      text-xs
                      font-black
                      uppercase
                      tracking-widest
                    "
                  >
                    Past Date
                  </span>
                </div>
              ) : (
                <Button
                  onClick={handleBook}
                  className="
                    rounded-2xl
                    px-10
                    h-14
                    gap-3
                    shadow-xl
                    shadow-primary/20
                    font-black
                    text-base
                  "
                >
                  <CreditCard className="w-5 h-5" />
                  Book Route
                </Button>
              ))}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RouteDetails;