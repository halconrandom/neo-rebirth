import { useEffect, useState } from "react";

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen transition-colors duration-300 bg-white text-black dark:bg-zinc-900 dark:text-white">
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="absolute top-4 right-4 bg-gray-200 dark:bg-zinc-700 px-3 py-1 rounded text-sm"
      >
        {theme === "dark" ? "Modo Claro" : "Modo Oscuro"}
      </button>
      {children}
    </div>
  );
}
