import React from 'react';
import { render } from '@testing-library/react';
import { it, expect } from 'vitest';

it('handles iframe load failure', () => {
  const { container } = render(
    <div className="w-full h-[600px] rounded-lg overflow-hidden">
      <iframe
        src="https://app.usemotion.com/meet/johnlindon/meeting"
        title="Motion Booking Page"
        width="100%"
        height="100%"
        frameBorder="0"
        className="border-0"
        loading="lazy"
      />
    </div>
  );

  const iframe = container.querySelector('iframe');
  expect(iframe).toHaveAttribute('src', 'https://app.usemotion.com/meet/johnlindon/meeting');
}); 