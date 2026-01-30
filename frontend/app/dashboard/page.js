'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('request')
  const [requests, setRequests] = useState([])
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const router = useRouter()

  const [requestForm, setRequestForm] = useState({
    patientName: '',
    bloodGroup: '',
    units: '',
    hospital: '',
    contact: '',
    urgency: 'normal'
  })

  const [donationForm, setDonationForm] = useState({
    donorName: '',
    bloodGroup: '',
    units: '',
    lastDonation: '',
    contact: '',
    location: ''
  })

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/auth/signin')
      return
    }
    
    const userData = JSON.parse(storedUser)
    setUser(userData)
    
    if (userData.isAdmin) {
      router.push('/admin')
      return
    }

    fetchData(userData._id)
  }, [router])

  const fetchData = async (userId) => {
    try {
      const [requestsRes, donationsRes] = await Promise.all([
        fetch(`/api/blood-requests?userId=${userId}`),
        fetch(`/api/blood-donations?userId=${userId}`)
      ])

      const requestsData = await requestsRes.json()
      const donationsData = await donationsRes.json()

      setRequests(requestsData)
      setDonations(donationsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRequestSubmit = async (e) => {
    e.preventDefault()
    setSubmitLoading(true)

    try {
      const response = await fetch('/api/blood-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...requestForm, userId: user._id })
      })

      if (response.ok) {
        setRequestForm({
          patientName: '',
          bloodGroup: '',
          units: '',
          hospital: '',
          contact: '',
          urgency: 'normal'
        })
        fetchData(user._id)
      }
    } catch (error) {
      console.error('Error creating request:', error)
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDonationSubmit = async (e) => {
    e.preventDefault()
    setSubmitLoading(true)

    try {
      const response = await fetch('/api/blood-donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...donationForm, userId: user._id })
      })

      if (response.ok) {
        setDonationForm({
          donorName: '',
          bloodGroup: '',
          units: '',
          lastDonation: '',
          contact: '',
          location: ''
        })
        fetchData(user._id)
      }
    } catch (error) {
      console.error('Error creating donation:', error)
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '1.5rem' }}>Loading...</div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px 30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            backgroundColor: '#e74c3c',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            color: 'white'
          }}>
            🩸
          </div>
          <div>
            <h1 style={{ margin: 0, color: '#2c3e50', fontSize: '1.5rem' }}>
              Dashboard
            </h1>
            <p style={{ margin: 0, color: '#7f8c8d', fontSize: '0.9rem' }}>
              Welcome, {user?.name}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ padding: '30px' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button
              onClick={() => setActiveTab('request')}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                backgroundColor: activeTab === 'request' ? '#e74c3c' : '#ecf0f1',
                color: activeTab === 'request' ? 'white' : '#2c3e50',
                transition: 'all 0.3s ease'
              }}
            >
              Request Blood
            </button>
            <button
              onClick={() => setActiveTab('donate')}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                backgroundColor: activeTab === 'donate' ? '#e74c3c' : '#ecf0f1',
                color: activeTab === 'donate' ? 'white' : '#2c3e50',
                transition: 'all 0.3s ease'
              }}
            >
              Donate Blood
            </button>
            <button
              onClick={() => setActiveTab('view')}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                backgroundColor: activeTab === 'view' ? '#e74c3c' : '#ecf0f1',
                color: activeTab === 'view' ? 'white' : '#2c3e50',
                transition: 'all 0.3s ease'
              }}
            >
              View My Requests & Donations
            </button>
          </div>

          {activeTab === 'request' && (
            <form onSubmit={handleRequestSubmit}>
              <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Request Blood</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input
                  type="text"
                  placeholder="Patient Name"
                  value={requestForm.patientName}
                  onChange={(e) => setRequestForm({...requestForm, patientName: e.target.value})}
                  required
                  style={{
                    padding: '12px',
                    border: '2px solid #ecf0f1',
                    borderRadius: '5px',
                    fontSize: '1rem'
                  }}
                />
                <select
                  value={requestForm.bloodGroup}
                  onChange={(e) => setRequestForm({...requestForm, bloodGroup: e.target.value})}
                  required
                  style={{
                    padding: '12px',
                    border: '2px solid #ecf0f1',
                    borderRadius: '5px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
                <input
                  type="number"
                  placeholder="Units Required"
                  value={requestForm.units}
                  onChange={(e) => setRequestForm({...requestForm, units: e.target.value})}
                  required
                  min="1"
                  style={{
                    padding: '12px',
                    border: '2px solid #ecf0f1',
                    borderRadius: '5px',
                    fontSize: '1rem'
                  }}
                />
                <input
                  type="text"
                  placeholder="Hospital Name"
                  value={requestForm.hospital}
                  onChange={(e) => setRequestForm({...requestForm, hospital: e.target.value})}
                  required
                  style={{
                    padding: '12px',
                    border: '2px solid #ecf0f1',
                    borderRadius: '5px',
                    fontSize: '1rem'
                  }}
                />
                <input
                  type="tel"
                  placeholder="Contact Number"
                  value={requestForm.contact}
                  onChange={(e) => setRequestForm({...requestForm, contact: e.target.value})}
                  required
                  style={{
                    padding: '12px',
                    border: '2px solid #ecf0f1',
                    borderRadius: '5px',
                    fontSize: '1rem'
                  }}
                />
                <select
                  value={requestForm.urgency}
                  onChange={(e) => setRequestForm({...requestForm, urgency: e.target.value})}
                  style={{
                    padding: '12px',
                    border: '2px solid #ecf0f1',
                    borderRadius: '5px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={submitLoading}
                style={{
                  marginTop: '20px',
                  backgroundColor: submitLoading ? '#bdc3c7' : '#e74c3c',
                  color: 'white',
                  border: 'none',
                  padding: '15px 30px',
                  borderRadius: '5px',
                  cursor: submitLoading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  transition: 'background-color 0.3s ease'
                }}
              >
                {submitLoading ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          )}

          {activeTab === 'donate' && (
            <form onSubmit={handleDonationSubmit}>
              <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Donate Blood</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input
                  type="text"
                  placeholder="Donor Name"
                  value={donationForm.donorName}
                  onChange={(e) => setDonationForm({...donationForm, donorName: e.target.value})}
                  required
                  style={{
                    padding: '12px',
                    border: '2px solid #ecf0f1',
                    borderRadius: '5px',
                    fontSize: '1rem'
                  }}
                />
                <select
                  value={donationForm.bloodGroup}
                  onChange={(e) => setDonationForm({...donationForm, bloodGroup: e.target.value})}
                  required
                  style={{
                    padding: '12px',
                    border: '2px solid #ecf0f1',
                    borderRadius: '5px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
                <input
                  type="number"
                  placeholder="Units Available"
                  value={donationForm.units}
                  onChange={(e) => setDonationForm({...donationForm, units: e.target.value})}
                  required
                  min="1"
                  style={{
                    padding: '12px',
                    border: '2px solid #ecf0f1',
                    borderRadius: '5px',
                    fontSize: '1rem'
                  }}
                />
                <input
                  type="date"
                  placeholder="Last Donation Date"
                  value={donationForm.lastDonation}
                  onChange={(e) => setDonationForm({...donationForm, lastDonation: e.target.value})}
                  style={{
                    padding: '12px',
                    border: '2px solid #ecf0f1',
                    borderRadius: '5px',
                    fontSize: '1rem'
                  }}
                />
                <input
                  type="tel"
                  placeholder="Contact Number"
                  value={donationForm.contact}
                  onChange={(e) => setDonationForm({...donationForm, contact: e.target.value})}
                  required
                  style={{
                    padding: '12px',
                    border: '2px solid #ecf0f1',
                    borderRadius: '5px',
                    fontSize: '1rem'
                  }}
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={donationForm.location}
                  onChange={(e) => setDonationForm({...donationForm, location: e.target.value})}
                  required
                  style={{
                    padding: '12px',
                    border: '2px solid #ecf0f1',
                    borderRadius: '5px',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={submitLoading}
                style={{
                  marginTop: '20px',
                  backgroundColor: submitLoading ? '#bdc3c7' : '#e74c3c',
                  color: 'white',
                  border: 'none',
                  padding: '15px 30px',
                  borderRadius: '5px',
                  cursor: submitLoading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  transition: 'background-color 0.3s ease'
                }}
              >
                {submitLoading ? 'Submitting...' : 'Submit Donation'}
              </button>
            </form>
          )}

          {activeTab === 'view' && (
            <div>
              <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>My Blood Requests</h3>
              {requests.length === 0 ? (
                <p style={{ color: '#7f8c8d' }}>No blood requests found.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f9fa' }}>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Patient Name</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Blood Group</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Units</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Hospital</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Contact</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Urgency</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((request) => (
                        <tr key={request._id}>
                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{request.patientName}</td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{request.bloodGroup}</td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{request.units}</td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{request.hospital}</td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{request.contact}</td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '3px',
                              fontSize: '0.8rem',
                              backgroundColor: request.urgency === 'critical' ? '#e74c3c' : request.urgency === 'urgent' ? '#f39c12' : '#27ae60',
                              color: 'white'
                            }}>
                              {request.urgency}
                            </span>
                          </td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                            {new Date(request.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <h3 style={{ color: '#2c3e50', marginBottom: '20px', marginTop: '30px' }}>My Blood Donations</h3>
              {donations.length === 0 ? (
                <p style={{ color: '#7f8c8d' }}>No blood donations found.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f9fa' }}>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Donor Name</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Blood Group</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Units</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Contact</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Location</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donations.map((donation) => (
                        <tr key={donation._id}>
                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{donation.donorName}</td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{donation.bloodGroup}</td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{donation.units}</td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{donation.contact}</td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{donation.location}</td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                            {new Date(donation.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}