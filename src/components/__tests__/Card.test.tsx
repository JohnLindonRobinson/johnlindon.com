import { render, screen, fireEvent } from '@testing-library/react'
import Card from '../Card'

describe('Card Component', () => {
  it('renders with default props', () => {
    render(<Card title="Test Title" description="Test Description">Test Content</Card>)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <Card 
        title="Test Title" 
        description="Test Description" 
        className="custom-class"
      >
        Content
      </Card>
    )
    const card = screen.getByText('Content').closest('div')
    expect(card?.parentElement).toHaveClass('custom-class')
  })

  it('handles click events when clickable', () => {
    const handleClick = jest.fn()
    render(
      <Card 
        title="Test Title" 
        description="Test Description" 
        onClick={handleClick} 
        className="cursor-pointer"
      >
        Clickable Content
      </Card>
    )
    const card = screen.getByText('Clickable Content').closest('div')
    fireEvent.click(card as HTMLElement)
    expect(handleClick).toHaveBeenCalled()
  })

  it('renders with link wrapper when href is provided', () => {
    render(
      <Card 
        title="Test Title" 
        description="Test Description" 
        href="/test-link"
      >
        Link Content
      </Card>
    )
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/test-link')
  })

  it('renders tags when provided', () => {
    const tags = ['React', 'TypeScript', 'Testing']
    render(
      <Card 
        title="Test Title" 
        description="Test Description"
        tags={tags}
      />
    )
    tags.forEach(tag => {
      expect(screen.getByText(tag)).toBeInTheDocument()
    })
  })

  it('renders image when imageUrl is provided', () => {
    render(
      <Card 
        title="Test Title" 
        description="Test Description"
        imageUrl="/test-image.jpg"
      />
    )
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('src', '/test-image.jpg')
    expect(image).toHaveAttribute('alt', 'Test Title')
  })
}) 