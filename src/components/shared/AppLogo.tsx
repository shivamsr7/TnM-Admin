import logo from "@/assets/logo.png";

interface AppLogoProps {
  collapsed?: boolean;
}

export default function AppLogo({
  collapsed = false,
}: AppLogoProps) {
  return (
    <div className="flex items-center justify-center">
      <img
        src={logo}
        alt="TnM Jewels"
        className={
          collapsed
            ? "h-12 w-12 object-contain"
            : "h-16 w-auto object-contain"
        }
      />
    </div>
  );
}