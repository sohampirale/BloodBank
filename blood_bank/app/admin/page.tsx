'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodType: string;
  lastDonated?: string;
  createdAt: string;
}

interface Inventory {
  id: string;
  bloodType: string;
  quantity: number;
  location: string;
  lastUpdated: string;
}

interface Donation {
  id: string;
  donorId: {
    name: string;
    email: string;
    phone: string;
    bloodType: string;
  };
  bloodType: string;
  quantity: number;
  location: string;
  status: 'pending' | 'approved' | 'completed';
  donationDate: string;
  notes?: string;
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [donors, setDonors] = useState<User[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  const [inventoryForm, setInventoryForm] = useState({
    bloodType: '',
    quantity: '',
    location: '',
  });

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          credentials: 'include',
        });
        
        if (!response.ok) {
          router.push('/auth/login');
          return;
        }

        const data = await response.json();
        if (data.user.role !== 'admin') {
          router.push('/');
          return;
        }
        
        setUser(data.user);
        await fetchData();
      } catch (error) {
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchData = async () => {
    try {
      const [donorsRes, inventoryRes, donationsRes] = await Promise.all([
        fetch('/api/donors', { credentials: 'include' }),
        fetch('/api/inventory', { credentials: 'include' }),
        fetch('/api/donations', { credentials: 'include' }),
      ]);

      if (donorsRes.ok) {
        const donorsData = await donorsRes.json();
        setDonors(donorsData.donors || []);
      }

      if (inventoryRes.ok) {
        const inventoryData = await inventoryRes.json();
        setInventory(inventoryData.inventory || []);
      }

      if (donationsRes.ok) {
        const donationsData = await donationsRes.json();
        setDonations(donationsData.donations || []);
      }
    } catch (error) {
      setError('Failed to fetch data');
    }
  };

  const handleAddInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          bloodType: inventoryForm.bloodType,
          quantity: parseInt(inventoryForm.quantity),
          location: inventoryForm.location,
        }),
      });

      if (response.ok) {
        setInventoryForm({ bloodType: '', quantity: '', location: '' });
        await fetchData();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to add inventory');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  const updateDonationStatus = async (donationId: string, status: string) => {
    try {
      const response = await fetch(`/api/donations/${donationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        await fetchData();
      } else {
        setError('Failed to update donation status');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const totalBlood = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const pendingDonations = donations.filter(d => d.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage blood bank operations</p>
        </div>

        <div className="mb-6">
          <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
            {['dashboard', 'donors', 'inventory', 'donations'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-red-600 text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500">Total Donors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{donors.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500">Total Blood</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{totalBlood}ml</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500">Pending Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingDonations}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-500">Blood Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{inventory.length}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'donors' && (
          <Card>
            <CardHeader>
              <CardTitle>Donors</CardTitle>
              <CardDescription>Manage registered blood donors</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Blood Type</TableHead>
                    <TableHead>Last Donation</TableHead>
                    <TableHead>Registered</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donors.map((donor) => (
                    <TableRow key={donor.id}>
                      <TableCell className="font-medium">{donor.name}</TableCell>
                      <TableCell>{donor.email}</TableCell>
                      <TableCell>{donor.phone}</TableCell>
                      <TableCell className="text-red-600 font-medium">{donor.bloodType}</TableCell>
                      <TableCell>
                        {donor.lastDonated ? new Date(donor.lastDonated).toLocaleDateString() : 'Never'}
                      </TableCell>
                      <TableCell>{new Date(donor.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Blood Inventory</CardTitle>
                <CardDescription>Add new blood stock to inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddInventory} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
                      <select
                        value={inventoryForm.bloodType}
                        onChange={(e) => setInventoryForm(prev => ({ ...prev, bloodType: e.target.value }))}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                        required
                      >
                        <option value="">Select blood type</option>
                        {bloodTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <Input
                      label="Quantity (ml)"
                      type="number"
                      placeholder="Enter quantity"
                      value={inventoryForm.quantity}
                      onChange={(e) => setInventoryForm(prev => ({ ...prev, quantity: e.target.value }))}
                      required
                    />
                    <Input
                      label="Location"
                      type="text"
                      placeholder="Enter location"
                      value={inventoryForm.location}
                      onChange={(e) => setInventoryForm(prev => ({ ...prev, location: e.target.value }))}
                      required
                    />
                  </div>
                  <Button type="submit">Add to Inventory</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Inventory</CardTitle>
                <CardDescription>Manage blood stock levels</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Blood Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Last Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium text-red-600">{item.bloodType}</TableCell>
                        <TableCell>{item.quantity}ml</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>{new Date(item.lastUpdated).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'donations' && (
          <Card>
            <CardHeader>
              <CardTitle>Donation Requests</CardTitle>
              <CardDescription>Manage blood donation requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Donor</TableHead>
                    <TableHead>Blood Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{donation.donorId.name}</div>
                          <div className="text-sm text-gray-500">{donation.donorId.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-red-600 font-medium">{donation.bloodType}</TableCell>
                      <TableCell>{donation.quantity}ml</TableCell>
                      <TableCell>{donation.location}</TableCell>
                      <TableCell>{new Date(donation.donationDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          donation.status === 'completed' ? 'bg-green-100 text-green-800' :
                          donation.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {donation.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {donation.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateDonationStatus(donation.id, 'approved')}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => updateDonationStatus(donation.id, 'completed')}
                              >
                                Complete
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}