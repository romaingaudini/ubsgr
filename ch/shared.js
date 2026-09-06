// 1. Configuration Firebase - Nouvelle Application
const firebaseConfig = {
    apiKey: "AIzaSyBr4Gs9IHG0oJq_a7maiwR9pJI7UOMZK9M",
    authDomain: "gemn-80854.firebaseapp.com",
    projectId: "gemn-80854",
    storageBucket: "gemn-80854.firebasestorage.app",
    messagingSenderId: "80542512205",
    appId: "1:80542512205:web:5af32b550354ddd70a1804"
};

// Initialisation de Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// 2. Fonction d'initialisation automatique des 7 comptes
const autoInitDatabase = async () => {
    try {
        const usersRef = db.collection("users");
        const snapshot = await usersRef.limit(1).get();

        // Si la collection est vide dans Firestore, on crée les comptes
        if (snapshot.empty) {
            console.log("Initialisation de la base de données Firestore...");
            const initialUsers = [
                { clientCode: "admin01", pin: "000000", name: "ADMINISTRATEUR", solde: 0, isAdmin: true, history: [], beneficiaries: [], rib: "ADMIN-000" },
                { clientCode: "11111111", pin: "111111", name: "TIMO VAN NEERDEN", solde: 80.00, isAdmin: false, history: [], beneficiaries: [], rib: "FR76 3000 6000 1111 1111 1111 11" },
                { clientCode: "22222222", pin: "222222", name: "MARIE DUPONT", solde: 1500.50, isAdmin: false, history: [], beneficiaries: [], rib: "FR76 3000 6000 2222 2222 2222 22" },
                { clientCode: "33333333", pin: "333333", name: "JEAN MARTIN", solde: 450.00, isAdmin: false, history: [], beneficiaries: [], rib: "FR76 3000 6000 3333 3333 3333 33" },
                { clientCode: "44444444", pin: "444444", name: "LUCIE BERNARD", solde: 25.00, isAdmin: false, history: [], beneficiaries: [], rib: "FR76 3000 6000 4444 4444 4444 44" },
                { clientCode: "55555555", pin: "555555", name: "PAUL DURAND", solde: 3200.00, isAdmin: false, history: [], beneficiaries: [], rib: "FR76 3000 6000 5555 5555 5555 55" },
                { clientCode: "66666666", pin: "666666", name: "SOPHIE PETIT", solde: 980.20, isAdmin: false, history: [], beneficiaries: [], rib: "FR76 3000 6000 6666 6666 6666 66" }
            ];

            for (const user of initialUsers) {
                // On utilise le clientCode comme ID de document unique
                await usersRef.doc(user.clientCode).set(user);
            }
            console.log("Les 7 comptes ont été créés dans Firestore.");
        }
    } catch (error) {
        console.error("Erreur initialisation Firestore:", error);
    }
};

// Lancement immédiat de l'initialisation
autoInitDatabase();

// 3. Fonctions de formatage
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'EUR' 
    }).format(amount);
};

const getInitials = (name) => {
    if (!name) return "--";
    // Récupère la première lettre de chaque mot (Prénom Nom)
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
};

// 4. Sécurité et Authentification (Référence Firestore dynamique)
const checkAuth = async () => {
    // Récupère le code stocké lors de la connexion dans index.html
    const clientCode = localStorage.getItem("currentClientCode"); 
    
    if (!clientCode) {
        window.location.href = "index.html";
        return null;
    }

    try {
        // Recherche DIRECTE dans Firestore avec l'ID du document
        const doc = await db.collection("users").doc(clientCode).get();
        
        if (doc.exists) {
            return doc.data(); // Renvoie les données réelles de l'utilisateur connecté
        } else {
            // Si le code dans le stockage local n'existe pas dans Firestore
            localStorage.removeItem("currentClientCode");
            window.location.href = "index.html";
            return null;
        }
    } catch (error) {
        console.error("Erreur accès Firestore:", error);
        return null;
    }
};

const logout = () => {
    localStorage.removeItem("currentClientCode");
    window.location.href = "index.html";
};