import React from "react";

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

type BarberItemProps = {
  barber: EditableBarber;
  isEditing: boolean;
  editValues: { name: string; experience: number; bio: string };
  barberEdits: { [key: number]: { name: string; experience: number; bio: string } };
  setBarberEdits: React.Dispatch<React.SetStateAction<{ [key: number]: { name: string; experience: number; bio: string } }>>;
  setEditingId: React.Dispatch<React.SetStateAction<number | null>>;
  handleAddOrEdit: (type: "barber", data: any, id?: number) => Promise<void>;
  handleDelete: (type: "barber", id: number) => void;
  fetchData: () => void;
};

const BarberItem: React.FC<BarberItemProps> = ({
  barber,
  isEditing,
  editValues,
  barberEdits,
  setBarberEdits,
  setEditingId,
  handleAddOrEdit,
  handleDelete,
  fetchData
}) => {
  return (
    <li className="border p-2 rounded flex flex-col md:flex-row md:justify-between md:items-center gap-2">
      
      {/* Barber Info or Editable Inputs */}
      <div className="flex flex-col md:flex-row md:gap-2 w-full">
        {isEditing ? (
          <>
            <input
              type="text"
              value={editValues.name}
              onChange={e =>
                setBarberEdits({ ...barberEdits, [barber.id]: { ...editValues, name: e.target.value } })
              }
              className="border p-2 w-full md:w-40"
            />
            <input
              type="number"
              value={editValues.experience}
              onChange={e =>
                setBarberEdits({ ...barberEdits, [barber.id]: { ...editValues, experience: Number(e.target.value) } })
              }
              className="border p-2 w-full md:w-32"
            />
            <input
              type="text"
              value={editValues.bio}
              onChange={e =>
                setBarberEdits({ ...barberEdits, [barber.id]: { ...editValues, bio: e.target.value } })
              }
              className="border p-2 w-full md:w-64"
            />
          </>
        ) : (
          <>
            <p className="w-full md:w-40">{barber.name}</p>
            <p className="w-full md:w-32">{barber.experience} yrs</p>
            <p className="w-full md:w-64">{barber.bio}</p>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-2 md:mt-0">
        {isEditing ? (
          <>
            <button
              onClick={async () => {
                await handleAddOrEdit("barber", editValues, barber.id);
                setEditingId(null);
                fetchData();
              }}
              className="bg-blue-600 text-white p-1 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditingId(null)}
              className="bg-gray-400 text-white p-1 rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setEditingId(barber.id);
                setBarberEdits({
                  ...barberEdits,
                  [barber.id]: {
                    name: barber.name ?? "",
                    experience: barber.experience ?? 0,
                    bio: barber.bio ?? ""
                  }
                });
              }}
              className="bg-yellow-500 text-white p-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete("barber", barber.id)}
              className="bg-red-600 text-white p-1 rounded"
            >
              Delete
            </button>
          </>
        )}
      </div>

    </li>
  );
};

export default BarberItem;
