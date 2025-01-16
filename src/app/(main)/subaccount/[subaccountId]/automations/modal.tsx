'use client'
import AutomationForm from '@/components/forms/automation-form'
import CustomModal from '@/components/global/custom-modal'
import { useRouter } from 'next/navigation'

interface AutomationModalProps {
  params: {
    subaccountId: string
  }
}

const AutomationModal: React.FC<AutomationModalProps> = ({ params }) => {
  const router = useRouter()

  return (
    <CustomModal>
      <AutomationForm subAccountId={params.subaccountId} />
    </CustomModal>
  )
}

export default AutomationModal