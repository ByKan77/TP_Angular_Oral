# Rick & Morty Explorer

Application Angular (SPA) pour explorer les personnages, lieux et épisodes de l'API [Rick and Morty](https://rickandmortyapi.com). Projet de synthèse — formation Angular.

## Lancer le projet

```bash
cd rick-and-morty-explorer
npm install
npm start
```

Ouvrir **http://localhost:4200/**

Build production : `npm run build`

## Fonctionnalités réalisées

- [x] **5 modèles** (`Info`, `ApiResponse<T>`, `Character`, `Location`, `Episode`)
- [x] **5 services** (`CharacterService`, `LocationService`, `EpisodeService`, `FavorisService`, `StorageService`)
- [x] **10 pages** + routes + relations entre ressources
- [x] **Lazy loading** des routes `favoris` et `contact`
- [x] **Page 404**
- [x] **5 composants dumb** + **2 pipes**
- [x] Recherche RxJS (`debounceTime`, `distinctUntilChanged`, `switchMap`)
- [x] Pagination sur les 3 listes
- [x] Favoris persistants (`localStorage`)
- [x] Dashboard avec statistiques (`computed`)
- [x] Formulaire de contact (Reactive Forms + validateurs)
- [x] `OnPush`, `async` pipe, TypeScript strict, aucun `any`
- [x] **Bonus GraphQL** : liste des personnages via Apollo

## Captures d'écran

Placez vos captures dans le dossier `screenshots/` :

| Fichier | Contenu |
|---------|---------|
| `01-characters-list.png` | Liste paginée |
| `02-recherche-filtre.png` | Recherche + filtre status |
| `03-character-detail.png` | Fiche personnage |
| `04-relations.png` | Liens lieu + épisodes |
| `05-location-detail.png` | Résidents |
| `06-favoris.png` | Favori après rechargement |
| `07-dashboard.png` | Statistiques |
| `08-contact-erreurs.png` | Validation formulaire |
| `09-loading-erreur.png` | Loading / erreur |
| `10-arborescence.png` | Structure des dossiers |
| `11-graphql.png` | *(bonus)* Requête GraphQL |

## Design patterns utilisés

| Pattern | Où | Pourquoi |
|---------|-----|----------|
| **Singleton** | `providedIn: 'root'` sur les services | Une seule instance partagée (ex. `CharacterService`) |
| **Smart / Dumb** | Pages vs `CharacterCardComponent` | Les pages orchestrent les données ; les composants affichent |
| **Observer** | RxJS + `HttpClient` / Apollo | Flux asynchrones API |
| **State local** | `FavorisService` + `signal` | État réactif des favoris |
| **Repository-like** | Services `*Service` | Encapsulation des appels HTTP/GraphQL |
| **Lazy loading** | Routes `favoris`, `contact` | Réduction du bundle initial |

## Réponses aux questions

### 1. Composant smart vs dumb ?

Un composant **smart** gère la logique métier (services, état, routing) : par ex. `CharactersListComponent` qui enchaîne recherche, GraphQL et pagination. Un composant **dumb** reçoit des `input()` et émet des `output()` sans appeler d'API : `CharacterCardComponent` affiche un personnage et signale le clic favori au parent.

### 2. Pourquoi `OnPush` ? Lien avec l'immutabilité ?

`OnPush` limite la détection de changements aux entrées modifiées, événements et signaux. On ne re-vérifie pas tout l'arbre à chaque cycle. Cela fonctionne bien quand les données changent par **nouvelle référence** (immutabilité) ou via signaux/async pipe, ce qui évite des mises à jour inutiles.

### 3. Pourquoi `async` pipe plutôt qu'un `subscribe()` manuel ?

Le `async` pipe s'abonne et **se désabonne automatiquement** à la destruction du composant. Un `subscribe()` oublié provoque des fuites mémoire et des mises à jour sur un composant détruit (comportements fantômes, erreurs).

### 4. `providedIn: 'root'` : quel pattern ? Combien d'instances ?

C'est le pattern **Singleton** : Angular crée **une seule instance** de `CharacterService` pour toute l'application, injectée partout où elle est demandée.

### 5. `signal` vs `BehaviorSubject` ? Pourquoi un signal pour les favoris ?

Les deux stockent un état réactif. Le `signal` est intégré au framework (lecture simple, `computed`, pas de gestion manuelle de souscription). Pour des favoris locaux et synchrones, les signals sont plus légers qu'un `BehaviorSubject` + `async` pipe.

### 6. Recherche : pourquoi `switchMap` ? Rôle de `debounceTime` ?

`switchMap` **annule** la requête précédente si l'utilisateur tape encore : seule la dernière recherche compte (`mergeMap` empilerait les requêtes). `debounceTime(300)` attend 300 ms après la dernière frappe pour éviter un appel API à chaque touche.

### 7. Reactive Forms vs Template-driven ?

Le projet impose le **réactif** car la logique de validation est centralisée dans le `FormGroup` (testable, typée, contrôle fin des validateurs et du bouton désactivé). Le template-driven mélange logique et vue.

### 8. Comment récupérer les relations depuis les URLs ?

Les champs `episode`, `residents`, `characters` sont des **URLs**. On extrait l'id avec `url.split('/').filter(Boolean).pop()` (voir `utils/url-id.util.ts`), puis on appelle `getMany([ids])` sur le service concerné.

### 9. Lazy loading `favoris` et `contact` ?

Ces pages ne sont pas dans le bundle initial : leur code est chargé **à la demande** quand on navigue vers la route. Cela accélère le premier chargement de l'application.

### 10. *(Bonus)* GraphQL vs REST ?

En REST, lister un personnage avec lieu et épisodes demande plusieurs appels (`/character`, puis `/location/:id`, puis `/episode/:ids`). En GraphQL, une requête `characters { results { location { id name } episode { id name } } }` renvoie tout en **un seul aller-retour**, évitant l'under-fetching.

## Structure du projet

```
src/app/
├── components/   character-card, search-bar, paginator, loader, error-message
├── models/       info, api-response, character, location, episode
├── pages/        dashboard, lists, details, favoris, contact, not-found
├── pipes/        status, truncate
├── services/     character, location, episode, favoris, storage, character-graphql
├── utils/        url-id.util.ts
├── app.routes.ts
└── app.config.ts
```

## API utilisée

- REST : `https://rickandmortyapi.com/api/`
- GraphQL (bonus) : `https://rickandmortyapi.com/graphql`

---

*Projet réalisé dans le cadre du TP Projet Angular — Rick & Morty Explorer.*
