import { GraduationCap } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Logo() {
  return (
    <Link className="brand" to="/docs/introduction/welcome" aria-label="枣庄三中校园指南首页">
      <span className="brand-mark"><GraduationCap size={22} strokeWidth={2.2} /></span>
      <span className="brand-copy">
        <strong>枣庄三中</strong>
        <small>校园指南</small>
      </span>
    </Link>
  )
}
