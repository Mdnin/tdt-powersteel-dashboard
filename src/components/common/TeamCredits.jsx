import { memo } from 'react';
import { X } from 'lucide-react';
import '../../styles/teamCredits.css';

function TeamCredits({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="team-panel-backdrop" role="presentation" onMouseDown={onClose}>
      <aside className="team-panel" role="dialog" aria-modal="true" onMouseDown={event => event.stopPropagation()}>
        <button className="team-panel-close" type="button" onClick={onClose} aria-label="Close development team panel">
          <X size={18} />
        </button>
        <span className="team-panel-kicker">TDT POWERSTEEL SPS</span>
        <h2>System Development Team</h2>
        <div className="team-panel-list">
          <div className="team-member-card">
            <strong>UI / UX Design</strong>
            <span>Enterprise Interface & Interaction Polish</span>
          </div>
          <div className="team-member-card">
            <strong>System Engineering</strong>
            <span>Workflow, Profile & Live Sync Integration</span>
          </div>
          <div className="team-member-card">
            <strong>Data Experience</strong>
            <span>Analytics, Export & Presentation Support</span>
          </div>
        </div>
        <small className="team-panel-footer">© TDT Powersteel Corporation 2026</small>
      </aside>
    </div>
  );
}

export default memo(TeamCredits);
