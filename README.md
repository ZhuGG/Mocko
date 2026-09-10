# Mocko — Les racines éternelles

[Jouer](https://zhugg.github.io/Mocko/)

Jeu mobile passif et relaxant. Trois voies de croissance, spécialisations végétales, souhaits renouvelables, saisons et renaissances volontaires. Sauvegardes de la première version conservées.

## Développement

Les sources reproductibles et assets se trouvent dans `game-source/`.

```
cd game-source
npm ci
npm test
npm run build
node --test tools/offline.test.mjs
npm run dev
```

Pour publier, copier le contenu de `game-source/dist/` à la racine du dépôt en conservant `game-source/`. GitHub Pages sert la racine de `main`. Conserver les anciens bundles permet aux onglets déjà ouverts de terminer leur session avant rechargement.

Les licences des décors Kenney et animaux Quaternius sont conservées dans assets. Le personnage fourni reste inchangé. [Nouveautés](game-source/CHANGELOG.md).
