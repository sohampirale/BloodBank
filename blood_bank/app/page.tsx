'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';

interface Stats {
  totalDonors: number;
  totalBlood: number;
  pendingDonations: number;
}

export default function Home() {
  const [stats, setStats] = useState<Stats>({
    totalDonors: 0,
    totalBlood: 0,
    pendingDonations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [donorsRes, inventoryRes, donationsRes] = await Promise.all([
          fetch('/api/donors', { credentials: 'include' }),
          fetch('/api/inventory', { credentials: 'include' }),
          fetch('/api/donations?status=pending', { credentials: 'include' }),
        ]);

        if (donorsRes.ok) {
          const donorsData = await donorsRes.json();
          setStats(prev => ({ ...prev, totalDonors: donorsData.donors?.length || 0 }));
        }

        if (inventoryRes.ok) {
          const inventoryData = await inventoryRes.json();
          const totalBlood = inventoryData.inventory?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
          setStats(prev => ({ ...prev, totalBlood }));
        }

        if (donationsRes.ok) {
          const donationsData = await donationsRes.json();
          setStats(prev => ({ ...prev, pendingDonations: donationsData.donations?.length || 0 }));
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Save Lives, Donate
              <span className="text-red-600"> Blood</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
              Join our blood bank community to help those in need. Every donation counts and can save up to three lives.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/donor">
                <Button size="lg" className="text-lg px-8 py-3">
                  Donate Blood
                </Button>
              </Link>
              <Link href="/search">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                  Search Blood
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Platform Statistics</h2>
          <p className="mt-4 text-gray-600">Real-time data from our blood bank network</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Total Donors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {loading ? '...' : stats.totalDonors}
              </div>
              <p className="text-gray-600 mt-2">Registered blood donors</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Blood Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {loading ? '...' : `${stats.totalBlood}ml`}
              </div>
              <p className="text-gray-600 mt-2">Ready for donation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Pending Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {loading ? '...' : stats.pendingDonations}
              </div>
              <p className="text-gray-600 mt-2">Awaiting approval</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <p className="mt-4 text-gray-600">Simple steps to save lives</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-red-600">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Register</h3>
            <p className="text-gray-600">Create an account and provide your basic information and blood type.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-red-600">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Donate or Search</h3>
            <p className="text-gray-600">Schedule a donation or search for available blood when needed.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-red-600">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Save Lives</h3>
            <p className="text-gray-600">Your contribution helps save lives and makes our community stronger.</p>
          </div>
        </div>
      </div>

      <div className="bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of donors who are helping save lives every day.
            </p>
            <Link href="/donor">
              <Button variant="secondary" size="lg" className="text-lg px-8 py-3">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}