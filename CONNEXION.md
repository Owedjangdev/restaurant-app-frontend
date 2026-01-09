# 🚀 Application de Livraison - Guide de Connexion

## 🔐 Comptes de Démonstration

L'application est configurée en **mode démonstration** et ne nécessite pas de serveur backend pour fonctionner.

### Identifiants de Connexion

#### 👤 Administrateur
- **Email:** `admin@demo.com`
- **Mot de passe:** `admin123`
- **Accès:** Tableau de bord admin, gestion des commandes, gestion des utilisateurs, paramètres

#### 🛍️ Client
- **Email:** `client@demo.com`
- **Mot de passe:** `client123`
- **Accès:** Créer des commandes, suivre les livraisons, historique des commandes

#### 🚴 Livreur
- **Email:** `livreur@demo.com`
- **Mot de passe:** `livreur123`
- **Accès:** Voir les livraisons disponibles, gérer les livraisons en cours, historique

## 🚀 Démarrage Rapide

1. **Installer les dépendances:**
   ```bash
   npm install
   ```

2. **Lancer l'application:**
   ```bash
   npm run dev
   ```

3. **Ouvrir dans le navigateur:**
   - L'application s'ouvrira automatiquement à `http://localhost:5173`
   - Vous serez redirigé vers la page de connexion
   - Utilisez l'un des comptes de démonstration ci-dessus

## 🔄 Passer en Mode Production (avec Backend)

Pour connecter l'application à un vrai serveur backend:

1. **Modifier le fichier** `src/services/authService.js`:
   ```javascript
   const USE_MOCK_AUTH = false; // Changer true en false
   ```

2. **Configurer l'URL de l'API** dans `.env`:
   ```
   VITE_API_URL=http://votre-serveur-backend.com/api
   ```

## 📝 Fonctionnalités Disponibles

- ✅ Authentification multi-rôles (Admin, Client, Livreur)
- ✅ Tableau de bord personnalisé par rôle
- ✅ Gestion des commandes
- ✅ Suivi en temps réel avec cartes interactives
- ✅ Interface responsive et moderne
- ✅ Notifications toast

## 🛠️ Technologies Utilisées

- React 19
- React Router v7
- Zustand (state management)
- React Hook Form + Zod (validation)
- Leaflet (cartes)
- Tailwind CSS
- Vite

## 📞 Support

Pour toute question ou problème, consultez la documentation ou contactez l'équipe de développement.
