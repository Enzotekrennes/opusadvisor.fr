# Fonts

Loaded by `app/layout.tsx` with `next/font/local`. They are stored here so that the build never downloads fonts from Google Fonts. A network failure during that download used to break the deployment (`next/font` error, November 2026).

| File | Font | Version | Coverage | Weight axis |
|---|---|---|---|---|
| `inter-latin.woff2` | Inter | 4.001 | Google Fonts `latin` subset | 100 to 900 |

The file is the exact file that `next/font/google` served on 17 November 2026, taken from the build output. Headings used Bricolage Grotesque until the redesign of November 2026; since then the whole site is set in Inter.

The `latin` subset covers French, including Œ, œ, the euro sign and typographic quotes and dashes. Characters outside it, such as arrows, render with the fallback system font, as they did before.

## Licence

Inter is released under the SIL Open Font License 1.1 (https://openfontlicense.org). The copyright notice and licence reference are kept in the file's metadata.

- Inter: Copyright 2016 The Inter Project Authors (https://github.com/rsms/inter)
