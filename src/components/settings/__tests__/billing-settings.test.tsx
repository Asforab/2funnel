import { render, screen } from '@testing-library/react'
import BillingSettings from '../billing-settings'
import './test-utils'

describe('BillingSettings', () => {
  it('renders billing settings component correctly', () => {
    render(<BillingSettings />)
    
    // Verifica se o título está presente
    expect(screen.getByText('Billing Settings')).toBeInTheDocument()
    
    // Verifica se a descrição está presente
    expect(screen.getByText('Manage your billing information and subscriptions here.')).toBeInTheDocument()
  })
})