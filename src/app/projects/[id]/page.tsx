'use client'

import React, { useState } from 'react'
import ProjectHeader from '../ProjectHeader';
import BoardView from '../BoardView';
import ListView from '../ListView';
import TimelineView from '../TimelineView';
import TableView from '../TableView';
import ModalNewTask from '../ModalNewTask';

type Props = {
  params: { id: string }
}

const page = ({ params }: Props) => {
  const { id } = params;


  const [activeTab, setActiveTab] = useState("Board");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
  return (
    <div>
      {isModalNewTaskOpen && <ModalNewTask id={id} isOpen={isModalNewTaskOpen} onClose={() => setIsModalNewTaskOpen(false)} />}
      <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* Dynamically render tabs */}
      {
        activeTab === "Board" && (
          <BoardView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
        )
      }
      {
        activeTab === "List" && (
          <ListView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
        )
      }
      {
        activeTab === "TimeLine" && (
          <TimelineView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
        )
      }
      {
        activeTab === "Table" && (
          <TableView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
        )
      }
    </div>
  )
}

export default page