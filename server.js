import express from "express";
import admin from "firebase-admin";
import jwt from "jsonwebtoken";
import cors from "cors";
// Import the service account key
import serviceAccount from "./serviceAccountKey.js";

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://hen-and-heaven-ts-b12fe-default-rtdb.asia-southeast1.firebasedatabase.app",
});

const db = admin.firestore();
const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your client's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // Parse incoming requests with JSON payloads

// JWT secret key (store this securely, preferably in an environment variable)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";


// Login endpoint
app.post("/api/login", async (req, res) => {
  try {
    const { uid, email } = req.body;

    // Verify the user exists in Firebase
    const userRecord = await admin.auth().getUser(uid);

    if (!userRecord) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if email is verified
    if (!userRecord.emailVerified) {
      return res.status(403).json({ error: "Email not verified" });
    }

    // Get additional user data from Firestore
    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User data not found" });
    }

    const userData = userDoc.data();

    // Check if the user account is active
    if (userData.status !== "active") {
      return res.status(403).json({ error: "Account is not active" });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        uid: uid,
        name: userData.fullName,
        email: email,
        role: userData.userRole,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send the token and user data back to the client
    res.json({
      token,
      userData: {
        uid,
        email,
        fullName: userData.fullName,
        userRole: userData.userRole,
        // Add any other necessary user data
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
