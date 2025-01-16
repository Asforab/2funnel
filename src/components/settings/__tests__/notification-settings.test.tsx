import { render, screen } from '@testing-library/react'
import NotificationSettings from '../notification-settings'
import './test-utils'

describe('NotificationSettings', () => {
  it('renders notification settings component correctly', () => {
    render(<NotificationSettings />)
    
    // Verifica se o título está presente
    expect(screen.getByText('Notification Settings')).toBeInTheDocument()
    
    // Verifica se a descrição está presente
    expect(screen.getByText('Configure your notification preferences here.')).toBeInTheDocument()
  })
})