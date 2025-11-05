"use client";

import { useState } from "react";
import BarberItem from "./components/barberItem";
import ServiceCategoryItem from "./components/serviceCategoryItem";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DroppableProvided,
  DraggableProvided,
} from "@hello-pangea/dnd";
import { useApp } from "../context/AppWrapper";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"serviceCategory" | "barbers">("serviceCategory");
  const { serviceCategories, newBarber, setNewBarber, serviceCategoryEdits, newServiceCategory, setNewServiceCategory, barbers, barberEdits, onDragEnd, handleAdd, isEditing } = useApp();

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("serviceCategory")}
          className={`p-2 border ${activeTab === "serviceCategory" ? "bg-blue-600 text-white" : ""}`}
        >
          Services
        </button>
        <button
          onClick={() => setActiveTab("barbers")}
          className={`p-2 border ${activeTab === "barbers" ? "bg-blue-600 text-white" : ""}`}
        >
          Barbers
        </button>
      </div>

      {activeTab === "serviceCategory" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Manage Service Categories</h2>
          <DragDropContext 
            onDragEnd={(result) => 
            onDragEnd(result, "serviceCategory" )}>
            <Droppable droppableId="serviceCategories">
              {(provided: DroppableProvided) => (
                <div
                  className="flex flex-col"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {serviceCategories.map((sc, index) => {
                    const editing = isEditing === sc.id;
                    const editValues = serviceCategoryEdits[sc.id] || { name: sc.name, services: sc.services };

                    return (
                      <Draggable key={sc.id} draggableId={sc.id.toString()} index={index}>
                        {(provided: DraggableProvided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-2"
                          >
                            <ServiceCategoryItem
                              serviceCategory={sc}
                              isEditing={editing}
                              editValues={editValues}
                            />
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <h3 className="mt-4 font-bold">Add Service Category</h3>
          <div className="flex flex-col gap-2 mt-2">
            <input type="text" placeholder="Name" value={newServiceCategory.name} onChange={e => setNewServiceCategory({...newServiceCategory, name:e.target.value})} className="border p-2"/>
            <button onClick={() => { handleAdd("serviceCategory",newServiceCategory); setNewServiceCategory({name:"", services:[]}) }} className="bg-green-600 text-white p-2 rounded">Add Service Category</button>
          </div>
        </div>
      )}

      {activeTab === "barbers" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Manage Barbers</h2>
          <DragDropContext onDragEnd={(result) => onDragEnd(result, "barbers")}>
            <Droppable droppableId="barbers">
              {(provided: DroppableProvided) => (
                <div
                  className="flex flex-col"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {barbers.map((b, index) => {
                    const editing = isEditing === b.id;
                    const editValues =
                      barberEdits[b.id] || { name: b.name, experience: b.experience, bio: b.bio };

                    return (
                      <Draggable key={b.id} draggableId={b.id.toString()} index={index}>
                        {(provided: DraggableProvided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-2"
                          >
                            <BarberItem
                              barber={b}
                              isEditing={editing}
                              editValues={editValues}
                            />
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <h3 className="mt-4 font-bold">Add Barber</h3>
          <div className="flex flex-col gap-2 mt-2">
            <input type="text" placeholder="Name" value={newBarber.name} onChange={e => setNewBarber({...newBarber, name:e.target.value})} className="border p-2"/>
            <input type="number" placeholder="Experience" value={newBarber.experience} onChange={e => setNewBarber({...newBarber, experience: Number(e.target.value)})} className="border p-2"/>
            <input type="text" placeholder="Bio" value={newBarber.bio} onChange={e => setNewBarber({...newBarber, bio: e.target.value})} className="border p-2"/>
            <button onClick={() => { 
              handleAdd("barbers", newBarber); setNewBarber({name:"",experience:0,bio:""}) }} className="bg-green-600 text-white p-2 rounded">Add Barber</button>
          </div>
        </div>
      )}
    </div>
  );
}
