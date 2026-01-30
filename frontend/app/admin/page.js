'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Admin() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([])
  const [requests, setRequests] = useState([])
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/auth/signin')
      return
    }
    
    const userData = JSON.parse(storedUser)
    setUser(userData)
    
    if (!userData.isAdmin) {
      router.push('/dashboard')
      return
    }

    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      const [usersRes, requestsRes, donationsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/blood-requests'),
        fetch('/api/blood-donations')
      ])

      const usersData = await usersRes.json()
      const requestsData = await requestsRes.json()
      const donationsData = await donationsRes.json()

      setUsers(usersData)
      setRequests(requestsData)
      setDonations(donationsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (type, id) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return
    }

    setDeleteLoading(true)

    try {
      const response = await fetch(`/api/admin/${type}/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Error deleting item:', error)
    } finally {
      setDeleteLoading(false)
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
            backgroundColor: '#34495e',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            color: 'white'
          }}>
            👤
          </div>
          <div>
            <h1 style={{ margin: 0, color: '#2c3e50', fontSize: '1.5rem' }}>
              Admin Dashboard
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
              onClick={() => setActiveTab('users')}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                backgroundColor: activeTab === 'users' ? '#34495e' : '#ecf0f1',
                color: activeTab === 'users' ? 'white' : '#2c3e50',
                transition: 'all 0.3s ease'
              }}
            >
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                backgroundColor: activeTab === 'requests' ? '#34495e' : '#ecf0f1',
                color: activeTab === 'requests' ? 'white' : '#2c3e50',
                transition: 'all 0.3s ease'
              }}
            >
              Blood Requests ({requests.length})
            </button>
            <button
              onClick={() => setActiveTab('donations')}
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                backgroundColor: activeTab === 'donations' ? '#34495e' : '#ecf0f1',
                color: activeTab === 'donations' ? 'white' : '#2c3e50',
                transition: 'all 0.3s ease'
              }}
            >
              Blood Donations ({donations.length})
            </button>
          </div>

          {activeTab === 'users' && (
            <div>
              <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>All Users</h3>
              {users.length === 0 ? (
                <p style={{ color: '#7f8c8d' }}>No users found.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f9fa' }}>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Name</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Email</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Blood Group</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Phone</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Role</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Joined</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((userItem) => (
                        <tr key={userItem._id}>
                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{userItem.name}</td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{userItem.email}</td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{userItem.bloodGroup}</td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{userItem.phone}</td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '3px',
                              fontSize: '0.8rem',
                              backgroundColor: userItem.isAdmin ? '#e74c3c' : '#27ae60',
                              color: 'white'
                            }}>
                              {userItem.isAdmin ? 'Admin' : 'User'}
                            </span>
                          </td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                            {new Date(userItem.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                            <button
                              onClick={() => handleDelete('users', userItem._id)}
                              disabled={deleteLoading}
                              style={{
                                backgroundColor: '#e74c3c',
                                color: 'white',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '3px',
                                cursor: deleteLoading ? 'not-allowed' : 'pointer',
                                fontSize: '0.8rem',
                                transition: 'background-color 0.3s ease'
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'requests' && (
            <div>
              <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>All Blood Requests</h3>
              {requests.length === 0 ? (
                <p style={{ color: '#7f8c8d' }}>No blood requests found.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f9fa' }}>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Patient Name</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Blood Group</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Units</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Hospital</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Contact</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Urgency</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Requested By</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Date</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Actions</th>
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
                            {users.find(u => u._id === request.userId)?.name || 'Unknown'}
                          </td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                            {new Date(request.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                            <button
                              onClick={() => handleDelete('blood-requests', request._id)}
                              disabled={deleteLoading}
                              style={{
                                backgroundColor: '#e74c3c',
                                color: 'white',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '3px',
                                cursor: deleteLoading ? 'not-allowed' : 'pointer',
                                fontSize: '0.8rem',
                                transition: 'background-color 0.3s ease'
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'donations' && (
            <div>
              <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>All Blood Donations</h3>
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
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Donated By</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Date</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Actions</th>
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
                            {users.find(u => u._id === donation.userId)?.name || 'Unknown'}
                          </td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                            {new Date(donation.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                            <button
                              onClick={() => handleDelete('blood-donations', donation._id)}
                              disabled={deleteLoading}
                              style={{
                                backgroundColor: '#e74c3c',
                                color: 'white',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '3px',
                                cursor: deleteLoading ? 'not-allowed' : 'pointer',
                                fontSize: '0.8rem',
                                transition: 'background-color 0.3s ease'
                              }}
                            >
                              Delete
                            </button>
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