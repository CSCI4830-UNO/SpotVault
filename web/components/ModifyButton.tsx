export default function ModifyButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{ 
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      className={`flex-1 text-white font-bold py-2 px-4 rounded transition-colors ${
        disabled
          ? "bg-gray-600"
          : "bg-blue-700 hover:bg-blue-600"
      }`}
    >
      MODIFY
    </button>
  );
}
