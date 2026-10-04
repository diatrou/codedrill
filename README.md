# CodeDrill - Εφαρμογή Εκμάθησης & Εξάσκησης Κώδικα (Code Learning App)

Η **CodeDrill** είναι μία σύγχρονη web εφαρμογή (SPA) για την εκμάθηση και απομνημόνευση εντολών προγραμματισμού μέσω διαδραστικής εξάσκησης πληκτρολόγησης.

## 🚀 Τεχνολογικό Stack
- **React 18** & **TypeScript**
- **Vite** (Fast Build Tool)
- **Tailwind CSS** (Styling)
- **Lucide React** (Icons)
- **HTML5 Web Audio API** (Sound Effects)
- **LocalStorage API** (Persistent State)

## 🌟 Βασικά Χαρακτηριστικά
1. **Υβριδικά Modes Εξάσκησης:**
   - *Free Play / Continuous:* Ελεύθερη εξάσκηση με αυτόματη ανακύκλωση εντολών.
   - *Time Attack:* Αντίστροφη μέτρηση (60, 120 ή 300 δευτερόλεπτα).
   - *Fixed Target:* Στόχος συγκεκριμένου αριθμού επαναλήψεων (5, 10, 20 εντολές).
2. **Custom Code Editor:** Υποστήριξη `Tab` indentation, monospace γραμματοσειρά και exact string comparison.
3. **Πλήρες CRUD:** Διαχείριση Γλωσσών & Εντολών με αυτόματη διαγραφή συνδεδεμένων εντολών (Cascade Delete Confirmation).
4. **Export / Import:** Εξαγωγή και εισαγωγή των δεδομένων σε μορφή `.json`.
5. **Interactive UI:** Ηχητικά εφέ (με διακόπτη Toggle), Shuffle εντολών, Κουμπί Υπόδειξης (Hint/Solution), Στατιστικά επιτυχίας.

## 📦 Εγκατάσταση & Εκτέλεση

```bash
# Εγκατάσταση εξαρτήσεων
npm install

# Εκτέλεση σε περιβάλλον ανάπτυξης
npm run dev

# Build για παραγωγή
npm run build