'use client';

import { useState, useEffect } from 'react';
import donationsData from '../donations.json';
import requestsData from '../requests.json';
import transactionsData from '../transactions.json';

export default function AdminPage() {
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Filter items by type since the files may contain mixed content
    const filteredDonations = donationsData.filter(item => item.type === 'donation');
    const filteredRequests = requestsData.filter(item => item.type === 'request');
    
    setDonations(filteredDonations);
    setRequests(filteredRequests);
    setTransactions(transactionsData);
    setLoading(false);
  }, []);

  const handleCompleteTransaction = async (type, id) => {
    try {
      const response = await fetch('/api/complete-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, id }),
      });

      if (response.ok) {
        // Refetch data by reloading imports and filter by type
        const freshDonationsData = (await import('../donations.json')).default;
        const freshRequestsData = (await import('../requests.json')).default;
        const freshTransactionsData = (await import('../transactions.json')).default;
        
        const filteredDonations = freshDonationsData.filter(item => item.type === 'donation');
        const filteredRequests = freshRequestsData.filter(item => item.type === 'request');
        
        setDonations(filteredDonations);
        setRequests(filteredRequests);
        setTransactions(freshTransactionsData);
      }
    } catch (error) {
      console.error('Error completing transaction:', error);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Blood Bank Admin</h1>
      
      {/* Current Donations Section */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#28a745', marginBottom: '20px', borderBottom: '2px solid #28a745', paddingBottom: '10px' }}>
          Current Donations
        </h2>
        <div style={{ display: 'grid', gap: '15px' }}>
          {donations.map((item) => (
            <div key={`${item.type}-${item.id}-${item.timestamp}`} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: '#f9f9f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{item.name}</h3>
                <p style={{ margin: '5px 0', color: '#666' }}>Phone: {item.phone}</p>
                <p style={{ margin: '5px 0', color: '#666' }}>Blood Type: <span style={{ fontWeight: 'bold', color: '#dc3545' }}>{item.bloodType}</span></p>
                <p style={{ margin: '5px 0', color: '#666', fontSize: '0.9em' }}>{new Date(item.timestamp).toLocaleString()}</p>
              </div>
              <button
                onClick={() => handleCompleteTransaction('donation', item.id)}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Done
              </button>
            </div>
          ))}
          {donations.length === 0 && (
            <p style={{ color: '#666', fontStyle: 'italic' }}>No current donations</p>
          )}
        </div>
      </section>

      {/* Current Requests Section */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#dc3545', marginBottom: '20px', borderBottom: '2px solid #dc3545', paddingBottom: '10px' }}>
          Current Requests
        </h2>
        <div style={{ display: 'grid', gap: '15px' }}>
          {requests.map((item) => (
            <div key={`${item.type}-${item.id}-${item.timestamp}`} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: '#f9f9f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{item.name}</h3>
                <p style={{ margin: '5px 0', color: '#666' }}>Phone: {item.phone}</p>
                <p style={{ margin: '5px 0', color: '#666' }}>Blood Type: <span style={{ fontWeight: 'bold', color: '#dc3545' }}>{item.bloodType}</span></p>
                <p style={{ margin: '5px 0', color: '#666', fontSize: '0.9em' }}>{new Date(item.timestamp).toLocaleString()}</p>
              </div>
              <button
                onClick={() => handleCompleteTransaction('request', item.id)}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Done
              </button>
            </div>
          ))}
          {requests.length === 0 && (
            <p style={{ color: '#666', fontStyle: 'italic' }}>No current requests</p>
          )}
        </div>
      </section>

      {/* Transactions Section */}
      <section>
        <h2 style={{ color: '#007bff', marginBottom: '20px', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
          All Transactions
        </h2>
        <div style={{ display: 'grid', gap: '15px' }}>
          {transactions.map((item) => (
            <div key={item.uniqueId || `${item.type}-${item.id}-${item.timestamp}`} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: '#f8f9fa'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{item.name}</h3>
              <p style={{ margin: '5px 0', color: '#666' }}>Phone: {item.phone}</p>
              <p style={{ margin: '5px 0', color: '#666' }}>
                Type: <span style={{ 
                  fontWeight: 'bold', 
                  color: item.type === 'donation' ? '#28a745' : '#dc3545' 
                }}>{item.type}</span>
              </p>
              <p style={{ margin: '5px 0', color: '#666' }}>Blood Type: <span style={{ fontWeight: 'bold', color: '#dc3545' }}>{item.bloodType}</span></p>
              <p style={{ margin: '5px 0', color: '#666', fontSize: '0.9em' }}>
                Requested: {new Date(item.timestamp).toLocaleString()}
              </p>
              {item.completedAt && (
                <p style={{ margin: '5px 0', color: '#666', fontSize: '0.9em' }}>
                  Completed: {new Date(item.completedAt).toLocaleString()}
                </p>
              )}
            </div>
          ))}
          {transactions.length === 0 && (
            <p style={{ color: '#666', fontStyle: 'italic' }}>No transactions completed yet</p>
          )}
        </div>
      </section>
    </div>
  );
}