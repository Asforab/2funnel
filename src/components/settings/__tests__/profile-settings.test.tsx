import { render, screen } from '@testing-library/react'
import { ProfileSettings } from '../profile-settings'
import './test-utils'

describe('ProfileSettings', () => {
  it('renders all profile sections correctly', () => {
    render(<ProfileSettings />)
    
    // Verifica se os títulos das seções estão presentes
    expect(screen.getByText('Foto de Perfil')).toBeInTheDocument()
    expect(screen.getByText('Informações Pessoais')).toBeInTheDocument()
    expect(screen.getByText('Endereço')).toBeInTheDocument()
    
    // Verifica se os campos de informações pessoais estão presentes
    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByLabelText('Sobrenome')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Telefone')).toBeInTheDocument()
    
    // Verifica se os campos de endereço estão presentes
    expect(screen.getByLabelText('Rua')).toBeInTheDocument()
    expect(screen.getByLabelText('Cidade')).toBeInTheDocument()
    expect(screen.getByLabelText('Estado')).toBeInTheDocument()
    expect(screen.getByLabelText('CEP')).toBeInTheDocument()
    expect(screen.getByLabelText('País')).toBeInTheDocument()
    
    // Verifica se os botões estão presentes
    expect(screen.getAllByText('Cancelar')).toHaveLength(2)
    expect(screen.getAllByText('Salvar Alterações')).toHaveLength(2)
  })
})