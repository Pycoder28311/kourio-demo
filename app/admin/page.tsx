"use client";

import { useState, useEffect } from "react";
import BarberItem from "./components/barberItem";

interface Service {
  id: number;
  name: string;
  price: number;
  durationMinutes: number;
}

interface Barber {
  id: number;
  name: string;
  experience?: number;
  bio?: string;
}

type EditableBarber = Barber & {
  editName?: string;
  editExperience?: number;
  editBio?: string;
};

export default function AdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<EditableBarber[]>([]);
  const [activeTab, setActiveTab] = useState<"services" | "barbers">("services");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [barberEdits, setBarberEdits] = useState<{ [key: number]: { name: string; experience: number; bio: string } }>({});

  const fetchData = async () => {
    const resServices = await fetch("/api/services");
    setServices(await resServices.json());
    const resBarbers = await fetch("/api/barbers");
    setBarbers(await resBarbers.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- CRUD Handlers ---
  const handleDelete = async (type: "service" | "barber", id: number) => {
    await fetch(`/api/${type}s/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleAddOrEdit = async (
    type: "service" | "barber",
    data: any,
    id?: number
  ) => {
    const method = id ? "PUT" : "POST";
    await fetch(`/api/${type}s${id ? `/${id}` : ""}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    fetchData();
  };

  // --- Forms ---
  const [newService, setNewService] = useState({ name: "", price: 0, durationMinutes: 0 });
  const [newBarber, setNewBarber] = useState({ name: "", experience: 0, bio: "" });

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("services")}
          className={`p-2 border ${activeTab === "services" ? "bg-blue-600 text-white" : ""}`}
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

      {activeTab === "services" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Manage Services</h2>
          <ul>
            {services.map((s) => (
              <li key={s.id} className="flex justify-between mb-2 border p-2 rounded">
                <span>{s.name} - ${s.price} ({s.durationMinutes} min)</span>
                <div className="flex gap-2">
                  <button onClick={() => handleDelete("service", s.id)} className="bg-red-600 text-white p-1 rounded">Delete</button>
                </div>
              </li>
            ))}
          </ul>
          <h3 className="mt-4 font-bold">Add Service</h3>
          <div className="flex flex-col gap-2 mt-2">
            <input type="text" placeholder="Name" value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} className="border p-2" />
            <input type="number" placeholder="Price" value={newService.price} onChange={e => setNewService({...newService, price: Number(e.target.value)})} className="border p-2" />
            <input type="number" placeholder="Duration Minutes" value={newService.durationMinutes} onChange={e => setNewService({...newService, durationMinutes: Number(e.target.value)})} className="border p-2" />
            <button onClick={() => { handleAddOrEdit("service", newService); setNewService({name:"",price:0,durationMinutes:0}) }} className="bg-green-600 text-white p-2 rounded">Add Service</button>
          </div>
        </div>
      )}

      {activeTab === "barbers" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Manage Barbers</h2>
          <ul className="flex flex-col gap-2">
            {barbers.map((b) => {
              const isEditing = editingId === b.id;
              const editValues = barberEdits[b.id] || { name: b.name, experience: b.experience, bio: b.bio };

              return (
                <BarberItem
                  key={b.id}
                  barber={b}
                  isEditing={isEditing}
                  editValues={editValues}
                  barberEdits={barberEdits}
                  setBarberEdits={setBarberEdits}
                  setEditingId={setEditingId}
                  handleAddOrEdit={handleAddOrEdit}
                  handleDelete={handleDelete}
                  fetchData={fetchData}
                />
              );
            })}
          </ul>
          <h3 className="mt-4 font-bold">Add Barber</h3>
          <div className="flex flex-col gap-2 mt-2">
            <input type="text" placeholder="Name" value={newBarber.name} onChange={e => setNewBarber({...newBarber, name:e.target.value})} className="border p-2"/>
            <input type="number" placeholder="Experience" value={newBarber.experience} onChange={e => setNewBarber({...newBarber, experience: Number(e.target.value)})} className="border p-2"/>
            <input type="text" placeholder="Bio" value={newBarber.bio} onChange={e => setNewBarber({...newBarber, bio: e.target.value})} className="border p-2"/>
            <button onClick={() => { handleAddOrEdit("barber", newBarber); setNewBarber({name:"",experience:0,bio:""}) }} className="bg-green-600 text-white p-2 rounded">Add Barber</button>
          </div>
        </div>
      )}
    </div>
  );
}
