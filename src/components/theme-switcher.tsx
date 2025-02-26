import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex justify-center items-center space-x-2">
      <ToggleGroup type="single" value={theme} onValueChange={setTheme}>
        <ToggleGroupItem value="light">
          Light
          <Sun />
        </ToggleGroupItem>
        <ToggleGroupItem value="dark">
          Dark
          <Moon />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
