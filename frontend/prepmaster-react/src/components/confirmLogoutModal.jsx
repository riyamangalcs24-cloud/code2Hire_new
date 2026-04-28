import { createPortal } from 'react-dom'

function ConfirmLogoutModal({ isOpen, onClose, onConfirm, userName }) {
  if (!isOpen) return null

  return createPortal(
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-card dialog-card-danger" onClick={(event) => event.stopPropagation()}>
        <div className="dialog-icon">
          <i className="fa-solid fa-right-from-bracket"></i>
        </div>
        <h2>Log out from code2hire?</h2>
        <p>
          {userName ? `${userName}, ` : ''}
          your progress stays saved. You can sign back in anytime to continue your prep.
        </p>
        <div className="dialog-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Stay logged in
          </button>
          <button type="button" className="btn-primary" onClick={onConfirm}>
            Yes, log me out
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default ConfirmLogoutModal