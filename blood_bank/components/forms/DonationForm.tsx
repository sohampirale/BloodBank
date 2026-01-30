'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export interface DonationFormData {
  bloodType: string;
  quantity: string;
  location: string;
  notes: string;
}

interface DonationFormProps {
  onSubmit: (data: DonationFormData) => void;
  loading?: boolean;
}

export function DonationForm({ onSubmit, loading }: DonationFormProps) {
  const [formData, setFormData] = useState<DonationFormData>({
    bloodType: '',
    quantity: '',
    location: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<DonationFormData>>({});

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const validateForm = () => {
    const newErrors: Partial<DonationFormData> = {};

    if (!formData.bloodType) {
      newErrors.bloodType = 'Blood type is required';
    }

    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required';
    } else {
      const qty = parseInt(formData.quantity);
      if (isNaN(qty) || qty < 250 || qty > 500) {
        newErrors.quantity = 'Quantity must be between 250ml and 500ml';
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
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof DonationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
        label="Quantity (ml) *"
        type="number"
        placeholder="Enter donation amount (250-500 ml)"
        value={formData.quantity}
        onChange={(e) => handleChange('quantity', e.target.value)}
        error={errors.quantity}
        min="250"
        max="500"
      />

      <Input
        label="Location *"
        placeholder="Enter donation location"
        value={formData.location}
        onChange={(e) => handleChange('location', e.target.value)}
        error={errors.location}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes (Optional)
        </label>
        <textarea
          rows={4}
          placeholder="Any additional notes or medical conditions"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        loading={loading}
      >
        Submit Donation
      </Button>
    </form>
  );
}