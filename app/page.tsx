"use client";

import { useState, useEffect } from "react";

interface Service {
  id: number;
  name: string;
}

interface Barber {
  id: number;
  name: string;
}

export default function AppointmentPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [serviceId, setServiceId] = useState<number>();
  const [barberId, setBarberId] = useState<number>();
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    // Fetch services and barbers
    fetch("/api/appointments/options")
      .then((res) => res.json())
      .then((data) => {
        setServices(data.services);
        setBarbers(data.barbers);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceId || !barberId || !date) return alert("Fill all fields!");

    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceId, barberId, date }),
    });

    if (res.ok) {
      alert("Appointment created!");
      setServiceId(undefined);
      setBarberId(undefined);
      setDate("");
    } else {
      alert("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-500 p-4">
      <div className="max-w-md mx-auto bg-gray-100 p-4 border rounded shadow">
        <h1 className="text-xl font-bold mb-4">Book an Appointment</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label>
            Service:
            <select
              value={serviceId ?? ""}
              onChange={(e) => setServiceId(Number(e.target.value))}
              className="border p-2 w-full mt-1"
            >
              <option value="">Select a service</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Barber:
            <select
              value={barberId ?? ""}
              onChange={(e) => setBarberId(Number(e.target.value))}
              className="border p-2 w-full mt-1"
            >
              <option value="">Select a barber</option>
              {barbers.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Date & Time:
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border p-2 w-full mt-1"
            />
          </label>

          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Book Appointment
          </button>
        </form>
      </div>
    </div>
  );
}
