import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                login: resolve(__dirname, "login.html"),
                register: resolve(__dirname, "register.html"),
                home: resolve(__dirname, "home.html"),
                explore: resolve(__dirname, "explore.html"),
                compose: resolve(__dirname, "compose_note.html"),
                card: resolve(__dirname, "single_note.html"),
                profile: resolve(__dirname, "user_profile.html"),
                me: resolve(__dirname, "settings.html"),
                search: resolve(__dirname, "search.html"),
                collection: resolve(__dirname, "collection.html"),
            },
        },
    },
});
