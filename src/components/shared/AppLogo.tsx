interface AppLogoProps {
  collapsed?: boolean;
}

export default function AppLogo({
  collapsed = false,
}: AppLogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-lg font-bold text-white">
        T
      </div>

      {!collapsed && (
        <div>
          <h1 className="text-lg font-bold leading-none">
            TnM Admin
          </h1>

          <p className="text-xs text-gray-500">
            Jewelry Management
          </p>
        </div>
      )}
    </div>
  );
}