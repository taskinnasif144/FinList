import React from "react";
import ReusablePriorityPage from "../reusablePriorityPage";
import { Priority } from "@/State/types";


const Urgent = () => {
  return <ReusablePriorityPage priority={Priority.Backlog} />;
};

export default Urgent;