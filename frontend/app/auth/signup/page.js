'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bloodGroup: '',
    phone: '',
    isAdmin: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user))
        if (data.user.isAdmin) {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
      } else {
        setError(data.message || 'Registration failed')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '40px',
        boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#e74c3c',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '30px',
            color: 'white'
          }}>
            🩸
          </div>
          <h2 style={{
            color: '#2c3e50',
            fontSize: '2rem',
            marginBottom: '10px',
            fontWeight: 'bold'
          }}>
            Create Account
          </h2>
          <p style={{
            color: '#7f8c8d',
            fontSize: '1rem'
          }}>
            Join our blood donation community
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              color: '#2c3e50',
              fontWeight: 'bold'
            }}>
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #ecf0f1',
                borderRadius: '8px',
                fontSize: '0.9rem',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#e74c3c'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#ecf0f1'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              color: '#2c3e50',
              fontWeight: 'bold'
            }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #ecf0f1',
                borderRadius: '8px',
                fontSize: '0.9rem',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#e74c3c'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#ecf0f1'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              color: '#2c3e50',
              fontWeight: 'bold'
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #ecf0f1',
                borderRadius: '8px',
                fontSize: '0.9rem',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#e74c3c'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#ecf0f1'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              color: '#2c3e50',
              fontWeight: 'bold'
            }}>
              Blood Group
            </label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #ecf0f1',
                borderRadius: '8px',
                fontSize: '0.9rem',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#e74c3c'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#ecf0f1'
              }}
            >
              <option value="">Select blood group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              color: '#2c3e50',
              fontWeight: 'bold'
            }}>
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #ecf0f1',
                borderRadius: '8px',
                fontSize: '0.9rem',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#e74c3c'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#ecf0f1'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              color: '#2c3e50',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                name="isAdmin"
                checked={formData.isAdmin}
                onChange={handleChange}
                style={{
                  marginRight: '10px',
                  width: '18px',
                  height: '18px'
                }}
              />
              Register as Administrator
            </label>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fee',
              color: '#c33',
              padding: '10px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#bdc3c7' : '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '15px',
              fontSize: '1rem',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              fontWeight: 'bold',
              marginBottom: '20px'
            }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          color: '#7f8c8d',
          fontSize: '0.9rem'
        }}>
          Already have an account?{' '}
          <Link 
            href="/auth/signin" 
            style={{ color: '#e74c3c', textDecoration: 'none', fontWeight: 'bold' }}
          >
            Sign In
          </Link>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '30px'
        }}>
          <Link 
            href="/" 
            style={{ color: '#7f8c8d', textDecoration: 'none', fontSize: '0.9rem' }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}