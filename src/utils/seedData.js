import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export const generateDemoTrip = async (userId) => {
    if (!userId) return;

    const tripsRef = collection(db, 'trips');
    const expensesRef = collection(db, 'expenses');

    // Create Trip
    const tripDoc = await addDoc(tripsRef, {
        userId,
        name: "London Tech Conference",
        description: "Q1 Strategy Meeting & Conference",
        startDate: new Date(), // Today
        endDate: new Date(new Date().setDate(new Date().getDate() + 5)), // 5 days from now
        budget: "3000",
        status: "active",
        isActive: true, // Legacy compatibility if needed
        createdAt: serverTimestamp()
    });

    const tripId = tripDoc.id;

    // Create Expenses
    const expenses = [
        {
            tripId,
            merchant: "British Airways",
            amount: "450.00",
            category: "flight",
            date: new Date(new Date().setDate(new Date().getDate() - 2)), // 2 days ago
            description: "Flight LHR - SFO",
        },
        {
            tripId,
            merchant: "The Hoxton Hotel",
            amount: "850.00",
            category: "accommodation",
            date: new Date(new Date().setDate(new Date().getDate() - 1)),
            description: "3 nights stay",
        },
        {
            tripId,
            merchant: "Nando's",
            amount: "45.50",
            category: "food",
            date: new Date(),
            description: "Team lunch",
        },
        {
            tripId,
            merchant: "Uber",
            amount: "24.00",
            category: "transport",
            date: new Date(),
            description: "Ride to airport",
        }
    ];

    let totalAmount = 0;
    for (const exp of expenses) {
        totalAmount += parseFloat(exp.amount) || 0;
        await addDoc(expensesRef, {
            ...exp,
            userId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
    }

    // Update trip with total
    const { updateDoc, doc } = await import('firebase/firestore');
    await updateDoc(doc(db, 'trips', tripId), {
        totalSpent: totalAmount
    });

    return tripId;
};
