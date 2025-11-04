import React from "react";
// Drag-and-drop
import { useApp } from "@/app/context/AppWrapper";
import { Service, ServiceCategory } from "@/app/types";

type ServiceCategoryItemProps = {
  serviceCategory: ServiceCategory;
  isEditing: boolean;
  editValues: { name: string; services: Service[] };
};

const ServiceCategoryItem: React.FC<ServiceCategoryItemProps> = ({
  serviceCategory,
  isEditing,
  editValues,
}) => {
  const { serviceCategoryEdits, setServiceCategoryEdits, setIsEditing, addingIds, handleEdit, handleDelete } = useApp();
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
                await handleEdit("serviceCategory", editValues, serviceCategory.id);
                setIsEditing(null);
              }}
              className="bg-blue-600 text-white p-1 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(null)}
              className="bg-gray-400 text-white p-1 rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setIsEditing(serviceCategory.id);
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
              className="bg-red-600 text-white p-1 rounded disabled:bg-gray-400 disabled:cursor-not-allowed disabled:text-gray-200"
              disabled={addingIds.serviceCategory.includes(serviceCategory.id)}
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
