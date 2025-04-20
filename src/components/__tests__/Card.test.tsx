import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Card from '../Card'

describe('Card Component', () => {
  const defaultProps = {
    title: 'Test Card',
    description: 'This is a test description',
  }

  it('renders basic card with title and description', () => {
    render(<Card {...defaultProps} />)
    
    expect(screen.getByText('Test Card')).toBeInTheDocument()
    expect(screen.getByText('This is a test description')).toBeInTheDocument()
  })

  it('renders image when imageUrl is provided', () => {
    const props = {
      ...defaultProps,
      imageUrl: '/test-image.jpg',
    }

    render(<Card {...props} />)
    
    const image = screen.getByRole('img')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/test-image.jpg')
    expect(image).toHaveAttribute('alt', 'Test Card')
  })

  it('renders tags when provided', () => {
    const props = {
      ...defaultProps,
      tags: ['React', 'TypeScript', 'Testing'],
    }

    render(<Card {...props} />)
    
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Testing')).toBeInTheDocument()
  })

  it('wraps content in Link component when href is provided', () => {
    const props = {
      ...defaultProps,
      href: '/test-link',
    }

    render(<Card {...props} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/test-link')
  })

  it('renders children content when provided', () => {
    render(
      <Card {...defaultProps}>
        <button>Test Button</button>
      </Card>
    )
    
    expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument()
  })

  it('applies custom className when provided', () => {
    const props = {
      ...defaultProps,
      className: 'custom-class',
    }

    render(<Card {...props} />)
    
    const card = screen.getByText('Test Card').closest('div')
    expect(card).toHaveClass('custom-class')
  })

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn()
    const props = {
      ...defaultProps,
      onClick: handleClick,
    }

    render(<Card {...props} />)
    
    const card = screen.getByText('Test Card').closest('div')
    fireEvent.click(card!)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('has correct hover and transition styles', () => {
    render(<Card {...defaultProps} />)
    
    const card = screen.getByText('Test Card').closest('div')
    expect(card).toHaveClass('hover:scale-[1.02]', 'transition-transform')
  })

  describe('Edge Cases', () => {
    it('handles extremely long titles and descriptions', () => {
      const longProps = {
        title: 'A'.repeat(100),
        description: 'B'.repeat(500),
      }
      
      render(<Card {...longProps} />)
      
      const title = screen.getByText('A'.repeat(100))
      const description = screen.getByText('B'.repeat(500))
      
      expect(title).toBeInTheDocument()
      expect(description).toBeInTheDocument()
      expect(title.closest('div')).toHaveClass('overflow-hidden')
    })

    it('handles empty tags array', () => {
      const props = {
        ...defaultProps,
        tags: [],
      }
      
      render(<Card {...props} />)
      const tagsContainer = screen.queryByRole('list')
      expect(tagsContainer).not.toBeInTheDocument()
    })

    it('handles undefined optional props', () => {
      render(<Card title="Test" description="Test" />)
      
      expect(screen.queryByRole('img')).not.toBeInTheDocument()
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
      expect(screen.queryByRole('list')).not.toBeInTheDocument()
    })

    it('handles special characters in title and description', () => {
      const specialProps = {
        title: '!@#$%^&*()_+ Test <script>alert("xss")</script>',
        description: '< > & " \' / \\ Test',
      }
      
      render(<Card {...specialProps} />)
      
      expect(screen.getByText(specialProps.title)).toBeInTheDocument()
      expect(screen.getByText(specialProps.description)).toBeInTheDocument()
    })

    it('handles invalid image URLs', () => {
      const props = {
        ...defaultProps,
        imageUrl: 'invalid-url',
      }
      
      render(<Card {...props} />)
      
      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('src', 'invalid-url')
      
      // Simulate image load error
      fireEvent.error(img)
      
      // Image should still be present but might show fallback
      expect(img).toBeInTheDocument()
    })

    it('handles multiple rapid click events', () => {
      const handleClick = jest.fn()
      const props = {
        ...defaultProps,
        onClick: handleClick,
      }
      
      render(<Card {...props} />)
      
      const card = screen.getByText('Test Card').closest('div')
      
      // Simulate rapid clicks
      fireEvent.click(card!)
      fireEvent.click(card!)
      fireEvent.click(card!)
      
      expect(handleClick).toHaveBeenCalledTimes(3)
    })

    it('handles nested interactive elements correctly', () => {
      const cardClick = jest.fn()
      const buttonClick = jest.fn()
      
      render(
        <Card {...defaultProps} onClick={cardClick}>
          <button onClick={buttonClick}>Nested Button</button>
        </Card>
      )
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(buttonClick).toHaveBeenCalledTimes(1)
      expect(cardClick).toHaveBeenCalledTimes(0) // Card click should not trigger
    })

    it('preserves custom class names while maintaining default styles', () => {
      const props = {
        ...defaultProps,
        className: 'custom-bg-color custom-padding',
      }
      
      render(<Card {...props} />)
      
      const card = screen.getByText('Test Card').closest('div')
      expect(card).toHaveClass(
        'custom-bg-color',
        'custom-padding',
        'bg-white',
        'rounded-lg'
      )
    })

    it('handles empty strings in required props', () => {
      const props = {
        title: '',
        description: '',
      }
      
      render(<Card {...props} />)
      
      // Should render empty but valid HTML
      const card = screen.getByRole('article') // Assuming we add role="article"
      expect(card).toBeInTheDocument()
      expect(card.textContent).toBe('')
    })
  })
}) 