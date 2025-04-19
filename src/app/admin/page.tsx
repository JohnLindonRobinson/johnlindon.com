'use client';

import { useEffect, useState } from 'react';

interface Submission {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: string;
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch('/api/admin/submissions');
        if (!response.ok) throw new Error('Failed to fetch submissions');
        const data = await response.json();
        setSubmissions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      setSubmissions(prev =>
        prev.map(sub => (sub.id === id ? { ...sub, status: newStatus } : sub))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-primary mb-8">Loading submissions...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-primary mb-8">Error</h1>
          <p className="text-text/80">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-primary mb-8">Contact Form Submissions</h1>

        <div className="space-y-6">
          {submissions.map(submission => (
            <div key={submission.id} className="bg-white p-6 rounded-lg border border-primary/10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-primary">{submission.subject}</h2>
                  <p className="text-text/80">
                    From: {submission.name} ({submission.email})
                  </p>
                  <p className="text-sm text-text/60">
                    {new Date(submission.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <select
                    value={submission.status}
                    onChange={e => updateStatus(submission.id, e.target.value)}
                    className="px-3 py-1 border border-primary/20 rounded-lg text-sm"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                  </select>
                </div>
              </div>
              <div className="prose max-w-none">
                <p className="text-text/80 whitespace-pre-wrap">{submission.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
