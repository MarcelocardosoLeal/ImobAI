export default {
  routes: [
    {
      method: "POST",
      path: "/import/imovels",
      handler: "integration.importImovels",
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/import/leads",
      handler: "integration.importLeads",
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/export/imovels",
      handler: "integration.exportImovels",
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
}