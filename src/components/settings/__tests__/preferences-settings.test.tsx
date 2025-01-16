import { render, screen } from '@testing-library/react'
import PreferencesSettings from '../preferences-settings'
import './test-utils'

describe('PreferencesSettings', () => {
  it('renders preferences settings component correctly', () => {
    render(<PreferencesSettings />)
    
    // Verifica se o título está presente
    expect(screen.getByText('Preferences Settings')).toBeInTheDocument()
    
    // Verifica se a descrição está presente
    expect(screen.getByText('Customize your theme, language, and other preferences here.')).toBeInTheDocument()
  })
})