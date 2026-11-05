import logoSrc from "@/assets/uyim-logo.jpg";

// Brand logo + wordmark (recovered from the build).
type AppLogoSize = "sm" | "md";

const SIZE_CLASS: Record<AppLogoSize, string> = {
  sm: "h-7 w-7 rounded-lg",
  md: "h-8 w-8 rounded-xl",
};

export const AppLogo = ({ size = "sm", suffix = "dev" }: { size?: AppLogoSize; suffix?: string }) => (
  <div className="flex items-center gap-2.5">
    <img src={logoSrc} alt="Uyim" className={`${SIZE_CLASS[size]} object-cover`} />
    <p className="text-[15px] font-semibold tracking-tight text-content">
      Uyim <span className="font-medium text-content-muted">· {suffix}</span>
    </p>
  </div>
);
