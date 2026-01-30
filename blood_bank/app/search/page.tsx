'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { SearchForm, SearchFormData } from '../../components/forms/SearchForm';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface SearchResults {
  results: Array<{
    id: string;
    bloodType: string;
    quantity: number;
    location: string;
    lastUpdated: string;
    donors: Array<{
      name: string;
      email: string;
      phone: string;
    }>;
  }>;
  count: number;
}

export default function SearchPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

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
        setUser(data.user);
      } catch (error) {
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSearch = async (formData: SearchFormData) => {
    setSearching(true);
    setError('');

    const params = new URLSearchParams({
      bloodType: formData.bloodType,
      quantity: formData.quantity,
      location: formData.location,
    });

    try {
      const response = await fetch(`/api/search?${params}`, {
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setSearchResults(data);
      } else {
        setError(data.error || 'Search failed');
        setSearchResults(null);
      }
    } catch (error) {
      setError('Network error. Please try again.');
      setSearchResults(null);
    } finally {
      setSearching(false);
    }
  };

  const handleSubmitRequest = async (bloodType: string, quantity: number, location: string) => {
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          bloodType,
          quantity,
          location,
          urgency: 'normal',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Blood request submitted successfully!');
      } else {
        alert(data.error || 'Failed to submit request');
      }
    } catch (error) {
      alert('Network error. Please try again.');
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Search Blood Availability</h1>
          <p className="mt-2 text-gray-600">
            Find available blood by type, quantity, and location
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Search Criteria</CardTitle>
                <CardDescription>
                  Enter your requirements to find available blood
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SearchForm onSubmit={handleSearch} loading={searching} />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {!searchResults ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Search Results</h3>
                    <p className="text-gray-600">
                      Use the search form to find available blood in your area.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Search Results ({searchResults.count} found)
                  </h2>
                  <Button
                    variant="outline"
                    onClick={() => setSearchResults(null)}
                  >
                    Clear Results
                  </Button>
                </div>

                {searchResults.results.length === 0 ? (
                  <Card>
                    <CardContent className="py-12">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Blood Available</h3>
                        <p className="text-gray-600">
                          No blood found matching your criteria. Try searching with different parameters or contact nearby hospitals directly.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {searchResults.results.map((result) => (
                      <Card key={result.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-red-600">
                                {result.bloodType} Blood
                              </CardTitle>
                              <CardDescription>
                                {result.quantity}ml available at {result.location}
                              </CardDescription>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600">
                                {result.quantity}ml
                              </div>
                              <p className="text-sm text-gray-500">
                                Updated {new Date(result.lastUpdated).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">
                                <strong>Location:</strong> {result.location}
                              </p>
                              <p className="text-sm text-gray-600">
                                <strong>Available Donors:</strong> {result.donors.length}
                              </p>
                            </div>
                            <Button
                              onClick={() => handleSubmitRequest(result.bloodType, Math.min(result.quantity, 500), result.location)}
                              size="sm"
                            >
                              Request Blood
                            </Button>
                          </div>

                          {result.donors.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                              <p className="text-sm font-medium text-gray-700 mb-2">Contact Information:</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {result.donors.slice(0, 4).map((donor, index) => (
                                  <div key={index} className="text-sm">
                                    <span className="font-medium">{donor.name}</span> - {donor.phone}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}