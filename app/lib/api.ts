// lib/api.ts
import { DropResult } from "@hello-pangea/dnd";
import { Dispatch, SetStateAction } from "react";
import { ServiceCategory, Service, Barber } from "../types";

interface AddingIds {
  serviceCategory: number[];
  services: number[];
  barbers: number[];
}

export const handleAdd = async (
  type: "services" | "barbers" | "serviceCategory",
  data: any,
  serviceCategories: ServiceCategory[],
  setServiceCategories: Dispatch<SetStateAction<ServiceCategory[]>>,
  services: Service[],
  setServices: Dispatch<SetStateAction<Service[]>>,
  barbers: Barber[],
  setBarbers: Dispatch<SetStateAction<Barber[]>>,
  setAddingIds: Dispatch<SetStateAction<AddingIds>>
) => {
  const tempId = Date.now();

  // Determine position
  let position = 0;
  if (type === "serviceCategory") position = serviceCategories.length;
  else if (type === "services") position = services.length;
  else if (type === "barbers") position = barbers.length;

  const newItem = { ...data, id: tempId, position };

  // Disable delete button
  setAddingIds(prev => ({
    ...prev,
    [type]: [...prev[type], tempId],
  }));

  // Optimistic UI
  if (type === "serviceCategory") setServiceCategories(prev => [...prev, { ...newItem, services: [] }]);
  else if (type === "services") setServices(prev => [...prev, newItem]);
  else if (type === "barbers") setBarbers(prev => [...prev, newItem]);

  try {
    const res = await fetch(`/api/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });

    if (!res.ok) {
      console.error("Failed to add item:", await res.text());
      return;
    }

    const result = await res.json();

    // Replace temp item with real one
    if (type === "serviceCategory") {
      setServiceCategories(prev => prev.map(item => (item.id === tempId ? result : item)));
    } else if (type === "services") {
      setServices(prev => prev.map(item => (item.id === tempId ? result : item)));
    } else if (type === "barbers") {
      setBarbers(prev => prev.map(item => (item.id === tempId ? result : item)));
    }
  } catch (err) {
    console.error("Error adding item:", err);
  } finally {
    // Re-enable delete
    setAddingIds(prev => ({
      ...prev,
      [type]: prev[type].filter(id => id !== tempId),
    }));
  }
};

export const handleEdit = async (
  type: "services" | "barbers" | "serviceCategory",
  data: any,
  id: number,
  setServiceCategories: Dispatch<SetStateAction<ServiceCategory[]>>,
  setServices: Dispatch<SetStateAction<Service[]>>,
  setBarbers: Dispatch<SetStateAction<Barber[]>>
) => {
  // Optimistic UI
  if (type === "serviceCategory") setServiceCategories(prev => prev.map(item => (item.id === id ? { ...item, ...data } : item)));
  else if (type === "services") setServices(prev => prev.map(item => (item.id === id ? { ...item, ...data } : item)));
  else if (type === "barbers") setBarbers(prev => prev.map(item => (item.id === id ? { ...item, ...data } : item)));

  // API call
  try {
    const res = await fetch(`/api/${type}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) console.error("Failed to edit item:", await res.text());
  } catch (err) {
    console.error("Error editing item:", err);
  }
};

export const handleDelete = async (
  type: "services" | "barbers" | "serviceCategory",
  id: number,
  setServiceCategories: Dispatch<SetStateAction<ServiceCategory[]>>,
  setServices: Dispatch<SetStateAction<Service[]>>,
  setBarbers: Dispatch<SetStateAction<Barber[]>>
) => {
  // Remove from frontend
  if (type === "serviceCategory") setServiceCategories(prev => prev.filter(sc => sc.id !== id));
  else if (type === "services") setServices(prev => prev.filter(s => s.id !== id));
  else if (type === "barbers") setBarbers(prev => prev.filter(b => b.id !== id));

  try {
    await fetch(`/api/${type}/${id}`, { method: "DELETE" });
  } catch (err) {
    console.error("Error deleting item:", err);
  }
};

export const onDragEnd = async (
  result: DropResult,
  tableName: "serviceCategory" | "services" | "barber",
  serviceCategories: ServiceCategory[],
  setServiceCategories: Dispatch<SetStateAction<ServiceCategory[]>>,
  services: Service[],
  setServices: Dispatch<SetStateAction<Service[]>>,
  barbers: Barber[],
  setBarbers: Dispatch<SetStateAction<Barber[]>>
) => {
  const { source, destination } = result;
  if (!destination) return;

  // Determine state
  let items: any[] = [];
  let setItems: (items: any[]) => void = () => {};

  switch (tableName) {
    case "serviceCategory":
      items = [...serviceCategories];
      setItems = setServiceCategories;
      break;
    case "services":
      items = [...services];
      setItems = setServices;
      break;
    case "barber":
      items = [...barbers];
      setItems = setBarbers;
      break;
    default:
      console.warn("Unknown table for drag:", tableName);
      return;
  }

  items = items.filter(item => item && item.id !== undefined);

  const originalItems = [...items];

  const [movedItem] = items.splice(source.index, 1);
  items.splice(destination.index, 0, movedItem);

  setItems(items);

  const positions = items.map((item, index) => ({ id: item.id, position: index }));

  try {
    const res = await fetch("/api/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table: tableName, positions }),
    });

    if (!res.ok) throw new Error(`Failed to update ${tableName} positions on server`);
  } catch (err) {
    console.error(err);
    setItems(originalItems);
  }
};
