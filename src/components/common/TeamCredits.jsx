import { memo } from 'react';
import { FiX } from 'react-icons/fi';
import '../../styles/teamCredits.css';

const teamMembers = [
  { name: 'MANANGU, JANINE YZABEL C.', role: 'Frontend Developer' },
  { name: 'SARMIENTO, NOREEN R.', role: 'UI/UX Designer' },
  { name: 'SISON, KRISRAYAH M.', role: 'UI/UX Designer' },
  { name: 'CASTRO, KAYE CEE V.', role: 'Backend Developer' }
];

function TeamCredits({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="team-panel-backdrop" role="presentation" onMouseDown={onClose}>
      <aside className="team-panel" role="dialog" aria-modal="true" onMouseDown={event => event.stopPropagation()}>
        <button className="team-panel-close" type="button" onClick={onClose} aria-label="Close development team panel">
          <FiX size={18} />
        </button>
        <span className="team-panel-kicker">TDT POWERSTEEL SPS</span>
        <h2>System Development Team</h2>
        <div className="team-panel-list">
          {teamMembers.map(member => (
            <div className="team-member-card" key={member.name}>
              <strong>{member.name}</strong>
              <span>{member.role}</span>
            </div>
          ))}
        </div>
        <small className="team-panel-footer">© TDT Powersteel Corporation 2026</small>
      </aside>
    </div>
  );
}

export default memo(TeamCredits);
