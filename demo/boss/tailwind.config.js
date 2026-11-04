// TODO: inferred from build
// Исходный конфиг утерян. Значения gray выведены из скомпилированного preflight:
// border-color #eaecf0 (gray.200) и placeholder #98a2b3 (gray.400).
// safelist: классы есть в CSS сборки, но в JS сборки их нет (код, вероятно, удалён tree-shaking).
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  safelist: ["mt-2", "text-red-500", "filter"],
  theme: {
    extend: {
      colors: {
        gray: {
          200: "#eaecf0",
          400: "#98a2b3",
        },
      },
    },
  },
  plugins: [],
};
