export default function SettingsButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 text-white font-bold py-2 px-4 rounded transition-colors ${
        disabled
          ? "bg-gray-600 cursor-not-allowed"
          : "bg-green-700 hover:bg-green-600"
      }`}
    >
      SETTINGS
    </button>
  );
}