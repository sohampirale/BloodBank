'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export interface SearchFormData {
  bloodType: string;
  quantity: string;
  location: string;
}

export interface SearchFormProps {
  onSearch: (data: SearchFormData) => void;
  loading?: boolean;
}

export function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [formData, setFormData] = useState<SearchFormData>({
    bloodType: '',
    quantity: '',
    location: '',
  });

  const [errors, setErrors] = useState<Partial<SearchFormData>>({});

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const validateForm = () => {
    const newErrors: Partial<SearchFormData> = {};

    if (!formData.bloodType) {
      newErrors.bloodType = 'Blood type is required';
    }

    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required';
    } else {
      const qty = parseInt(formData.quantity);
      if (isNaN(qty) || qty <= 0) {
        newErrors.quantity = 'Quantity must be greater than 0';
      }
    }

    if (!formData.location) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSearch(formData);
    }
  };

  const handleChange = (field: keyof SearchFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleReset = () => {
    setFormData({
      bloodType: '',
      quantity: '',
      location: '',
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Blood Type *
        </label>
        <select
          value={formData.bloodType}
          onChange={(e) => handleChange('bloodType', e.target.value)}
          className={`w-full rounded-md border ${
            errors.bloodType ? 'border-red-500' : 'border-gray-300'
          } bg-white px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500`}
        >
          <option value="">Select blood type</option>
          {bloodTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.bloodType && (
          <p className="mt-1 text-sm text-red-600">{errors.bloodType}</p>
        )}
      </div>

      <Input
        label="Required Quantity (ml) *"
        type="number"
        placeholder="Enter required quantity in ml"
        value={formData.quantity}
        onChange={(e) => handleChange('quantity', e.target.value)}
        error={errors.quantity}
        min="1"
      />

      <Input
        label="Location *"
        placeholder="Enter city or hospital name"
        value={formData.location}
        onChange={(e) => handleChange('location', e.target.value)}
        error={errors.location}
      />

      <div className="flex gap-4">
        <Button
          type="submit"
          className="flex-1"
          loading={loading}
        >
          Search Blood
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="flex-1"
        >
          Reset
        </Button>
      </div>
    </form>
  );
}