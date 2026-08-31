import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// If you deploy to https://<username>.github.io/<repo-name>/ (a project site),
// set base to '/<repo-name>/'. If you deploy to https://<username>.github.io/
// (a user/org site, repo named <username>.github.io), set base to '/'.
export default defineConfig({
  plugins: [react()],
  base: "/cuebuddy",
});
