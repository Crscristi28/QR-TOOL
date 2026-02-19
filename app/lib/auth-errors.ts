import { FirebaseError } from "firebase/app";

type Translations = {
  auth: {
    errorInvalidEmail: string;
    errorUserDisabled: string;
    errorInvalidCredential: string;
    errorWrongPassword: string;
    errorEmailInUse: string;
    errorWeakPassword: string;
    errorTooManyRequests: string;
    errorEmailNotVerified: string;
    errorGeneric: string;
  };
};

export const getAuthErrorMessage = (error: unknown, t: Translations): string => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-email":
        return t.auth.errorInvalidEmail;
      case "auth/user-disabled":
        return t.auth.errorUserDisabled;
      case "auth/user-not-found":
      case "auth/invalid-credential":
        return t.auth.errorInvalidCredential;
      case "auth/wrong-password":
        return t.auth.errorWrongPassword;
      case "auth/email-already-in-use":
        return t.auth.errorEmailInUse;
      case "auth/weak-password":
        return t.auth.errorWeakPassword;
      case "auth/too-many-requests":
        return t.auth.errorTooManyRequests;
      case "auth/popup-closed-by-user":
        return "";
      default:
        return t.auth.errorGeneric;
    }
  }
  if (error instanceof Error && error.message === "auth/email-not-verified") {
    return t.auth.errorEmailNotVerified;
  }
  return t.auth.errorGeneric;
};
