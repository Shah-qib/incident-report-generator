"use client";

import { useState } from "react";

interface FormData {
  title: string;
  dateTime: string;
  location: string;
  persons: string;
  description: string;
}

interface IncidentFormProps {
  onSubmit: (data: FormData) => void;
}

export default function IncidentForm({ onSubmit }: IncidentFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    dateTime: "",
    location: "",
    persons: "",
    description: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title.trim()) newErrors.title = "Required";
    if (!formData.dateTime) newErrors.dateTime = "Required";
    if (!formData.location.trim()) newErrors.location = "Required";
    if (!formData.persons.trim()) newErrors.persons = "Required";
    if (!formData.description.trim()) newErrors.description = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-500"
    >
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-4 width-full">
          Report Form
        </h2>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Incident Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
          maxLength={100}
          placeholder="Enter incident title"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1.5">{errors.title}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Date & Time
        </label>
        <input
          type="datetime-local"
          name="dateTime"
          value={formData.dateTime}
          onChange={handleChange}
          className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
        />
        {errors.dateTime && (
          <p className="text-red-500 text-xs mt-1.5">{errors.dateTime}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
          maxLength={100}
          placeholder="Enter location"
        />
        {errors.location && (
          <p className="text-red-500 text-xs mt-1.5">{errors.location}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Persons Involved
        </label>
        <textarea
          name="persons"
          value={formData.persons}
          onChange={handleChange}
          rows={3}
          className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
          maxLength={200}
          placeholder="e.g., John Doe (Reporter), Jane Smith (Witness)"
        />
        {errors.persons && (
          <p className="text-red-500 text-xs mt-1.5">{errors.persons}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Brief Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
          maxLength={500}
          placeholder="Describe what happened..."
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1.5">{errors.description}</p>
        )}
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
      >
        Generate Report
      </button>
    </form>
  );
}
