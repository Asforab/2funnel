import { render, screen } from '@testing-library/react'
import SecuritySettings from '../security-settings'
import './test-utils'

describe('SecuritySettings', () => {
  it('renders security settings component correctly', () => {
    render(<SecuritySettings />)
    
    // Verifica se o título está presente
    expect(screen.getByText('Security Settings')).toBeInTheDocument()
    
    // Verifica se a descrição está presente
    expect(screen.getByText('Manage your password, two-factor authentication, and other security settings here.')).toBeInTheDocument()
  })
})