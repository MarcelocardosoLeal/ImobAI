import type { StrapiApp } from "@strapi/strapi/admin";
import Logo from "./extensions/logo.png";

export default {
  config: {
    locales: ["pt-BR"],
    auth: {
      logo: Logo,
    },
    menu: {
      logo: Logo,
    },
    translations: {
      en: {
        "Auth.form.welcome.title": "Cafeteria Code",
        "Auth.form.welcome.subtitle": "Welcome to app!",
      },
      "pt-BR": {
        "Auth.form.welcome.title": "Cafeteria Code",
        "Auth.form.welcome.subtitle": "Seja bem vindo!",
      },
    },
  },
  bootstrap(app: StrapiApp) {
    console.log(app);
  },
};
