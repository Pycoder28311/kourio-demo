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

interface Service {
  id: number;
  name: string;
  price: number;
  durationMinutes: number;
}

interface ServiceCategory {
  id: number;
  name: string;
  services: Service[];
}

type ServiceCategoryItemProps = {
  serviceCategory: ServiceCategory;
  isEditing: boolean;
  editValues: { name: string; services: Service[] };
  serviceCategoryEdits: { [key: number]: { name: string; services: Service[] } };
  setServiceCategoryEdits: React.Dispatch<React.SetStateAction<{ [key: number]: { name: string; services: Service[] } }>>;
  setEditingId: React.Dispatch<React.SetStateAction<number | null>>;
  handleAddOrEdit: (type: "serviceCategory", data: any, id?: number) => Promise<void>;
  handleDelete: (type: "serviceCategory", id: number) => void;
  fetchData: () => void;
};

const ServiceCategoryItem: React.FC<ServiceCategoryItemProps> = ({
  serviceCategory,
  isEditing,
  editValues,
  serviceCategoryEdits,
  setServiceCategoryEdits,
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
                setServiceCategoryEdits({ ...serviceCategoryEdits, [serviceCategory.id]: { ...editValues, name: e.target.value } })
              }
              className="border p-2 w-full md:w-40"
            />
          </>
        ) : (
          <>
            <p className="w-full md:w-40">{serviceCategory.name}</p>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-2 md:mt-0">
        {isEditing ? (
          <>
            <button
              onClick={async () => {
                await handleAddOrEdit("serviceCategory", editValues, serviceCategory.id);
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
                setEditingId(serviceCategory.id);
                setServiceCategoryEdits({
                  ...serviceCategoryEdits,
                  [serviceCategory.id]: {
                    name: serviceCategory.name ?? "",
                    services: serviceCategory.services ?? [],
                  }
                });
              }}
              className="bg-yellow-500 text-white p-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete("serviceCategory", serviceCategory.id)}
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

export default ServiceCategoryItem;
