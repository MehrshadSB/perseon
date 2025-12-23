import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/providers/ThemeProvider";

export function SwitchMode() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="btn">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="card">
        <DropdownMenuItem onClick={() => setTheme("light")}>روشن</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>تاریک</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>سیستم</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
