'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      if (userData.isAdmin) {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    }
  }, [router])

  const handleGetStarted = () => {
    router.push('/auth/signin')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '60px 40px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%'
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          backgroundColor: '#e74c3c',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 30px',
          fontSize: '40px',
          color: 'white'
        }}>
          🩸
        </div>
        
        <h1 style={{
          color: '#2c3e50',
          fontSize: '2.5rem',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          Blood Bank System
        </h1>
        
        <p style={{
          color: '#7f8c8d',
          fontSize: '1.2rem',
          marginBottom: '40px',
          lineHeight: '1.6'
        }}>
          Save lives by connecting blood donors with recipients. 
          Join our community of heroes making a difference.
        </p>
        
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          marginBottom: '40px'
        }}>
          <div style={{
            backgroundColor: '#ecf0f1',
            padding: '20px',
            borderRadius: '10px',
            flex: '1'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🏥</div>
            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Request Blood</h3>
            <p style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
              Get the blood you need in emergencies
            </p>
          </div>
          
          <div style={{
            backgroundColor: '#ecf0f1',
            padding: '20px',
            borderRadius: '10px',
            flex: '1'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>❤️</div>
            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Donate Blood</h3>
            <p style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
              Be a hero and save lives
            </p>
          </div>
        </div>
        
        <button
          onClick={handleGetStarted}
          style={{
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            padding: '15px 40px',
            fontSize: '1.1rem',
            borderRadius: '50px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontWeight: 'bold'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#c0392b'
            e.target.style.transform = 'translateY(-2px)'
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#e74c3c'
            e.target.style.transform = 'translateY(0)'
          }}
        >
          Get Started
        </button>
        
        <div style={{
          marginTop: '30px',
          color: '#7f8c8d',
          fontSize: '0.9rem'
        }}>
          Already have an account?{' '}
          <a 
            href="/auth/signin" 
            style={{ color: '#e74c3c', textDecoration: 'none', fontWeight: 'bold' }}
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  )
}