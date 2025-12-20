import { SwitchMode } from "./SwitchTheme";

interface ProfileCardProps {
  name: string;
  email: string;
  avatarUrl?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ name, email, avatarUrl }) => {
  return (
    <div className="flex items-center gap-3 p-3 mt-auto border-t border-gray-100 transition-colors cursor-pointer">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border border-blue-200">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-blue-600 font-bold text-sm">{name.charAt(0)}</span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col overflow-hidden text-right">
        <span className="text-sm font-semibold truncate">{name}</span>
        <span className="text-xs text-gray-500 truncate font-mono">{email}</span>
      </div>

      {/* Logout or Menu Icon (Optional) */}
      <div className="mr-auto text-gray-400">
        <SwitchMode />
      </div>
    </div>
  );
};
