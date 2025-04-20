import { useState } from 'react';
import Button from '@/components/ui/Button';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<void>;
  className?: string;
}

export default function ContactForm({ onSubmit, className = '' }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
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
      if (onSubmit) {
        await onSubmit(formData);
      } else {
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
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
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
          data-testid="name-input"
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
          data-testid="email-input"
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
          data-testid="subject-input"
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
          data-testid="message-input"
        ></textarea>
      </div>

      {status === 'error' && (
        <div className="text-red-500 text-sm" data-testid="error-message">
          {error}
        </div>
      )}

      {status === 'success' && (
        <div className="text-green-500 text-sm" data-testid="success-message">
          Message sent successfully! I'll get back to you soon.
        </div>
      )}

      <Button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full"
        data-testid="submit-button"
      >
        {status === 'submitting' ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
} 