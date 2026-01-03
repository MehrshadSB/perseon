import { useTheme } from "@/providers/ThemeProvider";
import { ThemeSwitcher } from "./ui/theme-switcher";

export function SwitchMode() {
  const { theme, setTheme } = useTheme();

  return <ThemeSwitcher defaultValue="system" onChange={setTheme} value={theme} />;
}
