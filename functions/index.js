/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.updateUser = functions.https.onCall(async (data, context) => {
  // Check if the request is authenticated and has the correct privileges
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only admins can update other users"
    );
  }

  const { uid, email, password } = data;

  // Input validation
  if (!uid || !email || !password) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing required fields"
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Invalid email format"
    );
  }

  try {
    logger.info(`Updating user with UID: ${uid}`);
    await admin.auth().updateUser(uid, {
      email: email,
      password: password,
    });
    return { message: "User updated successfully" };
  } catch (error) {
    logger.error("Error updating user:", error);
    throw new functions.https.HttpsError("unknown", error.message, error);
  }
});
