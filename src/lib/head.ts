export const appHead = (title: string, description: string) => () => ({
  meta: [
    { title: `${title} — Mainframe Control Tower` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} — Mainframe Control Tower` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ],
});
