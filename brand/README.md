# BabarStudio — pack logo

Fichiers prêts à l'emploi pour le site, les réseaux, la vidéo et l'impression.
Les SVG sont vectoriels (taille infinie, poids minuscule) ; les PNG sont des
rendus à taille fixe pour les outils qui n'acceptent pas le SVG.

Couleurs de la marque :

- Ivoire `#f4efe6` (fond clair) · Encre `#1c1814` (texte / symbole sur clair)
- Sombre `#0f0c0a` (fond sombre) · Champagne `#d6c08a` (symbole / « Studio » sur sombre)
- Bronze `#946f28` (« Studio » sur clair) · Pétrole `#1f6b66` (accent)
- Sur fond sombre : Ivoire clair `#ece6dc` (texte « Babar »), Champagne `#d6c08a` (symbole, « Studio »), Pétrole clair `#2a8a83` (bas du symbole en bichrome)

## Symbole seul (la tête d'éléphant)

| Fichier | Contenu | Quand l'utiliser |
|---|---|---|
| `mark.svg` | Symbole monochrome, couleur héritée (`currentColor`) | Intégration web / code : prend la couleur du texte environnant |
| `mark-duotone-ivory.svg` | Symbole bichrome encre + pétrole, pour fond ivoire | Version « couleur » sur fond clair (print, documents, signature mail) |
| `mark-duotone-dark.svg` | Symbole bichrome champagne + pétrole, pour fond sombre | Version « couleur » sur fond sombre |
| `mark-ink-1024.png` | Symbole encre sur fond transparent, 1024 px | Sur fond clair quand le SVG n'est pas accepté ; filigrane vidéo sur image claire |
| `mark-champagne-1024.png` | Symbole champagne sur fond transparent, 1024 px | Sur fond sombre quand le SVG n'est pas accepté ; **filigrane vidéo** (à 20–40 % d'opacité dans un coin) |
| `mark-duotone-ivory-1024.png` | Bichrome encre + pétrole, transparent, 1024 px | Idem duotone-ivory en bitmap |
| `mark-duotone-dark-1024.png` | Bichrome champagne + pétrole, transparent, 1024 px | Idem duotone-dark en bitmap |
| `Logo-512.png` | Symbole champagne sur transparent, 512 px | Copie utilisée par le site (`/Logo.png`, logo déclaré à Google) |

## Logo complet (symbole + « BabarStudio »)

| Fichier | Contenu | Quand l'utiliser |
|---|---|---|
| `lockup.svg` | Symbole + mot en `currentColor`, « Studio » en bronze (`#946f28`, recolorable via `--studio`) | Intégration web / code |
| `lockup-ivory.svg` | Encre + « Studio » bronze, pour fond ivoire ou blanc | Papeterie, devis, factures, documents, **print** sur fond clair |
| `lockup-dark.svg` | Ivoire + « Studio » champagne, pour fond sombre | Génériques vidéo, print sur fond sombre |
| `lockup-duotone-ivory.svg` | Idem ivory avec le symbole bichrome (pétrole) | Variante colorée sur fond clair |
| `lockup-duotone-dark.svg` | Idem dark avec le symbole bichrome | Variante colorée sur fond sombre |
| `lockup-ivory-2000.png` | Rendu 2000 × 284 px, fond transparent, encre | Bitmap pour fond clair (Canva, Word, outils qui refusent le SVG) |
| `lockup-dark-2000.png` | Rendu 2000 × 284 px, fond transparent, ivoire/champagne | Bitmap pour fond sombre ; **générique de fin / intro vidéo** |

## Icônes et avatars

| Fichier | Contenu | Quand l'utiliser |
|---|---|---|
| `favicon-32.png` | Symbole encre sur tuile ivoire arrondie, 32 px | Favicon (petite taille) |
| `favicon-64.png` | Symbole encre sur tuile ivoire arrondie, 64 px | Favicon du site (copie en `/favicon.png`) |
| `apple-touch-icon-180.png` | Symbole champagne sur fond sombre, 180 px | Icône d'accueil iPhone / iPad (copie en `/apple-touch-icon.png`) |
| `icon-512.png` | Symbole champagne sur fond sombre, 512 px | Icône d'application / PWA, raccourci Android |
| `avatar-1024.png` | Symbole champagne sur fond sombre, 1024 px, carré | **Avatar réseaux sociaux** : YouTube, Instagram, LinkedIn, TikTok, Malt (les plateformes rognent en rond : le symbole est centré avec marge) |

## Signature e-mail

| Fichier | Contenu | Usage |
|---|---|---|
| `signature-banner.jpg` | Bannière 600 × 150 (symbole, nom, spécialités, portrait), hébergée sur babarstudio.fr | Bas de signature des e-mails (chargée par adresse, sans pièce jointe) |
| `signature.html` | Signature complète : nom, titre, site, e-mail et bannière | À ouvrir dans un navigateur, tout copier, puis coller dans Gmail > Paramètres > Signature |

## Conseils d'usage

- **Site** : `mark.svg` / `lockup.svg` en SVG ; le site utilise `/logo.svg` (symbole champagne) dans la barre de navigation.
- **Favicon** : `favicon-64.png` (tuile ivoire, lisible sur onglet clair comme sombre).
- **Avatar réseaux** : `avatar-1024.png`.
- **E-mails** : `signature.html` (mode d'emploi en tête du fichier) ; la tâche de prospection automatique ajoute la même signature.
- **Filigrane vidéo** : `mark-champagne-1024.png` (sur image sombre) ou `mark-ink-1024.png` (sur image claire), 20–40 % d'opacité, en bas à droite ; `lockup-dark-2000.png` pour les génériques.
- **Print** : toujours les SVG (`lockup-ivory.svg` sur fond clair, `lockup-dark.svg` sur fond sombre) ; les imprimeurs les acceptent et ils restent nets à toute taille. Pour un fichier bitmap, les PNG 2000 px conviennent jusqu'à ~17 cm de large à 300 dpi.
- Garder une marge libre autour du logo d'au moins la hauteur de l'œil de l'éléphant × 4 ; ne pas étirer, ne pas changer les couleurs hors de la palette ci-dessus.
