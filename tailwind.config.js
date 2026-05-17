/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        swish: {
          cream: "#F5F2EC",
          paper: "#FBF9F4",
          card: "#FFFFFF",
          ink: "#1C1A17",
          ink2: "#3A3631",
          muted: "#8B857B",
          hairline: "#E8E2D4",
          sage: "#6B8E5A",
          "sage-soft": "#E4ECDB",
          coral: "#D67A5F",
          "coral-soft": "#F4DDD2",
          butter: "#E8C16A",
        },
      },
    },
  },
  plugins: [],
};
