import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getElementError } from '@testing-library/dom';
import { describe, it, expect, vi } from 'vitest';
import Select from '../Select';

describe('Select Component', () => {
  const defaultOptions = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ];

  const groupedOptions = [
    { value: '1', label: 'Option 1', group: 'Group 1' },
    { value: '2', label: 'Option 2', group: 'Group 1' },
    { value: '3', label: 'Option 3', group: 'Group 2' },
    { value: '4', label: 'Option 4', group: 'Group 2' },
  ];

  // Basic Functionality Tests
  describe('Basic Functionality', () => {
    it('renders with placeholder', () => {
      render(<Select options={defaultOptions} placeholder="Select an option" />);
      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('opens dropdown on click', () => {
      render(<Select options={defaultOptions} />);
      fireEvent.click(screen.getByRole('combobox'));
      defaultOptions.forEach(option => {
        expect(screen.getByText(option.label)).toBeInTheDocument();
      });
    });

    it('selects an option on click', () => {
      const onChange = vi.fn();
      render(<Select options={defaultOptions} onChange={onChange} />);
      
      fireEvent.click(screen.getByRole('combobox'));
      fireEvent.click(screen.getByText('Option 1'));
      
      expect(onChange).toHaveBeenCalledWith('1');
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('closes dropdown after selection in single select mode', () => {
      render(<Select options={defaultOptions} />);
      
      fireEvent.click(screen.getByRole('combobox'));
      fireEvent.click(screen.getByText('Option 1'));
      
      expect(screen.queryByRole('option')).not.toBeInTheDocument();
    });
  });

  // Multi-select Tests
  describe('Multi-select Functionality', () => {
    it('allows multiple selections', () => {
      const onChange = vi.fn();
      render(<Select options={defaultOptions} isMulti onChange={onChange} />);
      
      fireEvent.click(screen.getByRole('combobox'));
      fireEvent.click(screen.getByText('Option 1'));
      fireEvent.click(screen.getByText('Option 2'));
      
      expect(onChange).toHaveBeenLastCalledWith(['1', '2']);
    });

    it('shows checkboxes in multi-select mode', () => {
      render(<Select options={defaultOptions} isMulti />);
      
      fireEvent.click(screen.getByRole('combobox'));
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(defaultOptions.length);
    });

    it('toggles selections in multi-select mode', () => {
      const onChange = vi.fn();
      render(<Select options={defaultOptions} isMulti onChange={onChange} />);
      
      fireEvent.click(screen.getByRole('combobox'));
      fireEvent.click(screen.getByText('Option 1'));
      expect(onChange).toHaveBeenLastCalledWith(['1']);
      
      fireEvent.click(screen.getByText('Option 1'));
      expect(onChange).toHaveBeenLastCalledWith([]);
    });
  });

  // Search Functionality Tests
  describe('Search Functionality', () => {
    it('shows search input when isSearchable is true', () => {
      render(<Select options={defaultOptions} isSearchable />);
      
      fireEvent.click(screen.getByRole('combobox'));
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('filters options based on search term', async () => {
      render(<Select options={defaultOptions} isSearchable />);
      
      fireEvent.click(screen.getByRole('combobox'));
      const searchInput = screen.getByPlaceholderText('Search...');
      
      fireEvent.change(searchInput, { target: { value: 'Option 1' } });
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
    });

    it('shows no options message when search has no results', () => {
      render(<Select options={defaultOptions} isSearchable />);
      
      fireEvent.click(screen.getByRole('combobox'));
      const searchInput = screen.getByPlaceholderText('Search...');
      
      fireEvent.change(searchInput, { target: { value: 'xyz' } });
      expect(screen.getByText('No options found')).toBeInTheDocument();
    });
  });

  // Group Functionality Tests
  describe('Group Functionality', () => {
    it('renders grouped options with headers', () => {
      render(<Select options={groupedOptions} />);
      
      fireEvent.click(screen.getByRole('combobox'));
      
      expect(screen.getByText('Group 1')).toBeInTheDocument();
      expect(screen.getByText('Group 2')).toBeInTheDocument();
    });

    it('maintains group structure when filtering', () => {
      render(<Select options={groupedOptions} isSearchable />);
      
      fireEvent.click(screen.getByRole('combobox'));
      const searchInput = screen.getByPlaceholderText('Search...');
      
      fireEvent.change(searchInput, { target: { value: 'Option 1' } });
      
      expect(screen.getByText('Group 1')).toBeInTheDocument();
      expect(screen.queryByText('Group 2')).not.toBeInTheDocument();
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('handles empty options array', () => {
      render(<Select options={[]} />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('Select...')).toBeInTheDocument();
      
      fireEvent.click(screen.getByRole('combobox'));
      expect(screen.getByText('No options found')).toBeInTheDocument();
    });

    it('handles extremely long option labels', () => {
      const longOptions = [
        { value: '1', label: 'A'.repeat(100) },
      ];
      
      render(<Select options={longOptions} />);
      
      fireEvent.click(screen.getByRole('combobox'));
      expect(screen.getByText('A'.repeat(100))).toBeInTheDocument();
    });

    it('handles special characters in option labels', () => {
      const specialOptions = [
        { value: '1', label: '!@#$%^&*()' },
        { value: '2', label: '<script>alert("test")</script>' },
      ];
      
      render(<Select options={specialOptions} />);
      
      fireEvent.click(screen.getByRole('combobox'));
      expect(screen.getByText('!@#$%^&*()')).toBeInTheDocument();
      expect(screen.getByText('<script>alert("test")</script>')).toBeInTheDocument();
    });

    it('handles rapid opening/closing', () => {
      render(<Select options={defaultOptions} />);
      const combobox = screen.getByRole('combobox');
      
      for (let i = 0; i < 10; i++) {
        fireEvent.click(combobox);
      }
      
      expect(screen.getAllByRole('option')).toHaveLength(defaultOptions.length);
    });

    it('maintains selection when options change', () => {
      const { rerender } = render(
        <Select
          options={defaultOptions}
          value="1"
        />
      );
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      
      const newOptions = [
        { value: '1', label: 'New Option 1' },
        { value: '4', label: 'Option 4' },
      ];
      
      rerender(<Select options={newOptions} value="1" />);
      expect(screen.getByText('New Option 1')).toBeInTheDocument();
    });

    it('handles disabled state properly', () => {
      render(<Select options={defaultOptions} isDisabled />);
      
      const combobox = screen.getByRole('combobox');
      expect(combobox).toHaveAttribute('aria-disabled', 'true');
      
      fireEvent.click(combobox);
      expect(screen.queryByRole('option')).not.toBeInTheDocument();
    });

    it('handles loading state', () => {
      render(<Select options={defaultOptions} isLoading />);
      expect(screen.getByRole('combobox')).toContainElement(
        document.querySelector('.animate-spin')
      );
    });
  });

  // Keyboard Navigation Tests
  describe('Keyboard Navigation', () => {
    it('opens dropdown on Enter', () => {
      render(<Select options={defaultOptions} />);
      const combobox = screen.getByRole('combobox');
      
      fireEvent.keyDown(combobox, { key: 'Enter' });
      expect(screen.getAllByRole('option')).toHaveLength(defaultOptions.length);
    });

    it('closes dropdown on Escape', () => {
      render(<Select options={defaultOptions} />);
      const combobox = screen.getByRole('combobox');
      
      fireEvent.click(combobox);
      fireEvent.keyDown(combobox, { key: 'Escape' });
      expect(screen.queryByRole('option')).not.toBeInTheDocument();
    });

    it('opens dropdown on ArrowDown', () => {
      render(<Select options={defaultOptions} />);
      const combobox = screen.getByRole('combobox');
      
      fireEvent.keyDown(combobox, { key: 'ArrowDown' });
      expect(screen.getAllByRole('option')).toHaveLength(defaultOptions.length);
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(<Select options={defaultOptions} aria-label="Test Select" />);
      
      const combobox = screen.getByRole('combobox');
      expect(combobox).toHaveAttribute('aria-label', 'Test Select');
      expect(combobox).toHaveAttribute('aria-expanded', 'false');
      expect(combobox).toHaveAttribute('aria-haspopup', 'listbox');
    });

    it('updates ARIA attributes when opened', () => {
      render(<Select options={defaultOptions} />);
      
      const combobox = screen.getByRole('combobox');
      fireEvent.click(combobox);
      
      expect(combobox).toHaveAttribute('aria-expanded', 'true');
    });

    it('marks options as selected correctly', () => {
      render(<Select options={defaultOptions} value="1" />);
      
      fireEvent.click(screen.getByRole('combobox'));
      const selectedOption = screen.getByText('Option 1').closest('[role="option"]');
      expect(selectedOption).toHaveAttribute('aria-selected', 'true');
    });
  });
});