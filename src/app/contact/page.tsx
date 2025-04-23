'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="pt-24 max-w-6xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Get in Touch</h1>
        <p className="text-xl text-text/80">Let's discuss how I can help with your project</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg border border-primary/10">
            <h2 className="text-2xl font-semibold text-primary mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <FaEnvelope className="text-text/60 mr-3" size={20} />
                <a
                  href="mailto:john@johnlindon.com"
                  className="text-text/60 hover:text-accent transition-colors"
                >
                  john@johnlindon.com
                </a>
              </div>
              <div className="flex items-center">
                <FaGithub className="text-text/60 mr-3" size={20} />
                <a
                  href="https://github.com/JohnLindonRobinson"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text/60 hover:text-accent transition-colors"
                >
                  github.com/JohnLindonRobinson
                </a>
              </div>
              <div className="flex items-center">
                <FaLinkedin className="text-text/60 mr-3" size={20} />
                <a
                  href="https://linkedin.com/in/johnlindonrobinson"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text/60 hover:text-accent transition-colors"
                >
                  linkedin.com/in/johnlindonrobinson
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-primary/10">
            <h2 className="text-2xl font-semibold text-primary mb-4">Schedule a Call</h2>
            <p className="text-text/80 mb-4">
              Book a time that works for you using my Motion calendar. I'll automatically adjust to
              your timezone and find the best available slot.
            </p>
            <a
              className="text-primary hover:text-primary/80 transition-colors"
              href="https://app.usemotion.com/meet/johnlindon/meeting"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="secondary"
                size="lg"
                className="w-full"
              >
                Book a Meeting
              </Button>
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg border border-primary/10">
            <h2 className="text-2xl font-semibold text-primary mb-4">Response Time</h2>
            <p className="text-text/80">
              I typically respond to messages within 24 hours. For urgent matters, please indicate
              in your message.
            </p>
          </div>
        </div>

        {/* Contact Form and Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg border border-primary/10 mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-text mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                  required
                ></textarea>
              </div>

              {status === 'error' && <div className="text-red-500 text-sm">{error}</div>}

              {status === 'success' && (
                <div className="text-green-500 text-sm">
                  Message sent successfully! I'll get back to you soon.
                </div>
              )}

              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>

          {/* Motion Calendar Embed */}
          <div className="bg-white p-6 rounded-lg border border-primary/10">
            <h2 className="text-2xl font-semibold text-primary mb-4">View Available Times</h2>
            <p className="text-text/80 mb-4">
              Browse and select a time that works best for you. The calendar will automatically
              adjust to your timezone.
            </p>
            <div className="w-full h-[600px] rounded-lg overflow-hidden">
              <iframe
                src="https://app.usemotion.com/meet/johnlindon/meeting"
                title="Motion Booking Page"
                width="100%"
                height="100%"
                frameBorder="0"
                className="border-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
