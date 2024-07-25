// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { firebaseConfig } from "./constants/firebase-config";
import * as Notifications from "./elements/notifications";
import { createErrorMessage, isDevEnvironment } from "./utils/misc";
import { getAuth, User, Auth as AuthType } from "firebase/auth";

// Initialize Firebase
export let app: FirebaseApp | undefined;
export let Auth: AuthType | undefined;

export function isAuthenticated(): boolean {
  return Auth?.currentUser !== undefined && Auth?.currentUser !== null;
}

export function getAuthenticatedUser(): User {
  const user = Auth?.currentUser;
  if (user === undefined || user === null)
    throw new Error(
      "User authentication is required but no user is logged in."
    );
  return user;
}

try {
  app = initializeApp(firebaseConfig);
  Auth = getAuth(app);
  console.log("### init ", Auth.currentUser);
} catch (e) {
  app = undefined;
  Auth = undefined;
  console.error("Authentication failed to initialize", e);
  if (isDevEnvironment()) {
    Notifications.addPSA(
      createErrorMessage(e, "Authentication uninitialized") +
        " Check your firebase-config.ts",
      0,
      undefined,
      false
    );
  }
}
