import type { CodyNotice } from '@sourcegraph/cody-shared'
import type { UserAccountInfo } from '../Chat'

interface NoticesProps {
    user: UserAccountInfo
    instanceNotices: CodyNotice[]
}

export const Notices: React.FC<NoticesProps> = ({ user, instanceNotices }) => {
    // For local development with Ollama, hide all notices
    return null
}
