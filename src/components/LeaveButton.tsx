interface LeaveButtonProps {
  isAllowed: boolean;
  hasCheckedIn: boolean;
  isLeave: boolean;
  onLeave: () => void;
}

export function LeaveButton({ isAllowed, hasCheckedIn, isLeave, onLeave }: LeaveButtonProps) {
  if (hasCheckedIn || isLeave) return null;

  return (
    <button 
      onClick={onLeave}
      className="btn-leave"
      disabled={!isAllowed}
    >
      🏕️ Ajukan Cuti/Izin
    </button>
  );
}
