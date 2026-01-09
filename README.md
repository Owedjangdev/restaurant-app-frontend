# Delivery App Frontend

Une interface moderne et performante pour la gestion de livraisons géolocalisées, conçue pour les clients, les administrateurs et les livreurs.

## 🚀 Fonctionnalités

### 👤 Interface Client
- **Tableau de bord** : Vue globale des commandes actives et statistiques.
- **Nouvelle Commande** : Assistant multi-étapes avec sélection de lieu sur carte interactive.
- **Suivi en temps réel** : Visualisation de la position du livreur et statut de la livraison.
- **Historique** : Gestion complète des anciennes commandes.

### 🛡️ Interface Admin
- **Gestion des Commandes** : Attribution intelligente des livreurs aux nouvelles commandes.
- **Live Tracking** : Carte interactive affichant toutes les livraisons en cours.
- **Gestion des Utilisateurs** : Contrôle total sur les comptes clients et livreurs.
- **Statistiques (KPIs)** : Visualisation des performances journalières et mensuelles.

### 🚴 Interface Livreur
- **Dashboard Rider** : Liste des courses assignées et bouton de disponibilité.
- **Navigation Intégrée** : Guidage vers la destination avec calcul d'itinéraire.
- **Gestion du Statut** : Mise à jour en un clic (Démarrage, Livraison effectuée).
- **Historique de courses** : Suivi des performances et gains.

## 🛠️ Stack Technique

- **Frontend** : React 18, Vite
- **Styling** : Tailwind CSS (Design Premium & Mobile-First)
- **Gestion d'état** : Zustand
- **Cartographie** : Leaflet & React-Leaflet
- **Formulaires** : React Hook Form + Zod
- **Icônes** : Lucide React
- **Notifications** : React Hot Toast

## 📦 Installation

1. Clonez le dépôt
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```
4. Ouvrez votre navigateur à `http://localhost:5173`

## 🔐 Connexion (Mode Démonstration)

L'application fonctionne en **mode démonstration** sans besoin de serveur backend.

### Comptes de test disponibles :

**👤 Administrateur**
- Email: `admin@demo.com`
- Mot de passe: `admin123`

**🛍️ Client**
- Email: `client@demo.com`
- Mot de passe: `client123`

**🚴 Livreur**
- Email: `livreur@demo.com`
- Mot de passe: `livreur123`

### Créer un nouveau compte

Vous pouvez aussi créer un nouveau compte client via la page d'inscription. Exemple d'informations à utiliser :
- **Nom complet**: Jean Dupont
- **Téléphone**: +22997123456
- **Email**: jean.dupont@email.com
- **Adresse**: Quartier Akpakpa, Rue 123, Cotonou
- **Mot de passe**: monmotdepasse123

> **Note**: Les nouveaux comptes sont automatiquement des comptes **Client**. Pour tester les rôles Admin ou Livreur, utilisez les comptes de démonstration ci-dessus.

### Passer en mode production

Pour connecter à un vrai backend, modifiez `src/services/authService.js` :
```javascript
const USE_MOCK_AUTH = false; // Changer true en false
```

Puis configurez l'URL de l'API dans `.env` :
```
VITE_API_URL=http://votre-backend.com/api
```

## 📐 Architecture du Projet

- `src/components` : Composants réutilisables (UI, Cartes, Layouts).
- `src/pages` : Vues principales organisées par rôle.
- `src/services` : Couche d'interaction avec l'API (Axios).
- `src/store` : Gestion d'état global avec persistence.
- `src/hooks` : Logique personnalisée (Géo, Auth).
- `src/utils` : Constantes et fonctions utilitaires.
