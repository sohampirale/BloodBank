"use client";

import { useState, useEffect } from "react";
import donationsData from "./donations.json";
import requestsData from "./requests.json";

export default function Home() {
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", bloodType: "O+" });

  useEffect(() => {
    setDonations(donationsData);
    setRequests(requestsData);
  }, []);

  useEffect(() => {
    console.log("Donations:", donations);
    console.log("Requests:", requests);
  }, [donations, requests]);

  const handleSubmit = async (type) => {
    console.log("handleSubmit called with type:", type);
    const newEntry = {
      id: type === "donation" ? donations.length + 1 : requests.length + 1,
      ...formData,
      type,
      timestamp: new Date().toISOString()
    };
    console.log("New entry:", newEntry);
    
    try {
      const response = await fetch(`/api/save-${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEntry),
      });
      
      if (response.ok) {
        if (type === "donation") {
          setDonations([newEntry, ...donations]);
          console.log("Added to donations");
        } else {
          setRequests([newEntry, ...requests]);
          console.log("Added to requests");
        }
        setFormData({ name: "", phone: "", bloodType: "O+" });
        type === "donation" ? setShowDonateModal(false) : setShowRequestModal(false);
      } else {
        console.error('Failed to save');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '32px' }}>
      <div style={{ maxWidth: '896px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', textAlign: 'center', marginBottom: '32px', color: '#1f2937' }}>Blood Bank</h1>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '32px' }}>
          <button
            onClick={() => setShowDonateModal(true)}
            style={{ backgroundColor: '#ef4444', color: 'white', fontWeight: 'bold', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
          >
            Donate Blood
          </button>
          <button
            onClick={() => setShowRequestModal(true)}
            style={{ backgroundColor: '#3b82f6', color: 'white', fontWeight: 'bold', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
          >
            Request Blood
          </button>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>Donations & Requests</h2>
<div style={{ display: 'grid', gap: '16px' }}>
          {[...donations, ...requests].map((item, index) => (
            <div
              key={`${item.type}-${item.id}-${index}`}
              style={{
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid',
                backgroundColor: item.type === "donation" ? '#f0fdf4' : '#fefce8',
                borderColor: item.type === "donation" ? '#bbf7d0' : '#fde68a'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontWeight: '600', fontSize: '18px' }}>
                    {item.type === "donation" ? "Donating" : "Requesting"}: {item.bloodType}
                  </h3>
                  <p style={{ color: '#6b7280' }}>Name: {item.name}</p>
                  <p style={{ color: '#6b7280' }}>Phone: {item.phone}</p>
                </div>
                <span
                  style={{
                    padding: '6px 12px',
                    borderRadius: '9999px',
                    fontSize: '14px',
                    fontWeight: '500',
                    backgroundColor: item.type === "donation" ? '#bbf7d0' : '#fde68a',
                    color: item.type === "donation" ? '#166534' : '#92400e'
                  }}
                >
                  {item.type === "donation" ? "Donation" : "Request"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {(showDonateModal || showRequestModal) && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', width: '100%', maxWidth: '448px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                {showDonateModal ? "Donate Blood" : "Request Blood"}
              </h3>
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ width: '100%', marginBottom: '12px', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{ width: '100%', marginBottom: '12px', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
              />
              <select
                value={formData.bloodType}
                onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                style={{ width: '100%', marginBottom: '16px', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
              >
                {bloodTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => {
                console.log("Button clicked, showDonateModal:", showDonateModal, "showRequestModal:", showRequestModal);
                showDonateModal ? handleSubmit("donation") : handleSubmit("request");
              }}
                  style={{ flex: 1, backgroundColor: '#10b981', color: 'white', fontWeight: 'bold', padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                >
                  Submit
                </button>
                <button
                  onClick={() => showDonateModal ? setShowDonateModal(false) : setShowRequestModal(false)}
                  style={{ flex: 1, backgroundColor: '#d1d5db', color: '#1f2937', fontWeight: 'bold', padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
