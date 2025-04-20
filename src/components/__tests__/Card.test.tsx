import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Card from '../Card'

describe('Card Component', () => {
  const defaultProps = {
    title: 'Test Card',
    description: 'Test description',
  }

  it('renders with required props', () => {
    render(<Card {...defaultProps} />)
    
    expect(screen.getByText('Test Card')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  it('renders image when imageUrl is provided', () => {
    const props = {
      ...defaultProps,
      imageUrl: 'https://example.com/image.jpg',
    }

    render(<Card {...props} />)
    
    const image = screen.getByAltText('Test Card')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
  })

  it('renders tags when provided', () => {
    const props = {
      ...defaultProps,
      tags: ['React', 'TypeScript', 'Next.js'],
    }

    render(<Card {...props} />)
    
    props.tags.forEach(tag => {
      expect(screen.getByText(tag)).toBeInTheDocument()
    })
  })

  it('renders as a link when href is provided', () => {
    const props = {
      ...defaultProps,
      href: '/test-page',
    }

    render(<Card {...props} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/test-page')
    expect(link).toContainElement(screen.getByText('Test Card'))
  })

  it('applies custom className', () => {
    const props = {
      ...defaultProps,
      className: 'custom-class',
    }

    render(<Card {...props} />)
    
    const card = screen.getByText('Test Card').closest('div')
    expect(card).toHaveClass('custom-class')
  })

  it('handles click events when not a link', () => {
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

  it('renders children content', () => {
    render(
      <Card {...defaultProps}>
        <button>Test Button</button>
      </Card>
    )
    
    expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument()
  })

  it('applies hover styles correctly', () => {
    render(<Card {...defaultProps} />)
    
    const card = screen.getByText('Test Card').closest('div')
    expect(card).toHaveClass('hover:scale-[1.02]')
  })

  it('renders with link and maintains card styling', () => {
    const props = {
      ...defaultProps,
      href: '/test-page',
      className: 'custom-class',
    }

    render(<Card {...props} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveClass('hover:opacity-90', 'transition-opacity')
    
    const card = screen.getByText('Test Card').closest('div')
    expect(card).toHaveClass('custom-class', 'bg-white', 'rounded-lg')
  })
}) 