'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { FaEnvelope, FaGithub, FaLinkedin, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { HiChatAlt2 } from 'react-icons/hi';

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
    <div className="max-w-6xl mx-auto px-6 py-16 pt-24">
      <div className="mb-12 text-center">
        <p className="text-sm uppercase tracking-widest text-purple-600 mb-2">05 — CONTACT</p>
        <h1 className="text-4xl font-bold mb-6">Get in Touch</h1>
        <p className="text-xl text-text/80 mb-4">I'd love to hear about your project — or just have a conversation about possibilities.</p>
        <p className="text-xl text-text/80">Let's discuss how I can help with your project</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="space-y-8 self-start">
          <div className="bg-[#fcfbfd] p-6 rounded-lg border border-primary/10 hover:shadow-lg transition-shadow" role="region">
            <div className="flex items-center gap-3 mb-4">
              <FaEnvelope className="text-purple-600" size={24} data-testid="envelope-icon" />
              <h2 className="text-2xl font-semibold text-primary">Contact Information</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <FaEnvelope className="text-text/60 mr-3" size={20} data-testid="envelope-icon" />
                <a
                  href="mailto:john@johnlindon.com"
                  className="text-text/60 hover:text-accent transition-colors"
                >
                  john@johnlindon.com
                </a>
              </div>
              <div className="flex items-center">
                <FaGithub className="text-text/60 mr-3" size={20} data-testid="github-icon" />
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
                <FaLinkedin className="text-text/60 mr-3" size={20} data-testid="linkedin-icon" />
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

          <div className="bg-[#fcfbfd] p-6 rounded-lg border border-primary/10 hover:shadow-lg transition-shadow" role="region">
            <div className="flex items-center gap-3 mb-4">
              <FaCalendarAlt className="text-purple-600" size={24} data-testid="calendar-icon" />
              <h2 className="text-2xl font-semibold text-primary">Schedule a Call</h2>
            </div>
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
                className="w-full hover:scale-[1.02] transition-transform"
              >
                📅 Book a Meeting
              </Button>
            </a>
          </div>
        </div>

        {/* Contact Form and Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-lg border border-primary/10 hover:shadow-lg transition-shadow" role="region">
            <div className="flex items-center gap-3 mb-6">
              <HiChatAlt2 className="text-purple-600" size={28} data-testid="chat-icon" />
              <h2 className="text-2xl font-semibold text-primary">Send a Message</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-text mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-colors"
                  required
                ></textarea>
              </div>

              {status === 'error' && <div className="text-red-500 text-sm">{error}</div>}
              {status === 'success' && (
                <div className="text-green-500 text-sm">Message sent successfully!</div>
              )}

              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-3 text-sm text-text/80">
                  <FaClock className="text-purple-600" size={16} data-testid="clock-icon" />
                  <span>Typical response time: 24 hours</span>
                </div>
                <Button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-lg hover:scale-[1.02] transition-all"
                >
                  💬 Let's Talk
                </Button>
              </div>
            </form>
          </div>

          <div className="mt-8 bg-[#fcfbfd] p-6 rounded-lg border border-primary/10" role="region">
            <div className="flex items-center gap-3 mb-4">
              <FaCalendarAlt className="text-purple-600" size={24} />
              <h2 className="text-2xl font-semibold text-primary">📅 Book a Call</h2>
            </div>
            <div className="w-full aspect-[3/2] rounded-lg overflow-hidden">
              <iframe
                src="https://app.usemotion.com/meet/johnlindon/meeting"
                width="100%"
                height="100%"
                className="border-0"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
