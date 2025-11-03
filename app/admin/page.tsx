"use client";

import { useState, useEffect } from "react";
import BarberItem from "./components/barberItem";
import ServiceCategoryItem from "./components/serviceCategoryItem";

interface Service {
  id: number;
  name: string;
  price: number;
  durationMinutes: number;
  pending?: boolean;
}

interface ServiceCategory {
  id: number;
  name: string;
  services: Service[];
  pending?: boolean;
}

interface Barber {
  id: number;
  name: string;
  experience?: number;
  bio?: string;
  pending?: boolean;
}

type EditableBarber = Barber & {
  editName?: string;
  editExperience?: number;
  editBio?: string;
};

export default function AdminPage() {
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [barbers, setBarbers] = useState<EditableBarber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [activeTab, setActiveTab] = useState<"serviceCategory" | "barbers">("serviceCategory");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [barberEdits, setBarberEdits] = useState<{ [key: number]: { name: string; experience: number; bio: string } }>({});
  const [serviceEdits, setServiceEdits] = useState<{ [key: number]: { name: string; price: number; durationMinutes: number } }>({});
  const [serviceCategoryEdits, setServiceCategoryEdits] = useState<{ [key: number]: { name: string; services: Service[] } }>({});
  const fetchData = async () => {
    const resServices = await fetch("/api/serviceCategory");
    setServiceCategories(await resServices.json());
    const resBarbers = await fetch("/api/barbers");
    setBarbers(await resBarbers.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddOrEdit = async (
    type: "services" | "barbers" | "serviceCategory",
    data: any,
    id?: number
  ) => {
    const tempId = Date.now(); // temporary id for new items

    // Optimistic UI update
    if (!id) {
      const newItem = { ...data, id: tempId, pending: true, services: [] }; // pending for serviceCategory
      if (type === "serviceCategory") setServiceCategories(prev => [...prev, newItem]);
      else if (type === "services") setServices(prev => [...prev, { ...data, id: tempId, pending: true }]);
      else if (type === "barbers") setBarbers(prev => [...prev, { ...data, id: tempId, pending: true }]);
    } else {
      // Editing: update frontend immediately
      if (type === "serviceCategory") {
        setServiceCategories(prev =>
          prev.map(item => (item.id === id ? { ...item, ...data } : item))
        );
      } else if (type === "services") {
        setServices(prev =>
          prev.map(item => (item.id === id ? { ...item, ...data } : item))
        );
      } else if (type === "barbers") {
        setBarbers(prev =>
          prev.map(item => (item.id === id ? { ...item, ...data } : item))
        );
      }
    }

    // Check if the item still exists (wasn't deleted)
    let stillExists = true;
    if (!id) {
      if (type === "serviceCategory") stillExists = serviceCategories.some(item => item.id === tempId);
      else if (type === "services") stillExists = services.some(item => item.id === tempId);
      else if (type === "barbers") stillExists = barbers.some(item => item.id === tempId);

      if (!stillExists) return; // Skip API call if user deleted
    }

    // Call API
    const method = id ? "PUT" : "POST";
    const res = await fetch(`/api/${type}/${id ? `${id}` : ""}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      console.error("Failed to save item:", await res.text());
      return;
    }

    const result = await res.json();

    // Replace temporary ID with real ID from API if adding
    if (!id) {
      if (type === "serviceCategory") {
        setServiceCategories(prev =>
          prev.map(item => (item.id === tempId ? result : item))
        );
      } else if (type === "services") {
        setServices(prev => prev.map(item => (item.id === tempId ? result : item)));
      } else if (type === "barbers") {
        setBarbers(prev => prev.map(item => (item.id === tempId ? result : item)));
      }
    }
  };

  const handleDelete = async (
    type: "services" | "barbers" | "serviceCategory",
    id: number
  ) => {
    // Remove from frontend immediately
    if (type === "serviceCategory") setServiceCategories(prev => prev.filter(sc => sc.id !== id));
    else if (type === "services") setServices(prev => prev.filter(s => s.id !== id));
    else if (type === "barbers") setBarbers(prev => prev.filter(b => b.id !== id));

    // Only call API if item is not pending
    let itemPending = false;

    if (type === "serviceCategory") {
      itemPending = !!serviceCategories.find(sc => sc.id === id)?.pending;
    } else if (type === "services") {
      itemPending = !!services.find(s => s.id === id)?.pending;
    } else if (type === "barbers") {
      itemPending = !!barbers.find(b => b.id === id)?.pending;
    }

    if (itemPending) return; // Skip API call

    await fetch(`/api/${type}/${id}`, { method: "DELETE" });
  };

  // --- Forms ---
  const [newBarber, setNewBarber] = useState({ name: "", experience: 0, bio: "" });
  const [newServiceCategory, setNewServiceCategory] = useState({ name: "", services: [] });
  const [newService, setNewService] = useState({ name: "", price: 0, durationMinutes: 0 });

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
          <ul className="flex flex-col gap-2">
            {serviceCategories.map((sc) => {
              const isEditing = editingId === sc.id;
              const editValues = serviceCategoryEdits[sc.id] || { name: sc.name, services: sc.services };

              return (
                <ServiceCategoryItem
                  key={sc.id}
                  serviceCategory={sc}
                  isEditing={isEditing}
                  editValues={editValues}
                  serviceCategoryEdits={serviceCategoryEdits}
                  setServiceCategoryEdits={setServiceCategoryEdits}
                  setEditingId={setEditingId}
                  handleAddOrEdit={handleAddOrEdit}
                  handleDelete={handleDelete}
                  fetchData={fetchData}
                />
              );
            })}
          </ul>
          <h3 className="mt-4 font-bold">Add Service Category</h3>
          <div className="flex flex-col gap-2 mt-2">
            <input type="text" placeholder="Name" value={newServiceCategory.name} onChange={e => setNewServiceCategory({...newServiceCategory, name:e.target.value})} className="border p-2"/>
            <button onClick={() => { handleAddOrEdit("serviceCategory", newServiceCategory); setNewServiceCategory({name:"", services:[]}) }} className="bg-green-600 text-white p-2 rounded">Add Service Category</button>
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
            <button onClick={() => { handleAddOrEdit("barbers", newBarber); setNewBarber({name:"",experience:0,bio:""}) }} className="bg-green-600 text-white p-2 rounded">Add Barber</button>
          </div>
        </div>
      )}
    </div>
  );
}
