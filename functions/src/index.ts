const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.addDailyEggCollection = functions.pubsub
  .schedule("59 23 * * *")
  .onRun(async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayString = today.toISOString().split("T")[0];

    const docRef = admin
      .firestore()
      .collection("egg-collections")
      .doc(todayString);
    const doc = await docRef.get();

    if (!doc.exists) {
      await docRef.set({
        date: admin.firestore.Timestamp.fromDate(today),
        collection: {
          "Standard White Eggs": 100,
          "Standard Brown Eggs": 100,
          "Furnished / Enriched / Nest-Laid Eggs": 75,
          "Vitamin-Enhanced Eggs": 75,
          "Vegetarian Eggs": 75,
          "Processed Eggs": 75,
        },
      });
    }

    return null;
  });
