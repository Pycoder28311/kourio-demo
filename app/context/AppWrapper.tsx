// context/AppProvider.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { DropResult } from "@hello-pangea/dnd";
import { ServiceCategory, Service, Barber } from "../types";
import { handleAdd as addFn, handleEdit as editFn, handleDelete as deleteFn, onDragEnd as dragFn } from "../lib/api";

interface AddingIds {
  serviceCategory: number[];
  services: number[];
  barbers: number[];
}

interface AppContextProps {
  serviceCategories: ServiceCategory[];
  setServiceCategories: React.Dispatch<React.SetStateAction<ServiceCategory[]>>;
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  barbers: Barber[];
  setBarbers: React.Dispatch<React.SetStateAction<Barber[]>>;

  addingIds: AddingIds;
  setAddingIds: React.Dispatch<React.SetStateAction<AddingIds>>;

  barberEdits: { [key: number]: { name: string; experience: number; bio: string } };
  setBarberEdits: React.Dispatch<React.SetStateAction<{ [key: number]: { name: string; experience: number; bio: string } }>>;

  serviceCategoryEdits: { [key: number]: { name: string; services: Service[] } };
  setServiceCategoryEdits: React.Dispatch<React.SetStateAction<{ [key: number]: { name: string; services: Service[] } }>>;

  serviceEdits: { [key: number]: { name: string; price: number; durationMinutes: number } };
  setServiceEdits: React.Dispatch<React.SetStateAction<{ [key: number]: { name: string; price: number; durationMinutes: number } }>>;

  newBarber: { name: string; experience: number; bio: string };
  setNewBarber: React.Dispatch<React.SetStateAction<{ name: string; experience: number; bio: string }>>;

  newServiceCategory: { name: string; services: Service[] };
  setNewServiceCategory: React.Dispatch<React.SetStateAction<{ name: string; services: Service[] }>>;

  newService: { name: string; price: number; durationMinutes: number };
  setNewService: React.Dispatch<React.SetStateAction<{ name: string; price: number; durationMinutes: number }>>;

  handleAdd: (type: "services" | "barbers" | "serviceCategory", data: any) => Promise<void>;
  handleEdit: (type: "services" | "barbers" | "serviceCategory", data: any, id: number) => Promise<void>;
  handleDelete: (type: "services" | "barbers" | "serviceCategory", id: number) => Promise<void>;
  onDragEnd: (result: DropResult, tableName: "serviceCategory" | "services" | "barber") => Promise<void>;

  isEditing: number | null;
  setIsEditing: React.Dispatch<React.SetStateAction<number | null>>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isEditing, setIsEditing] = useState<number | null>(null); // track the currently editing item id

  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);

  const [barberEdits, setBarberEdits] = useState<{ [key: number]: { name: string; experience: number; bio: string } }>({});
  const [serviceCategoryEdits, setServiceCategoryEdits] = useState<{ [key: number]: { name: string; services: Service[] } }>({});
  const [serviceEdits, setServiceEdits] = useState<{ [key: number]: { name: string; price: number; durationMinutes: number } }>({});

  const [newBarber, setNewBarber] = useState({ name: "", experience: 0, bio: "" });
  const [newServiceCategory, setNewServiceCategory] = useState<{ name: string; services: Service[] }>({
    name: "",
    services: [],
    });
  const [newService, setNewService] = useState<{ name: string; price: number; durationMinutes: number }>({
    name: "",
    price: 0,
    durationMinutes: 0,
  });

  const [addingIds, setAddingIds] = useState<AddingIds>({
    serviceCategory: [],
    services: [],
    barbers: [],
  });

  const fetchData = async () => {
    const resServices = await fetch("/api/serviceCategory");
    setServiceCategories(await resServices.json());
    const resBarbers = await fetch("/api/barbers");
    setBarbers(await resBarbers.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = (type: "services" | "barbers" | "serviceCategory", data: any) =>
    addFn(type, data, serviceCategories, setServiceCategories, services, setServices, barbers, setBarbers, setAddingIds);

  const handleEdit = (type: "services" | "barbers" | "serviceCategory", data: any, id: number) =>
    editFn(type, data, id, setServiceCategories, setServices, setBarbers);

  const handleDelete = (type: "services" | "barbers" | "serviceCategory", id: number) =>
    deleteFn(type, id, setServiceCategories, setServices, setBarbers);

  const onDragEnd = (result: DropResult, tableName: "serviceCategory" | "services" | "barber") =>
    dragFn(result, tableName, serviceCategories, setServiceCategories, services, setServices, barbers, setBarbers);

  return (
    <AppContext.Provider
      value={{
        serviceCategories,
        setServiceCategories,
        services,
        setServices,
        barbers,
        setBarbers,
        addingIds,
        setAddingIds,
        barberEdits,
        setBarberEdits,
        serviceCategoryEdits,
        setServiceCategoryEdits,
        serviceEdits,
        setServiceEdits,
        newBarber,
        setNewBarber,
        newServiceCategory,
        setNewServiceCategory,
        newService,
        setNewService,
        handleAdd,
        handleEdit,
        handleDelete,
        onDragEnd,
        isEditing,
        setIsEditing,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
