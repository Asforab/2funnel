'use client'
import PipelineForm from '@/components/forms/pipeline-form'
import CustomModal from '@/components/global/custom-modal'
import { useRouter } from 'next/navigation'

interface PipelineModalProps {
  params: {
    subaccountId: string
  }
}

const PipelineModal: React.FC<PipelineModalProps> = ({ params }) => {
  const router = useRouter()

  return (
    <CustomModal>
      <PipelineForm subAccountId={params.subaccountId} />
    </CustomModal>
  )
}

export default PipelineModal