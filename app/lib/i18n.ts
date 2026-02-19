import { useState, useEffect } from 'react';

// --- DEFINICE JAZYKŮ ---
export const LANGUAGES = {
  auto: "Auto (System)",
  cs: "Čeština",
  sk: "Slovenština",
  en: "English",
  de: "Deutsch",
  pl: "Polski",
  ro: "Română",
  hu: "Magyar",
  es: "Español",
  fr: "Français",
  it: "Italiano",
  pt: "Português",
  ru: "Русский",
  uk: "Українська",
  tr: "Türkçe",
  vi: "Tiếng Việt",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
  ar: "العربية"
};

export type LanguageCode = keyof typeof LANGUAGES;

// --- ČEŠTINA (DEFAULT) ---
const cs = {
  common: {
    back: "Zpět",
    save: "Uložit",
    delete: "Smazat",
    cancel: "Zrušit",
    download: "Stáhnout",
    share: "Sdílet",
    edit: "Upravit",
    yes: "Ano",
    no: "Ne",
    loading: "Načítání...",
    or: "nebo",
    unknown: "Neznámý",
    error: "Chyba",
    group: "Skupina"
  },
  tabs: {
    generate: "Generovat",
    scan: "Skenovat",
    library: "Knihovna",
    settings: "Nastavení"
  },
  header: {
    title: "QR Tool",
    subtitle: "Všechny vaše kódy na jednom místě.",
    create: "Vytvořit nový kód",
    edit: "Upravit kód",
    scan: "Zaměřit kameru",
    library: "Uložené kódy",
    settings: "Předvolby aplikace"
  },
  auth: {
    loginTitle: "QR Tool",
    loginSubtitle: "Všechny vaše kódy na jednom místě.",
    googleLogin: "Přihlásit se přes Google",
    emailLabel: "Email",
    passwordLabel: "Heslo",
    confirmPasswordLabel: "Potvrzení hesla",
    loginButton: "Přihlásit se",
    forgotPassword: "Zapomenuté heslo?",
    noAccount: "Nemáte účet?",
    registerLink: "Registrovat se",
    backToLogin: "← Zpět na přihlášení",
    registerTitle: "Vytvořit účet",
    registerSubtitle: "Zadejte údaje pro registraci",
    registerButton: "Registrovat se",
    resetTitle: "Obnovení hesla",
    resetSubtitle: "Zadejte email spojený s vaším účtem a my vám zašleme odkaz pro vytvoření nového hesla.",
    resetButton: "Odeslat odkaz pro reset hesla",
    emailPlaceholder: "vas@email.com",
    passwordPlaceholder: "••••••••",
    errorInvalidEmail: "Neplatná emailová adresa.",
    errorUserDisabled: "Tento účet byl zablokován.",
    errorInvalidCredential: "Nesprávný email nebo heslo.",
    errorWrongPassword: "Nesprávné heslo.",
    errorEmailInUse: "Tento email je již registrován.",
    errorWeakPassword: "Heslo musí mít alespoň 6 znaků.",
    errorTooManyRequests: "Příliš mnoho pokusů. Zkuste to později.",
    errorGeneric: "Něco se pokazilo. Zkuste to znovu.",
    errorFillFields: "Vyplňte všechna pole.",
    errorPasswordMismatch: "Hesla se neshodují.",
    errorReauthRequired: "Pro smazání účtu se nejdříve znovu přihlaste.",
    errorEmailNotVerified: "Nejdříve ověřte svůj email. Zkontrolujte schránku.",
    resetSent: "Odkaz pro reset hesla byl odeslán na váš email.",
    verifyTitle: "Ověřte svůj email",
    continueButton: "Pokračovat",
    verificationSent: "Na váš email jsme odeslali ověřovací odkaz. Klikněte na něj a poté se přihlaste."
  },
  generate: {
    types: {
      text: "Text",
      url: "URL",
      wifi: "WiFi",
      password: "Heslo",
      vcard: "Vizitka"
    },
    labels: {
      text: "Zadejte text",
      url: "Zadejte URL",
      wifiSsid: "Název sítě (SSID)",
      wifiPassword: "Heslo WiFi",
      security: "Typ zabezpečení",
      username: "Uživatelské jméno / Login",
      password: "Heslo",
      groupName: "Název skupiny / Služby",
      entryName: "Název záznamu",
      firstName: "Jméno",
      lastName: "Příjmení",
      phone: "Telefon",
      email: "Email",
      web: "Web",
      company: "Firma",
      jobTitle: "Pozice"
    },
    placeholders: {
      text: "Např. poznámka, adresa...",
      url: "https://",
      wifiSsid: "Název vaší WiFi",
      wifiPassword: "Heslo sítě",
      username: "např. email@example.com",
      password: "Vaše heslo",
      groupName: "např. Netflix",
      entryName: "Pojmenujte tento kód",
      firstName: "Jan",
      lastName: "Novák",
      phone: "+420 123 456 789",
      email: "jan@example.com",
      web: "https://example.com",
      company: "Firma s.r.o.",
      jobTitle: "Developer"
    },
    buttons: {
      scanVcard: "Naskenovat celou vizitku (AI)",
      scanningVcard: "Skenuji vizitku...",
      takePhoto: "Vyfotit",
      uploadPhoto: "Nahrát fotku",
      addOptional: "+ Přidat další údaj",
      removeOptional: "Odebrat",
      generateNew: "Generovat nový",
      generate: "Generovat QR",
      saveChanges: "Uložit změny"
    },
    ai: {
      analyzing: "Rozpoznávám...",
      error: "Nepodařilo se rozpoznat. Zkuste jinou fotku."
    },
    success: "Kódy byly uloženy do knihovny"
  },
  scan: {
    btnQrScan: "Skenovat QR kód",
    btnBarcodeScan: "Skenovat Barcode",
    btnQrUpload: "Nahrát QR kód",
    btnBarcodeUpload: "Nahrát Barcode",
    cameraPermission: "Povolte prosím kameru v nastavení prohlížeče.",
    stopScanning: "Zastavit",
    resultLabel: "Obsah kódu",
    saveToContacts: "Uložit do kontaktů",
    openUrl: "Otevřít URL",
    saveToLibrary: "Uložit do knihovny",
    savedToLibrary: "Uloženo v knihovně",
    scanNext: "Skenovat další",
    notFound: "Kód nebyl nalezen."
  },
  library: {
    emptyTitle: "Knihovna je prázdná",
    emptySubtitle: "Zatím žádné uložené kódy.",
    endOfList: "Konec seznamu",
    clickToEnlarge: "Klikni pro zvětšení",
    downloadPng: "Stáhnout PNG",
    confirmDelete: "Opravdu smazat?",
    unknownContact: "Neznámý kontakt"
  },
  settings: {
    language: "Jazyk",
    languageAuto: "Automaticky (systém)",
    account: "Účet",
    about: "O Aplikaci",
    logout: "Odhlásit se",
    deleteAccount: "Smazat účet",
    deleteConfirm: "Opravdu chcete smazat účet? Tato akce je nevratná.",
    version: "Verze aplikace",
    designedBy: "Designed by Cristian",
    reportProblem: "Nahlásit problém"
  },
  modal: {
    unsavedTitle: "Rozpracovaný kód",
    unsavedBody: "Máte vyplněné údaje, které nejsou uložené. Pokud odejdete, o tyto změny přijdete.",
    keepEditing: "Zůstat a uložit",
    discard: "Zahodit změny a odejít"
  }
};

// --- ENGLISH ---
const en = {
  common: {
    back: "Back",
    save: "Save",
    delete: "Delete",
    cancel: "Cancel",
    download: "Download",
    share: "Share",
    edit: "Edit",
    yes: "Yes",
    no: "No",
    loading: "Loading...",
    or: "or",
    unknown: "Unknown",
    error: "Error",
    group: "Group"
  },
  tabs: {
    generate: "Generate",
    scan: "Scan",
    library: "Library",
    settings: "Settings"
  },
  header: {
    title: "QR Tool",
    subtitle: "All your codes in one place.",
    create: "Create new code",
    edit: "Edit code",
    scan: "Focus camera",
    library: "Saved codes",
    settings: "App preferences"
  },
  auth: {
    loginTitle: "QR Tool",
    loginSubtitle: "All your codes in one place.",
    googleLogin: "Sign in with Google",
    emailLabel: "Email",
    passwordLabel: "Password",
    confirmPasswordLabel: "Confirm Password",
    loginButton: "Sign in",
    forgotPassword: "Forgot password?",
    noAccount: "Don't have an account?",
    registerLink: "Sign up",
    backToLogin: "← Back to login",
    registerTitle: "Create account",
    registerSubtitle: "Enter your details to register",
    registerButton: "Sign up",
    resetTitle: "Reset password",
    resetSubtitle: "Enter your email address and we'll send you a link to reset your password.",
    resetButton: "Send reset link",
    emailPlaceholder: "you@email.com",
    passwordPlaceholder: "••••••••",
    errorInvalidEmail: "Invalid email address.",
    errorUserDisabled: "This account has been disabled.",
    errorInvalidCredential: "Incorrect email or password.",
    errorWrongPassword: "Incorrect password.",
    errorEmailInUse: "This email is already registered.",
    errorWeakPassword: "Password must be at least 6 characters.",
    errorTooManyRequests: "Too many attempts. Please try again later.",
    errorGeneric: "Something went wrong. Please try again.",
    errorFillFields: "Please fill in all fields.",
    errorPasswordMismatch: "Passwords do not match.",
    errorReauthRequired: "Please sign in again before deleting your account.",
    errorEmailNotVerified: "Please verify your email first. Check your inbox.",
    resetSent: "Password reset link has been sent to your email.",
    verifyTitle: "Verify your email",
    continueButton: "Continue",
    verificationSent: "We sent a verification link to your email. Click it and then sign in."
  },
  generate: {
    types: {
      text: "Text",
      url: "URL",
      wifi: "WiFi",
      password: "Password",
      vcard: "VCard"
    },
    labels: {
      text: "Enter text",
      url: "Enter URL",
      wifiSsid: "Network Name (SSID)",
      wifiPassword: "WiFi Password",
      security: "Security Type",
      username: "Username / Login",
      password: "Password",
      groupName: "Group / Service Name",
      entryName: "Entry Name",
      firstName: "First Name",
      lastName: "Last Name",
      phone: "Phone",
      email: "Email",
      web: "Website",
      company: "Company",
      jobTitle: "Job Title"
    },
    placeholders: {
      text: "E.g. note, address...",
      url: "https://",
      wifiSsid: "Your WiFi Name",
      wifiPassword: "Network Password",
      username: "e.g. email@example.com",
      password: "Your password",
      groupName: "e.g. Netflix",
      entryName: "Name this code",
      firstName: "John",
      lastName: "Doe",
      phone: "+1 234 567 890",
      email: "john@example.com",
      web: "https://example.com",
      company: "Company Inc.",
      jobTitle: "Developer"
    },
    buttons: {
      scanVcard: "Scan Business Card (AI)",
      scanningVcard: "Scanning card...",
      takePhoto: "Take Photo",
      uploadPhoto: "Upload Photo",
      addOptional: "+ Add more details",
      removeOptional: "Remove",
      generateNew: "Generate New",
      generate: "Generate QR",
      saveChanges: "Save Changes"
    },
    ai: {
      analyzing: "Analyzing...",
      error: "Failed to recognize. Try another photo."
    },
    success: "Codes saved to library"
  },
  scan: {
    btnQrScan: "Scan QR Code",
    btnBarcodeScan: "Scan Barcode",
    btnQrUpload: "Upload QR Code",
    btnBarcodeUpload: "Upload Barcode",
    cameraPermission: "Please allow camera access in browser settings.",
    stopScanning: "Stop",
    resultLabel: "Code Content",
    saveToContacts: "Save to Contacts",
    openUrl: "Open URL",
    saveToLibrary: "Save to Library",
    savedToLibrary: "Saved to Library",
    scanNext: "Scan Next",
    notFound: "Code not found."
  },
  library: {
    emptyTitle: "Library is empty",
    emptySubtitle: "No saved codes yet.",
    endOfList: "End of list",
    clickToEnlarge: "Click to enlarge",
    downloadPng: "Download PNG",
    confirmDelete: "Delete this?",
    unknownContact: "Unknown Contact"
  },
  settings: {
    language: "Language",
    languageAuto: "Auto (system)",
    account: "Account",
    about: "About App",
    logout: "Log out",
    deleteAccount: "Delete Account",
    deleteConfirm: "Are you sure you want to delete your account? This action cannot be undone.",
    version: "App Version",
    designedBy: "Designed by Cristian",
    reportProblem: "Report a problem"
  },
  modal: {
    unsavedTitle: "Unsaved Changes",
    unsavedBody: "You have unsaved details. If you leave now, these changes will be lost.",
    keepEditing: "Stay and Save",
    discard: "Discard and Leave"
  }
};

// --- SLOVENČINA ---
const sk = {
  common: { back: "Späť", save: "Uložiť", delete: "Odstrániť", cancel: "Zrušiť", download: "Stiahnuť", share: "Zdieľať", edit: "Upraviť", yes: "Áno", no: "Nie", loading: "Načítavanie...", or: "alebo", unknown: "Neznáme", error: "Chyba", group: "Skupina" },
  tabs: { generate: "Vytvoriť", scan: "Skenovať", library: "Knižnica", settings: "Nastavenia" },
  header: { title: "QR Tool", subtitle: "Všetky vaše kódy na jednom mieste.", create: "Vytvoriť nový kód", edit: "Upraviť kód", scan: "Zamerať kameru", library: "Uložené kódy", settings: "Nastavenia aplikácie" },
  auth: { loginTitle: "QR Tool", loginSubtitle: "Všetky vaše kódy na jednom mieste.", googleLogin: "Prihlásiť sa cez Google", emailLabel: "Email", passwordLabel: "Heslo", confirmPasswordLabel: "Potvrďte heslo", loginButton: "Prihlásiť sa", forgotPassword: "Zabudli ste heslo?", noAccount: "Nemáte účet?", registerLink: "Zaregistrujte sa", backToLogin: "← Späť na prihlásenie", registerTitle: "Vytvoriť účet", registerSubtitle: "Zadajte svoje údaje na registráciu", registerButton: "Zaregistrujte sa", resetTitle: "Obnoviť heslo", resetSubtitle: "Zadajte svoju e-mailovú adresu a pošleme vám odkaz na obnovenie hesla.", resetButton: "Poslať odkaz na obnovenie", emailPlaceholder: "vas@email.com", passwordPlaceholder: "••••••••", errorInvalidEmail: "Neplatná e-mailová adresa.", errorUserDisabled: "Tento účet bol zakázaný.", errorInvalidCredential: "Nesprávny email alebo heslo.", errorWrongPassword: "Nesprávne heslo.", errorEmailInUse: "Tento email je už registrovaný.", errorWeakPassword: "Heslo musí mať aspoň 6 znakov.", errorTooManyRequests: "Príliš veľa pokusov. Skúste to neskôr.", errorGeneric: "Niečo sa pokazilo. Skúste to znova.", errorFillFields: "Vyplňte všetky polia.", errorPasswordMismatch: "Heslá sa nezhodujú.", errorReauthRequired: "Pred odstránením účtu sa prosím prihláste znova.", errorEmailNotVerified: "Prosím potvrďte si svoju e-mailovú adresu. Skontrolujte si doručenú poštu.", resetSent: "Odkaz na obnovenie hesla bol poslaný na vašu e-mailovú adresu.", verifyTitle: "Potvrďte svoj email", continueButton: "Pokračovať", verificationSent: "Poslali sme vám overovací odkaz na e-mail. Kliknite naň a potom sa prihláste." },
  generate: { types: { text: "Text", url: "URL", wifi: "WiFi", password: "Heslo", vcard: "VCard" }, labels: { text: "Zadajte text", url: "Zadajte URL", wifiSsid: "Názov siete (SSID)", wifiPassword: "Heslo WiFi", security: "Typ bezpečnosti", username: "Používateľské meno / Prihlásenie", password: "Heslo", groupName: "Názov skupiny / Služby", entryName: "Názov záznamu", firstName: "Krstné meno", lastName: "Priezvisko", phone: "Telefón", email: "Email", web: "Webová stránka", company: "Spoločnosť", jobTitle: "Pracovná pozícia" }, placeholders: { text: "Napr. poznámka, adresa...", url: "https://", wifiSsid: "Názov vašej WiFi", wifiPassword: "Heslo siete", username: "napr. email@example.com", password: "Vaše heslo", groupName: "napr. Netflix", entryName: "Pomenujte tento kód", firstName: "Ján", lastName: "Varga", phone: "+421 2 1234 5678", email: "jan@example.com", web: "https://example.com", company: "Spoločnosť s.r.o.", jobTitle: "Vývojár" }, buttons: { scanVcard: "Skenovať vizitku (AI)", scanningVcard: "Skenovanie vizitky...", takePhoto: "Urobiť fotku", uploadPhoto: "Nahrať fotku", addOptional: "+ Pridať ďalšie detaily", removeOptional: "Odstrániť", generateNew: "Vytvoriť nový", generate: "Vytvoriť QR", saveChanges: "Uložiť zmeny" }, ai: { analyzing: "Analýza...", error: "Rozpoznanie zlyhalo. Skúste inú fotku." }, success: "Kódy uložené do knižnice" },
  scan: { btnQrScan: "Skenovať QR kód", btnBarcodeScan: "Skenovať čiarový kód", btnQrUpload: "Nahrať QR kód", btnBarcodeUpload: "Nahrať čiarový kód", cameraPermission: "Povolte prístup ku kamere v nastaveniach prehliadača.", stopScanning: "Zastaviť", resultLabel: "Obsah kódu", saveToContacts: "Uložiť do kontaktov", openUrl: "Otvoriť URL", saveToLibrary: "Uložiť do knižnice", savedToLibrary: "Uložené do knižnice", scanNext: "Skenovať ďalší", notFound: "Kód nenájdený." },
  library: { emptyTitle: "Knižnica je prázdna", emptySubtitle: "Žiadne uložené kódy.", endOfList: "Koniec zoznamu", clickToEnlarge: "Kliknite na zväčšenie", downloadPng: "Stiahnuť PNG", confirmDelete: "Odstrániť toto?", unknownContact: "Neznámy kontakt" },
  settings: { language: "Jazyk", languageAuto: "Automaticky (systém)", account: "Účet", about: "O aplikácii", logout: "Odhlásiť sa", deleteAccount: "Odstrániť účet", deleteConfirm: "Ste si istí, že chcete odstrániť svoj účet? Táto akcia sa nedá vrátiť späť.", version: "Verzia aplikácie", designedBy: "Designed by Cristian", reportProblem: "Nahlásiť problém" },
  modal: { unsavedTitle: "Neuložené zmeny", unsavedBody: "Máte neuložené detaily. Ak teraz odídete, tieto zmeny budú stratené.", keepEditing: "Ostať a uložiť", discard: "Zahodiť a odísť" }
};
// --- DEUTSCH ---
const de = {
  common: { back: "Zurück", save: "Speichern", delete: "Löschen", cancel: "Abbrechen", download: "Herunterladen", share: "Teilen", edit: "Bearbeiten", yes: "Ja", no: "Nein", loading: "Wird geladen...", or: "oder", unknown: "Unbekannt", error: "Fehler", group: "Gruppe" },
  tabs: { generate: "Erstellen", scan: "Scannen", library: "Bibliothek", settings: "Einstellungen" },
  header: { title: "QR Tool", subtitle: "Alle Ihre Codes an einem Ort.", create: "Neuen Code erstellen", edit: "Code bearbeiten", scan: "Kamera ausrichten", library: "Gespeicherte Codes", settings: "App-Einstellungen" },
  auth: { loginTitle: "QR Tool", loginSubtitle: "Alle Ihre Codes an einem Ort.", googleLogin: "Mit Google anmelden", emailLabel: "E-Mail", passwordLabel: "Passwort", confirmPasswordLabel: "Passwort bestätigen", loginButton: "Anmelden", forgotPassword: "Passwort vergessen?", noAccount: "Haben Sie kein Konto?", registerLink: "Registrieren", backToLogin: "← Zurück zur Anmeldung", registerTitle: "Konto erstellen", registerSubtitle: "Geben Sie Ihre Daten ein, um sich zu registrieren", registerButton: "Registrieren", resetTitle: "Passwort zurücksetzen", resetSubtitle: "Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts.", resetButton: "Zurücksetzen-Link senden", emailPlaceholder: "sie@email.com", passwordPlaceholder: "••••••••", errorInvalidEmail: "Ungültige E-Mail-Adresse.", errorUserDisabled: "Dieses Konto wurde deaktiviert.", errorInvalidCredential: "Ungültige E-Mail oder Passwort.", errorWrongPassword: "Falsches Passwort.", errorEmailInUse: "Diese E-Mail ist bereits registriert.", errorWeakPassword: "Das Passwort muss mindestens 6 Zeichen lang sein.", errorTooManyRequests: "Zu viele Versuche. Bitte versuchen Sie es später erneut.", errorGeneric: "Etwas ist schief gelaufen. Bitte versuchen Sie es erneut.", errorFillFields: "Bitte füllen Sie alle Felder aus.", errorPasswordMismatch: "Die Passwörter stimmen nicht überein.", errorReauthRequired: "Bitte melden Sie sich erneut an, bevor Sie Ihr Konto löschen.", errorEmailNotVerified: "Bitte bestätigen Sie zunächst Ihre E-Mail-Adresse. Überprüfen Sie Ihren Posteingang.", resetSent: "Der Link zum Zurücksetzen des Passworts wurde an Ihre E-Mail gesendet.", verifyTitle: "E-Mail bestätigen", continueButton: "Weiter", verificationSent: "Wir haben einen Bestätigungslink an Ihre E-Mail gesendet. Klicken Sie darauf und melden Sie sich an." },
  generate: { types: { text: "Text", url: "URL", wifi: "WiFi", password: "Passwort", vcard: "VCard" }, labels: { text: "Text eingeben", url: "URL eingeben", wifiSsid: "Netzwerkname (SSID)", wifiPassword: "WiFi-Passwort", security: "Sicherheitstyp", username: "Benutzername / Anmeldung", password: "Passwort", groupName: "Gruppen- / Servicebezeichnung", entryName: "Eintragname", firstName: "Vorname", lastName: "Nachname", phone: "Telefon", email: "E-Mail", web: "Website", company: "Unternehmen", jobTitle: "Berufsbezeichnung" }, placeholders: { text: "Z.B. Notiz, Adresse...", url: "https://", wifiSsid: "Ihr WiFi-Name", wifiPassword: "Netzwerkpasswort", username: "z.B. email@example.com", password: "Ihr Passwort", groupName: "z.B. Netflix", entryName: "Diesen Code benennen", firstName: "Max", lastName: "Mustermann", phone: "+49 30 123456", email: "max@example.com", web: "https://example.com", company: "Musterfirma GmbH", jobTitle: "Entwickler" }, buttons: { scanVcard: "Visitenkarte scannen (KI)", scanningVcard: "Visitenkarte wird gescannt...", takePhoto: "Foto aufnehmen", uploadPhoto: "Foto hochladen", addOptional: "+ Weitere Details hinzufügen", removeOptional: "Entfernen", generateNew: "Neue erstellen", generate: "QR erstellen", saveChanges: "Änderungen speichern" }, ai: { analyzing: "Analysiere...", error: "Erkennung fehlgeschlagen. Versuchen Sie ein anderes Foto." }, success: "Codes in der Bibliothek gespeichert" },
  scan: { btnQrScan: "QR-Code scannen", btnBarcodeScan: "Strichcode scannen", btnQrUpload: "QR-Code hochladen", btnBarcodeUpload: "Strichcode hochladen", cameraPermission: "Bitte erlauben Sie den Kamerazugriff in den Browsereinstellungen.", stopScanning: "Stopp", resultLabel: "Code-Inhalt", saveToContacts: "In Kontakte speichern", openUrl: "URL öffnen", saveToLibrary: "In Bibliothek speichern", savedToLibrary: "In Bibliothek gespeichert", scanNext: "Nächste scannen", notFound: "Code nicht gefunden." },
  library: { emptyTitle: "Bibliothek ist leer", emptySubtitle: "Keine gespeicherten Codes vorhanden.", endOfList: "Ende der Liste", clickToEnlarge: "Zum Vergrößern klicken", downloadPng: "PNG herunterladen", confirmDelete: "Dies löschen?", unknownContact: "Unbekannter Kontakt" },
  settings: { language: "Sprache", languageAuto: "Automatisch (System)", account: "Konto", about: "Über die App", logout: "Abmelden", deleteAccount: "Konto löschen", deleteConfirm: "Sind Sie sicher, dass Sie Ihr Konto löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.", version: "App-Version", designedBy: "Designed by Cristian", reportProblem: "Ein Problem melden" },
  modal: { unsavedTitle: "Ungespeicherte Änderungen", unsavedBody: "Sie haben ungespeicherte Details. Wenn Sie jetzt gehen, gehen diese Änderungen verloren.", keepEditing: "Bleiben und speichern", discard: "Verwerfen und gehen" }
};
// --- POLSKI ---
const pl = {
  common: { back: "Wstecz", save: "Zapisz", delete: "Usuń", cancel: "Anuluj", download: "Pobierz", share: "Udostępnij", edit: "Edytuj", yes: "Tak", no: "Nie", loading: "Ładowanie...", or: "lub", unknown: "Nieznane", error: "Błąd", group: "Grupa" },
  tabs: { generate: "Generuj", scan: "Skanuj", library: "Biblioteka", settings: "Ustawienia" },
  header: { title: "QR Tool", subtitle: "Wszystkie Twoje kody w jednym miejscu.", create: "Utwórz nowy kod", edit: "Edytuj kod", scan: "Wycentruj kamerę", library: "Zapisane kody", settings: "Preferencje aplikacji" },
  auth: { loginTitle: "QR Tool", loginSubtitle: "Wszystkie Twoje kody w jednym miejscu.", googleLogin: "Zaloguj się przez Google", emailLabel: "Email", passwordLabel: "Hasło", confirmPasswordLabel: "Potwierdź hasło", loginButton: "Zaloguj się", forgotPassword: "Zapomniałeś hasła?", noAccount: "Nie masz konta?", registerLink: "Zarejestruj się", backToLogin: "← Wróć do logowania", registerTitle: "Utwórz konto", registerSubtitle: "Wprowadź swoje dane, aby się zarejestrować", registerButton: "Zarejestruj się", resetTitle: "Resetuj hasło", resetSubtitle: "Podaj swój adres e-mail, a my wyślemy Ci link do zresetowania hasła.", resetButton: "Wyślij link do resetowania", emailPlaceholder: "ty@email.com", passwordPlaceholder: "••••••••", errorInvalidEmail: "Nieprawidłowy adres e-mail.", errorUserDisabled: "To konto zostało wyłączone.", errorInvalidCredential: "Nieprawidłowy email lub hasło.", errorWrongPassword: "Nieprawidłowe hasło.", errorEmailInUse: "Ten email jest już zarejestrowany.", errorWeakPassword: "Hasło musi mieć co najmniej 6 znaków.", errorTooManyRequests: "Zbyt wiele prób. Spróbuj później.", errorGeneric: "Coś poszło nie tak. Spróbuj ponownie.", errorFillFields: "Wypełnij wszystkie pola.", errorPasswordMismatch: "Hasła się nie zgadzają.", errorReauthRequired: "Zaloguj się ponownie przed usunięciem konta.", errorEmailNotVerified: "Najpierw potwierdź swój e-mail. Sprawdź swoją skrzynkę odbiorczą.", resetSent: "Link do resetowania hasła został wysłany na Twój e-mail.", verifyTitle: "Potwierdź swój e-mail", continueButton: "Kontynuuj", verificationSent: "Wysłaliśmy link weryfikacyjny na Twój e-mail. Kliknij na niego, a następnie się zaloguj." },
  generate: { types: { text: "Tekst", url: "URL", wifi: "WiFi", password: "Hasło", vcard: "VCard" }, labels: { text: "Wpisz tekst", url: "Wpisz URL", wifiSsid: "Nazwa sieci (SSID)", wifiPassword: "Hasło WiFi", security: "Typ bezpieczeństwa", username: "Nazwa użytkownika / Login", password: "Hasło", groupName: "Nazwa grupy / Usługi", entryName: "Nazwa wpisu", firstName: "Imię", lastName: "Nazwisko", phone: "Telefon", email: "Email", web: "Strona internetowa", company: "Firma", jobTitle: "Stanowisko" }, placeholders: { text: "Np. notatka, adres...", url: "https://", wifiSsid: "Nazwa Twojej sieci WiFi", wifiPassword: "Hasło sieci", username: "np. email@example.com", password: "Twoje hasło", groupName: "np. Netflix", entryName: "Nazwij ten kod", firstName: "Jan", lastName: "Kowalski", phone: "+48 12 345 67 89", email: "jan@example.com", web: "https://example.com", company: "Firma Sp. z o.o.", jobTitle: "Developer" }, buttons: { scanVcard: "Skanuj wizytówkę (AI)", scanningVcard: "Skanowanie wizytówki...", takePhoto: "Zrób zdjęcie", uploadPhoto: "Wgraj zdjęcie", addOptional: "+ Dodaj więcej szczegółów", removeOptional: "Usuń", generateNew: "Generuj nowy", generate: "Generuj kod QR", saveChanges: "Zapisz zmiany" }, ai: { analyzing: "Analizowanie...", error: "Rozpoznanie nie powiodło się. Spróbuj inne zdjęcie." }, success: "Kody zapisane do biblioteki" },
  scan: { btnQrScan: "Skanuj kod QR", btnBarcodeScan: "Skanuj kod kreskowy", btnQrUpload: "Wgraj kod QR", btnBarcodeUpload: "Wgraj kod kreskowy", cameraPermission: "Zezwól na dostęp do kamery w ustawieniach przeglądarki.", stopScanning: "Zatrzymaj", resultLabel: "Zawartość kodu", saveToContacts: "Zapisz do kontaktów", openUrl: "Otwórz URL", saveToLibrary: "Zapisz do biblioteki", savedToLibrary: "Zapisano do biblioteki", scanNext: "Skanuj następny", notFound: "Kod nie znaleziony." },
  library: { emptyTitle: "Biblioteka jest pusta", emptySubtitle: "Brak zapisanych kodów.", endOfList: "Koniec listy", clickToEnlarge: "Kliknij aby powiększyć", downloadPng: "Pobierz PNG", confirmDelete: "Usunąć to?", unknownContact: "Nieznany kontakt" },
  settings: { language: "Język", languageAuto: "Automatycznie (system)", account: "Konto", about: "O aplikacji", logout: "Wyloguj się", deleteAccount: "Usuń konto", deleteConfirm: "Czy na pewno chcesz usunąć swoje konto? Tej czynności nie można cofnąć.", version: "Wersja aplikacji", designedBy: "Designed by Cristian", reportProblem: "Zgłoś problem" },
  modal: { unsavedTitle: "Niezapisane zmiany", unsavedBody: "Masz niezapisane szczegóły. Jeśli teraz opuścisz, te zmiany zostaną utracone.", keepEditing: "Zostań i zapisz", discard: "Odrzuć i wyjdź" }
};
// --- ROMÂNĂ ---
const ro = {
  common: { back: "Înapoi", save: "Salvează", delete: "Șterge", cancel: "Anulare", download: "Descarcă", share: "Partajează", edit: "Editează", yes: "Da", no: "Nu", loading: "Se încarcă...", or: "sau", unknown: "Necunoscut", error: "Eroare", group: "Grup" },
  tabs: { generate: "Generare", scan: "Scanare", library: "Bibliotecă", settings: "Setări" },
  header: { title: "QR Tool", subtitle: "Toate codurile tale într-un singur loc.", create: "Creează cod nou", edit: "Editează cod", scan: "Focalizează camera", library: "Coduri salvate", settings: "Preferințe aplicație" },
  auth: { loginTitle: "QR Tool", loginSubtitle: "Toate codurile tale într-un singur loc.", googleLogin: "Conectează-te cu Google", emailLabel: "Email", passwordLabel: "Parolă", confirmPasswordLabel: "Confirmă parola", loginButton: "Conectare", forgotPassword: "Ai uitat parola?", noAccount: "Nu ai cont?", registerLink: "Înregistrează-te", backToLogin: "← Înapoi la conectare", registerTitle: "Creează cont", registerSubtitle: "Introdu detaliile tale pentru a te înregistra", registerButton: "Înregistrează-te", resetTitle: "Resetează parola", resetSubtitle: "Introdu adresa ta de email și îți vom trimite un link pentru a reseta parola.", resetButton: "Trimite link de resetare", emailPlaceholder: "tu@email.com", passwordPlaceholder: "••••••••", errorInvalidEmail: "Adresă de email nevalidă.", errorUserDisabled: "Acest cont a fost dezactivat.", errorInvalidCredential: "Email sau parolă incorectă.", errorWrongPassword: "Parolă incorectă.", errorEmailInUse: "Acest email este deja înregistrat.", errorWeakPassword: "Parola trebuie să aibă cel puțin 6 caractere.", errorTooManyRequests: "Prea multe încercări. Încearcă mai târziu.", errorGeneric: "Ceva a mers prost. Încearcă din nou.", errorFillFields: "Completează toate câmpurile.", errorPasswordMismatch: "Parolele nu se potrivesc.", errorReauthRequired: "Conectează-te din nou înainte de a șterge contul.", errorEmailNotVerified: "Verifică-ți email-ul. Verifică-ți inbox-ul.", resetSent: "Link-ul de resetare a parolei a fost trimis la adresa ta de email.", verifyTitle: "Verifică-ți email-ul", continueButton: "Continuă", verificationSent: "Ți-am trimis un link de verificare la email. Dă clic pe el și apoi conectează-te." },
  generate: { types: { text: "Text", url: "URL", wifi: "WiFi", password: "Parolă", vcard: "VCard" }, labels: { text: "Introdu text", url: "Introdu URL", wifiSsid: "Nume rețea (SSID)", wifiPassword: "Parolă WiFi", security: "Tip securitate", username: "Utilizator / Conectare", password: "Parolă", groupName: "Grup / Nume serviciu", entryName: "Nume intrare", firstName: "Prenume", lastName: "Nume", phone: "Telefon", email: "Email", web: "Website", company: "Companie", jobTitle: "Poziție" }, placeholders: { text: "De ex. notă, adresă...", url: "https://", wifiSsid: "Nume WiFi", wifiPassword: "Parolă rețea", username: "de ex. ion@example.com", password: "Parola ta", groupName: "de ex. Netflix", entryName: "Denumește acest cod", firstName: "Ion", lastName: "Popescu", phone: "+40 123 456 789", email: "ion@example.com", web: "https://example.com", company: "Companie SRL", jobTitle: "Developer" }, buttons: { scanVcard: "Scanează carte de vizită (AI)", scanningVcard: "Se scanează cartea...", takePhoto: "Fă fotografie", uploadPhoto: "Încarcă fotografie", addOptional: "+ Adaugă mai multe detalii", removeOptional: "Elimină", generateNew: "Generează nou", generate: "Generează QR", saveChanges: "Salvează schimbări" }, ai: { analyzing: "Se analizează...", error: "Nu s-a putut recunoaște. Încearcă o altă fotografie." }, success: "Coduri salvate în bibliotecă" },
  scan: { btnQrScan: "Scanează cod QR", btnBarcodeScan: "Scanează cod de bare", btnQrUpload: "Încarcă cod QR", btnBarcodeUpload: "Încarcă cod de bare", cameraPermission: "Permite accesul la cameră în setările browserului.", stopScanning: "Oprire", resultLabel: "Conținut cod", saveToContacts: "Salvează în contacte", openUrl: "Deschide URL", saveToLibrary: "Salvează în bibliotecă", savedToLibrary: "Salvat în bibliotecă", scanNext: "Scanează următorul", notFound: "Cod nu a fost găsit." },
  library: { emptyTitle: "Bibliotecă goală", emptySubtitle: "Încă nu sunt coduri salvate.", endOfList: "Sfârșitul listei", clickToEnlarge: "Apasă pentru a mări", downloadPng: "Descarcă PNG", confirmDelete: "Ștergi aceasta?", unknownContact: "Contact necunoscut" },
  settings: { language: "Limbă", languageAuto: "Automat (sistem)", account: "Cont", about: "Despre aplicație", logout: "Deconectare", deleteAccount: "Șterge contul", deleteConfirm: "Ești sigur că vrei să ștergi contul? Această acțiune nu poate fi anulată.", version: "Versiunea aplicației", designedBy: "Designed by Cristian", reportProblem: "Raportează o problemă" },
  modal: { unsavedTitle: "Schimbări nesalvate", unsavedBody: "Ai detalii nesalvate. Dacă pleci acum, aceste schimbări vor fi pierdute.", keepEditing: "Rămâi și salvează", discard: "Anulează și pleacă" }
};
// --- MAGYAR ---
const hu = {
  common: { back: "Vissza", save: "Mentés", delete: "Törlés", cancel: "Mégse", download: "Letöltés", share: "Megosztás", edit: "Szerkesztés", yes: "Igen", no: "Nem", loading: "Betöltés...", or: "vagy", unknown: "Ismeretlen", error: "Hiba", group: "Csoport" },
  tabs: { generate: "Generálás", scan: "Szkennelés", library: "Könyvtár", settings: "Beállítások" },
  header: { title: "QR Tool", subtitle: "Az összes kódod egy helyen.", create: "Új kód létrehozása", edit: "Kód szerkesztése", scan: "Kamera fókuszálása", library: "Mentett kódok", settings: "Alkalmazás beállításai" },
  auth: { loginTitle: "QR Tool", loginSubtitle: "Az összes kódod egy helyen.", googleLogin: "Bejelentkezés a Google segítségével", emailLabel: "Email", passwordLabel: "Jelszó", confirmPasswordLabel: "Jelszó megerősítése", loginButton: "Bejelentkezés", forgotPassword: "Elfelejtett jelszó?", noAccount: "Nincs még fiókod?", registerLink: "Regisztrálj", backToLogin: "← Vissza a bejelentkezéshez", registerTitle: "Fiók létrehozása", registerSubtitle: "Add meg az adataidat a regisztrációhoz", registerButton: "Regisztrálj", resetTitle: "Jelszó resetelése", resetSubtitle: "Add meg az email címed, és küldünk egy linket a jelszó reseteléshez.", resetButton: "Reset link küldése", emailPlaceholder: "te@email.com", passwordPlaceholder: "••••••••", errorInvalidEmail: "Érvénytelen email cím.", errorUserDisabled: "Ez a fiók le lett tiltva.", errorInvalidCredential: "Hibás email vagy jelszó.", errorWrongPassword: "Hibás jelszó.", errorEmailInUse: "Ez az email már regisztrálva van.", errorWeakPassword: "A jelszónak legalább 6 karakter hosszúnak kell lennie.", errorTooManyRequests: "Túl sok próbálkozás. Próbáld később.", errorGeneric: "Valami hiba történt. Próbáld újra.", errorFillFields: "Kérjük, töltsd ki az összes mezőt.", errorPasswordMismatch: "A jelszavak nem egyeznek.", errorReauthRequired: "Kérjük, jelentkezz be újra a fiók törlése előtt.", errorEmailNotVerified: "Kérjük, erősítsd meg az email címed. Ellenőrizd az inbox-odat.", resetSent: "A jelszó resetelésére vonatkozó link elküldve az email címedre.", verifyTitle: "Email cím megerősítése", continueButton: "Folytatás", verificationSent: "Egy megerősítési linket küldtünk az email címedre. Kattints rá, majd jelentkezz be." },
  generate: { types: { text: "Szöveg", url: "URL", wifi: "WiFi", password: "Jelszó", vcard: "VCard" }, labels: { text: "Szöveg megadása", url: "URL megadása", wifiSsid: "Hálózat neve (SSID)", wifiPassword: "WiFi jelszó", security: "Biztonsági típus", username: "Felhasználónév / Bejelentkezés", password: "Jelszó", groupName: "Csoport / Szolgáltatás neve", entryName: "Bejegyzés neve", firstName: "Keresztnév", lastName: "Vezetéknév", phone: "Telefon", email: "Email", web: "Webhely", company: "Cég", jobTitle: "Pozíció" }, placeholders: { text: "Pl. megjegyzés, cím...", url: "https://", wifiSsid: "WiFi hálózat neve", wifiPassword: "Hálózati jelszó", username: "pl. janos@example.com", password: "A jelszavad", groupName: "pl. Netflix", entryName: "Nevezd meg ezt a kódot", firstName: "János", lastName: "Nagy", phone: "+36 20 123 456", email: "janos@example.com", web: "https://example.com", company: "Cég Zrt.", jobTitle: "Developer" }, buttons: { scanVcard: "Névjegy beolvasása (AI)", scanningVcard: "Névjegy beolvasása...", takePhoto: "Fénykép készítése", uploadPhoto: "Fénykép feltöltése", addOptional: "+ További részletek hozzáadása", removeOptional: "Eltávolítás", generateNew: "Új generálása", generate: "QR generálása", saveChanges: "Módosítások mentése" }, ai: { analyzing: "Elemzés folyamatban...", error: "Nem sikerült felismerni. Próbálj meg egy másik fényképet." }, success: "Kódok mentve a könyvtárba" },
  scan: { btnQrScan: "QR kód beolvasása", btnBarcodeScan: "Vonalkód beolvasása", btnQrUpload: "QR kód feltöltése", btnBarcodeUpload: "Vonalkód feltöltése", cameraPermission: "Kérjük, engedélyezd a kamera hozzáférést a böngésző beállításaiban.", stopScanning: "Leállítás", resultLabel: "Kód tartalma", saveToContacts: "Mentés a Névjegyzékbe", openUrl: "URL megnyitása", saveToLibrary: "Mentés a könyvtárba", savedToLibrary: "Mentve a könyvtárba", scanNext: "Következő beolvasása", notFound: "Kód nem található." },
  library: { emptyTitle: "Könyvtár üres", emptySubtitle: "Még nincsenek mentett kódok.", endOfList: "A lista vége", clickToEnlarge: "Kattints a nagyításhoz", downloadPng: "PNG letöltése", confirmDelete: "Törlöd ezt?", unknownContact: "Ismeretlen kontakt" },
  settings: { language: "Nyelv", languageAuto: "Automatikus (rendszer)", account: "Fiók", about: "Az alkalmazásról", logout: "Kijelentkezés", deleteAccount: "Fiók törlése", deleteConfirm: "Biztos vagy benne, hogy törölni szeretnéd a fiókod? Ez a műveletet nem lehet visszavonni.", version: "Alkalmazás verziója", designedBy: "Designed by Cristian", reportProblem: "Probléma bejelentése" },
  modal: { unsavedTitle: "Mentetlen módosítások", unsavedBody: "Van mentetlen részleteid. Ha most elmész, ezek a módosítások elvesznek.", keepEditing: "Maradj és mentsd", discard: "Elvetés és kilépés" }
};
// --- ESPAÑOL ---
const es = {
  common: { back: "Atrás", save: "Guardar", delete: "Eliminar", cancel: "Cancelar", download: "Descargar", share: "Compartir", edit: "Editar", yes: "Sí", no: "No", loading: "Cargando...", or: "o", unknown: "Desconocido", error: "Error", group: "Grupo" },
  tabs: { generate: "Generar", scan: "Escanear", library: "Biblioteca", settings: "Configuración" },
  header: { title: "QR Tool", subtitle: "Todos tus códigos en un solo lugar.", create: "Crear nuevo código", edit: "Editar código", scan: "Enfocar cámara", library: "Códigos guardados", settings: "Preferencias de la app" },
  auth: { loginTitle: "QR Tool", loginSubtitle: "Todos tus códigos en un solo lugar.", googleLogin: "Iniciar sesión con Google", emailLabel: "Correo electrónico", passwordLabel: "Contraseña", confirmPasswordLabel: "Confirmar contraseña", loginButton: "Iniciar sesión", forgotPassword: "¿Olvidaste tu contraseña?", noAccount: "¿No tienes cuenta?", registerLink: "Regístrate", backToLogin: "← Volver al inicio de sesión", registerTitle: "Crear cuenta", registerSubtitle: "Ingresa tus datos para registrarte", registerButton: "Regístrate", resetTitle: "Restablecer contraseña", resetSubtitle: "Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.", resetButton: "Enviar enlace de restablecimiento", emailPlaceholder: "tu@email.com", passwordPlaceholder: "••••••••", errorInvalidEmail: "Correo electrónico inválido.", errorUserDisabled: "Esta cuenta ha sido deshabilitada.", errorInvalidCredential: "Correo electrónico o contraseña incorrectos.", errorWrongPassword: "Contraseña incorrecta.", errorEmailInUse: "Este correo electrónico ya está registrado.", errorWeakPassword: "La contraseña debe tener al menos 6 caracteres.", errorTooManyRequests: "Demasiados intentos. Por favor, intenta más tarde.", errorGeneric: "Algo salió mal. Por favor, intenta de nuevo.", errorFillFields: "Por favor, rellena todos los campos.", errorPasswordMismatch: "Las contraseñas no coinciden.", errorReauthRequired: "Por favor, inicia sesión nuevamente antes de eliminar tu cuenta.", errorEmailNotVerified: "Por favor, verifica tu correo electrónico primero. Revisa tu bandeja de entrada.", resetSent: "Se ha enviado un enlace de restablecimiento de contraseña a tu correo electrónico.", verifyTitle: "Verifica tu correo electrónico", continueButton: "Continuar", verificationSent: "Enviamos un enlace de verificación a tu correo electrónico. Haz clic en él e inicia sesión." },
  generate: { types: { text: "Texto", url: "URL", wifi: "WiFi", password: "Contraseña", vcard: "VCard" }, labels: { text: "Ingresa texto", url: "Ingresa URL", wifiSsid: "Nombre de red (SSID)", wifiPassword: "Contraseña WiFi", security: "Tipo de seguridad", username: "Usuario / Correo electrónico", password: "Contraseña", groupName: "Grupo / Nombre del servicio", entryName: "Nombre de la entrada", firstName: "Nombre", lastName: "Apellido", phone: "Teléfono", email: "Correo electrónico", web: "Sitio web", company: "Empresa", jobTitle: "Puesto" }, placeholders: { text: "Ej. nota, dirección...", url: "https://", wifiSsid: "Nombre de tu WiFi", wifiPassword: "Contraseña de red", username: "ej. juan@example.com", password: "Tu contraseña", groupName: "ej. Netflix", entryName: "Nombra este código", firstName: "Juan", lastName: "García", phone: "+34 912 345 678", email: "juan@example.com", web: "https://example.com", company: "Empresa SL", jobTitle: "Desarrollador" }, buttons: { scanVcard: "Escanear tarjeta de visita (AI)", scanningVcard: "Escaneando tarjeta...", takePhoto: "Tomar foto", uploadPhoto: "Subir foto", addOptional: "+ Agregar más detalles", removeOptional: "Eliminar", generateNew: "Generar nuevo", generate: "Generar QR", saveChanges: "Guardar cambios" }, ai: { analyzing: "Analizando...", error: "No se pudo reconocer. Intenta con otra foto." }, success: "Códigos guardados en la biblioteca" },
  scan: { btnQrScan: "Escanear código QR", btnBarcodeScan: "Escanear código de barras", btnQrUpload: "Subir código QR", btnBarcodeUpload: "Subir código de barras", cameraPermission: "Por favor, permite el acceso a la cámara en la configuración del navegador.", stopScanning: "Detener", resultLabel: "Contenido del código", saveToContacts: "Guardar en contactos", openUrl: "Abrir URL", saveToLibrary: "Guardar en biblioteca", savedToLibrary: "Guardado en biblioteca", scanNext: "Escanear siguiente", notFound: "Código no encontrado." },
  library: { emptyTitle: "Biblioteca vacía", emptySubtitle: "Sin códigos guardados aún.", endOfList: "Fin de la lista", clickToEnlarge: "Haz clic para ampliar", downloadPng: "Descargar PNG", confirmDelete: "¿Eliminar esto?", unknownContact: "Contacto desconocido" },
  settings: { language: "Idioma", languageAuto: "Automático (sistema)", account: "Cuenta", about: "Acerca de la aplicación", logout: "Cerrar sesión", deleteAccount: "Eliminar cuenta", deleteConfirm: "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.", version: "Versión de la aplicación", designedBy: "Designed by Cristian", reportProblem: "Reportar un problema" },
  modal: { unsavedTitle: "Cambios no guardados", unsavedBody: "Tienes detalles sin guardar. Si te vas ahora, estos cambios se perderán.", keepEditing: "Quedarse y guardar", discard: "Descartar y salir" }
};
// --- FRANÇAIS ---
const fr = {
  common: { back: "Retour", save: "Enregistrer", delete: "Supprimer", cancel: "Annuler", download: "Télécharger", share: "Partager", edit: "Modifier", yes: "Oui", no: "Non", loading: "Chargement...", or: "ou", unknown: "Inconnu", error: "Erreur", group: "Groupe" },
  tabs: { generate: "Générer", scan: "Scanner", library: "Bibliothèque", settings: "Paramètres" },
  header: { title: "QR Tool", subtitle: "Tous vos codes en un seul endroit.", create: "Créer un nouveau code", edit: "Modifier le code", scan: "Activer la caméra", library: "Codes enregistrés", settings: "Préférences de l'application" },
  auth: { loginTitle: "QR Tool", loginSubtitle: "Tous vos codes en un seul endroit.", googleLogin: "Se connecter avec Google", emailLabel: "Email", passwordLabel: "Mot de passe", confirmPasswordLabel: "Confirmer le mot de passe", loginButton: "Se connecter", forgotPassword: "Mot de passe oublié ?", noAccount: "Vous n'avez pas de compte ?", registerLink: "S'inscrire", backToLogin: "← Retour à la connexion", registerTitle: "Créer un compte", registerSubtitle: "Entrez vos coordonnées pour vous inscrire", registerButton: "S'inscrire", resetTitle: "Réinitialiser le mot de passe", resetSubtitle: "Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.", resetButton: "Envoyer le lien", emailPlaceholder: "vous@email.com", passwordPlaceholder: "••••••••", errorInvalidEmail: "Adresse e-mail invalide.", errorUserDisabled: "Ce compte a été désactivé.", errorInvalidCredential: "Email ou mot de passe incorrect.", errorWrongPassword: "Mot de passe incorrect.", errorEmailInUse: "Cet e-mail est déjà enregistré.", errorWeakPassword: "Le mot de passe doit comporter au moins 6 caractères.", errorTooManyRequests: "Trop de tentatives. Veuillez réessayer plus tard.", errorGeneric: "Une erreur s'est produite. Veuillez réessayer.", errorFillFields: "Veuillez remplir tous les champs.", errorPasswordMismatch: "Les mots de passe ne correspondent pas.", errorReauthRequired: "Veuillez vous reconnecter avant de supprimer votre compte.", errorEmailNotVerified: "Veuillez vérifier votre e-mail d'abord. Consultez votre boîte de réception.", resetSent: "Le lien de réinitialisation du mot de passe a été envoyé à votre e-mail.", verifyTitle: "Vérifiez votre e-mail", continueButton: "Continuer", verificationSent: "Nous avons envoyé un lien de vérification à votre e-mail. Cliquez dessus, puis connectez-vous." },
  generate: { types: { text: "Texte", url: "URL", wifi: "WiFi", password: "Mot de passe", vcard: "VCard" }, labels: { text: "Entrez du texte", url: "Entrez l'URL", wifiSsid: "Nom du réseau (SSID)", wifiPassword: "Mot de passe WiFi", security: "Type de sécurité", username: "Nom d'utilisateur / Connexion", password: "Mot de passe", groupName: "Nom du groupe / Service", entryName: "Nom de l'entrée", firstName: "Prénom", lastName: "Nom", phone: "Téléphone", email: "Email", web: "Site web", company: "Entreprise", jobTitle: "Titre du poste" }, placeholders: { text: "Ex. note, adresse...", url: "https://", wifiSsid: "Votre nom WiFi", wifiPassword: "Mot de passe réseau", username: "ex. email@exemple.com", password: "Votre mot de passe", groupName: "ex. Netflix", entryName: "Nommez ce code", firstName: "Jean", lastName: "Dupont", phone: "+33 1 23 45 67 89", email: "jean@exemple.com", web: "https://exemple.com", company: "Entreprise Inc.", jobTitle: "Développeur" }, buttons: { scanVcard: "Scanner carte de visite (IA)", scanningVcard: "Lecture de la carte...", takePhoto: "Prendre une photo", uploadPhoto: "Télécharger une photo", addOptional: "+ Ajouter plus de détails", removeOptional: "Supprimer", generateNew: "Générer un nouveau", generate: "Générer un QR Code", saveChanges: "Enregistrer les modifications" }, ai: { analyzing: "Analyse en cours...", error: "Reconnaissance échouée. Essayez une autre photo." }, success: "Codes enregistrés dans la bibliothèque" },
  scan: { btnQrScan: "Scanner un code QR", btnBarcodeScan: "Scanner un code-barres", btnQrUpload: "Télécharger un code QR", btnBarcodeUpload: "Télécharger un code-barres", cameraPermission: "Veuillez autoriser l'accès à la caméra dans les paramètres du navigateur.", stopScanning: "Arrêter", resultLabel: "Contenu du code", saveToContacts: "Enregistrer dans les contacts", openUrl: "Ouvrir l'URL", saveToLibrary: "Enregistrer dans la bibliothèque", savedToLibrary: "Enregistré dans la bibliothèque", scanNext: "Scanner suivant", notFound: "Code non trouvé." },
  library: { emptyTitle: "Bibliothèque vide", emptySubtitle: "Aucun code enregistré pour le moment.", endOfList: "Fin de la liste", clickToEnlarge: "Cliquer pour agrandir", downloadPng: "Télécharger PNG", confirmDelete: "Supprimer ceci ?", unknownContact: "Contact inconnu" },
  settings: { language: "Langue", languageAuto: "Automatique (système)", account: "Compte", about: "À propos de l'application", logout: "Se déconnecter", deleteAccount: "Supprimer le compte", deleteConfirm: "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action ne peut pas être annulée.", version: "Version de l'application", designedBy: "Designed by Cristian", reportProblem: "Signaler un problème" },
  modal: { unsavedTitle: "Modifications non enregistrées", unsavedBody: "Vous avez des détails non enregistrés. Si vous partez maintenant, ces modifications seront perdues.", keepEditing: "Rester et enregistrer", discard: "Abandonner et partir" }
};
// --- ITALIANO ---
const it = {
  common: { back: "Indietro", save: "Salva", delete: "Elimina", cancel: "Annulla", download: "Scarica", share: "Condividi", edit: "Modifica", yes: "Sì", no: "No", loading: "Caricamento...", or: "o", unknown: "Sconosciuto", error: "Errore", group: "Gruppo" },
  tabs: { generate: "Genera", scan: "Scansiona", library: "Libreria", settings: "Impostazioni" },
  header: { title: "QR Tool", subtitle: "Tutti i tuoi codici in un unico posto.", create: "Crea nuovo codice", edit: "Modifica codice", scan: "Attiva fotocamera", library: "Codici salvati", settings: "Preferenze app" },
  auth: { loginTitle: "QR Tool", loginSubtitle: "Tutti i tuoi codici in un unico posto.", googleLogin: "Accedi con Google", emailLabel: "Email", passwordLabel: "Password", confirmPasswordLabel: "Conferma password", loginButton: "Accedi", forgotPassword: "Password dimenticata?", noAccount: "Non hai un account?", registerLink: "Registrati", backToLogin: "← Torna al login", registerTitle: "Crea account", registerSubtitle: "Inserisci i tuoi dati per registrarti", registerButton: "Registrati", resetTitle: "Reimposta password", resetSubtitle: "Inserisci il tuo indirizzo email e ti invieremo un link per reimpostare la tua password.", resetButton: "Invia link", emailPlaceholder: "tu@email.com", passwordPlaceholder: "••••••••", errorInvalidEmail: "Indirizzo email non valido.", errorUserDisabled: "Questo account è stato disabilitato.", errorInvalidCredential: "Email o password errata.", errorWrongPassword: "Password errata.", errorEmailInUse: "Questo email è già registrato.", errorWeakPassword: "La password deve contenere almeno 6 caratteri.", errorTooManyRequests: "Troppi tentativi. Riprova più tardi.", errorGeneric: "Qualcosa è andato storto. Riprova.", errorFillFields: "Compila tutti i campi.", errorPasswordMismatch: "Le password non coincidono.", errorReauthRequired: "Effettua di nuovo l'accesso prima di eliminare il tuo account.", errorEmailNotVerified: "Verifica prima la tua email. Controlla la tua posta in arrivo.", resetSent: "Il link per reimpostare la password è stato inviato alla tua email.", verifyTitle: "Verifica la tua email", continueButton: "Continua", verificationSent: "Abbiamo inviato un link di verifica alla tua email. Cliccalo e poi effettua l'accesso." },
  generate: { types: { text: "Testo", url: "URL", wifi: "WiFi", password: "Password", vcard: "VCard" }, labels: { text: "Inserisci testo", url: "Inserisci URL", wifiSsid: "Nome della rete (SSID)", wifiPassword: "Password WiFi", security: "Tipo di sicurezza", username: "Nome utente / Accesso", password: "Password", groupName: "Nome gruppo / Servizio", entryName: "Nome voce", firstName: "Nome", lastName: "Cognome", phone: "Telefono", email: "Email", web: "Sito web", company: "Azienda", jobTitle: "Titolo lavoro" }, placeholders: { text: "Es. nota, indirizzo...", url: "https://", wifiSsid: "Il tuo nome WiFi", wifiPassword: "Password rete", username: "es. email@esempio.com", password: "La tua password", groupName: "es. Netflix", entryName: "Dai un nome a questo codice", firstName: "Marco", lastName: "Rossi", phone: "+39 06 1234 5678", email: "marco@esempio.com", web: "https://esempio.com", company: "Azienda Inc.", jobTitle: "Sviluppatore" }, buttons: { scanVcard: "Scansiona biglietto da visita (IA)", scanningVcard: "Scansione biglietto...", takePhoto: "Scatta foto", uploadPhoto: "Carica foto", addOptional: "+ Aggiungi altri dettagli", removeOptional: "Rimuovi", generateNew: "Genera nuovo", generate: "Genera codice QR", saveChanges: "Salva modifiche" }, ai: { analyzing: "Analisi in corso...", error: "Riconoscimento fallito. Prova un'altra foto." }, success: "Codici salvati in libreria" },
  scan: { btnQrScan: "Scansiona codice QR", btnBarcodeScan: "Scansiona codice a barre", btnQrUpload: "Carica codice QR", btnBarcodeUpload: "Carica codice a barre", cameraPermission: "Consenti l'accesso alla fotocamera nelle impostazioni del browser.", stopScanning: "Ferma", resultLabel: "Contenuto codice", saveToContacts: "Salva nei contatti", openUrl: "Apri URL", saveToLibrary: "Salva in libreria", savedToLibrary: "Salvato in libreria", scanNext: "Scansiona prossimo", notFound: "Codice non trovato." },
  library: { emptyTitle: "Libreria vuota", emptySubtitle: "Nessun codice salvato ancora.", endOfList: "Fine dell'elenco", clickToEnlarge: "Clicca per ingrandire", downloadPng: "Scarica PNG", confirmDelete: "Eliminare questo?", unknownContact: "Contatto sconosciuto" },
  settings: { language: "Lingua", languageAuto: "Automatico (sistema)", account: "Account", about: "Informazioni app", logout: "Esci", deleteAccount: "Elimina account", deleteConfirm: "Sei sicuro di voler eliminare il tuo account? Questa azione non può essere annullata.", version: "Versione app", designedBy: "Designed by Cristian", reportProblem: "Segnala un problema" },
  modal: { unsavedTitle: "Modifiche non salvate", unsavedBody: "Hai dettagli non salvati. Se esci ora, queste modifiche andranno perse.", keepEditing: "Rimani e salva", discard: "Scarta e esci" }
};
// --- PORTUGUÊS ---
const pt = {
  common: { back: "Voltar", save: "Salvar", delete: "Deletar", cancel: "Cancelar", download: "Baixar", share: "Compartilhar", edit: "Editar", yes: "Sim", no: "Não", loading: "Carregando...", or: "ou", unknown: "Desconhecido", error: "Erro", group: "Grupo" },
  tabs: { generate: "Gerar", scan: "Escanear", library: "Biblioteca", settings: "Configurações" },
  header: { title: "QR Tool", subtitle: "Todos os seus códigos em um único lugar.", create: "Criar novo código", edit: "Editar código", scan: "Ativar câmera", library: "Códigos salvos", settings: "Preferências do app" },
  auth: { loginTitle: "QR Tool", loginSubtitle: "Todos os seus códigos em um único lugar.", googleLogin: "Entrar com Google", emailLabel: "Email", passwordLabel: "Senha", confirmPasswordLabel: "Confirmar senha", loginButton: "Entrar", forgotPassword: "Esqueceu a senha?", noAccount: "Não tem uma conta?", registerLink: "Registre-se", backToLogin: "← Voltar para o login", registerTitle: "Criar conta", registerSubtitle: "Digite seus dados para se registrar", registerButton: "Registre-se", resetTitle: "Redefinir senha", resetSubtitle: "Digite seu endereço de email e enviaremos um link para redefinir sua senha.", resetButton: "Enviar link", emailPlaceholder: "voce@email.com", passwordPlaceholder: "••••••••", errorInvalidEmail: "Endereço de email inválido.", errorUserDisabled: "Esta conta foi desativada.", errorInvalidCredential: "Email ou senha incorretos.", errorWrongPassword: "Senha incorreta.", errorEmailInUse: "Este email já está registrado.", errorWeakPassword: "A senha deve ter pelo menos 6 caracteres.", errorTooManyRequests: "Muitas tentativas. Tente novamente mais tarde.", errorGeneric: "Algo deu errado. Tente novamente.", errorFillFields: "Preencha todos os campos.", errorPasswordMismatch: "As senhas não correspondem.", errorReauthRequired: "Faça login novamente antes de deletar sua conta.", errorEmailNotVerified: "Verifique seu email primeiro. Verifique sua caixa de entrada.", resetSent: "O link para redefinir a senha foi enviado para seu email.", verifyTitle: "Verifique seu email", continueButton: "Continuar", verificationSent: "Enviamos um link de verificação para seu email. Clique nele e faça login." },
  generate: { types: { text: "Texto", url: "URL", wifi: "WiFi", password: "Senha", vcard: "VCard" }, labels: { text: "Digite o texto", url: "Digite a URL", wifiSsid: "Nome da rede (SSID)", wifiPassword: "Senha WiFi", security: "Tipo de segurança", username: "Nome de usuário / Login", password: "Senha", groupName: "Nome do grupo / Serviço", entryName: "Nome da entrada", firstName: "Primeiro nome", lastName: "Sobrenome", phone: "Telefone", email: "Email", web: "Site", company: "Empresa", jobTitle: "Cargo" }, placeholders: { text: "Ex. anotação, endereço...", url: "https://", wifiSsid: "Seu nome WiFi", wifiPassword: "Senha da rede", username: "ex. email@exemplo.com", password: "Sua senha", groupName: "ex. Netflix", entryName: "Nomeie este código", firstName: "João", lastName: "Silva", phone: "+55 11 98765 4321", email: "joao@exemplo.com", web: "https://exemplo.com", company: "Empresa Inc.", jobTitle: "Desenvolvedor" }, buttons: { scanVcard: "Escanear cartão de visita (IA)", scanningVcard: "Escaneando cartão...", takePhoto: "Tirar foto", uploadPhoto: "Enviar foto", addOptional: "+ Adicionar mais detalhes", removeOptional: "Remover", generateNew: "Gerar novo", generate: "Gerar código QR", saveChanges: "Salvar alterações" }, ai: { analyzing: "Analisando...", error: "Falha no reconhecimento. Tente outra foto." }, success: "Códigos salvos na biblioteca" },
  scan: { btnQrScan: "Escanear código QR", btnBarcodeScan: "Escanear código de barras", btnQrUpload: "Enviar código QR", btnBarcodeUpload: "Enviar código de barras", cameraPermission: "Permita o acesso à câmera nas configurações do navegador.", stopScanning: "Parar", resultLabel: "Conteúdo do código", saveToContacts: "Salvar nos contatos", openUrl: "Abrir URL", saveToLibrary: "Salvar na biblioteca", savedToLibrary: "Salvo na biblioteca", scanNext: "Escanear próximo", notFound: "Código não encontrado." },
  library: { emptyTitle: "Biblioteca vazia", emptySubtitle: "Nenhum código salvo ainda.", endOfList: "Fim da lista", clickToEnlarge: "Clique para ampliar", downloadPng: "Baixar PNG", confirmDelete: "Deletar isto?", unknownContact: "Contato desconhecido" },
  settings: { language: "Idioma", languageAuto: "Automático (sistema)", account: "Conta", about: "Sobre o app", logout: "Sair", deleteAccount: "Deletar conta", deleteConfirm: "Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.", version: "Versão do app", designedBy: "Designed by Cristian", reportProblem: "Reportar um problema" },
  modal: { unsavedTitle: "Alterações não salvas", unsavedBody: "Você tem detalhes não salvos. Se sair agora, essas alterações serão perdidas.", keepEditing: "Ficar e salvar", discard: "Descartar e sair" }
};
// --- РУССКИЙ ---
const ru = {
  common: { back: "Назад", save: "Сохранить", delete: "Удалить", cancel: "Отмена", download: "Загрузить", share: "Поделиться", edit: "Редактировать", yes: "Да", no: "Нет", loading: "Загрузка...", or: "или", unknown: "Неизвестно", error: "Ошибка", group: "Группа" },
  tabs: { generate: "Генерировать", scan: "Сканировать", library: "Библиотека", settings: "Параметры" },
  header: { title: "QR Tool", subtitle: "Все ваши коды в одном месте.", create: "Создать новый код", edit: "Редактировать код", scan: "Сфокусировать камеру", library: "Сохраненные коды", settings: "Параметры приложения" },
  auth: { loginTitle: "QR Tool", loginSubtitle: "Все ваши коды в одном месте.", googleLogin: "Войти через Google", emailLabel: "Email", passwordLabel: "Пароль", confirmPasswordLabel: "Подтвердить пароль", loginButton: "Войти", forgotPassword: "Забыли пароль?", noAccount: "Нет аккаунта?", registerLink: "Зарегистрироваться", backToLogin: "← Вернуться к входу", registerTitle: "Создать аккаунт", registerSubtitle: "Введите данные для регистрации", registerButton: "Зарегистрироваться", resetTitle: "Восстановление пароля", resetSubtitle: "Введите адрес электронной почты, и мы отправим вам ссылку для восстановления пароля.", resetButton: "Отправить ссылку для сброса", emailPlaceholder: "you@email.com", passwordPlaceholder: "••••••••", errorInvalidEmail: "Неверный адрес электронной почты.", errorUserDisabled: "Этот аккаунт отключен.", errorInvalidCredential: "Неверный email или пароль.", errorWrongPassword: "Неверный пароль.", errorEmailInUse: "Эта электронная почта уже зарегистрирована.", errorWeakPassword: "Пароль должен содержать не менее 6 символов.", errorTooManyRequests: "Слишком много попыток. Попробуйте позже.", errorGeneric: "Что-то пошло не так. Попробуйте еще раз.", errorFillFields: "Заполните все поля.", errorPasswordMismatch: "Пароли не совпадают.", errorReauthRequired: "Пожалуйста, войдите снова перед удалением аккаунта.", errorEmailNotVerified: "Сначала подтвердите свой email. Проверьте входящие.", resetSent: "Ссылка для восстановления пароля отправлена на ваш email.", verifyTitle: "Подтвердите ваш email", continueButton: "Продолжить", verificationSent: "Мы отправили ссылку подтверждения на ваш email. Нажмите на нее и затем войдите." },
  generate: { types: { text: "Текст", url: "URL", wifi: "WiFi", password: "Пароль", vcard: "VCard" }, labels: { text: "Введите текст", url: "Введите URL", wifiSsid: "Название сети (SSID)", wifiPassword: "Пароль WiFi", security: "Тип безопасности", username: "Имя пользователя / Логин", password: "Пароль", groupName: "Название группы / Сервиса", entryName: "Название записи", firstName: "Имя", lastName: "Фамилия", phone: "Телефон", email: "Email", web: "Сайт", company: "Компания", jobTitle: "Должность" }, placeholders: { text: "Например, заметка, адрес...", url: "https://", wifiSsid: "Название вашей WiFi", wifiPassword: "Пароль сети", username: "например, email@example.com", password: "Ваш пароль", groupName: "например, Netflix", entryName: "Назовите этот код", firstName: "Иван", lastName: "Петров", phone: "+7 999 123 45 67", email: "ivan@example.com", web: "https://example.com", company: "ООО Компания", jobTitle: "Разработчик" }, buttons: { scanVcard: "Сканировать визитную карточку (AI)", scanningVcard: "Сканирую карточку...", takePhoto: "Сделать фото", uploadPhoto: "Загрузить фото", addOptional: "+ Добавить детали", removeOptional: "Удалить", generateNew: "Генерировать новый", generate: "Сгенерировать QR", saveChanges: "Сохранить изменения" }, ai: { analyzing: "Анализирую...", error: "Не удалось распознать. Попробуйте другое фото." }, success: "Коды сохранены в библиотеку" },
  scan: { btnQrScan: "Сканировать QR код", btnBarcodeScan: "Сканировать штрих-код", btnQrUpload: "Загрузить QR код", btnBarcodeUpload: "Загрузить штрих-код", cameraPermission: "Пожалуйста, разрешите доступ к камере в настройках браузера.", stopScanning: "Остановить", resultLabel: "Содержание кода", saveToContacts: "Сохранить в контакты", openUrl: "Открыть URL", saveToLibrary: "Сохранить в библиотеку", savedToLibrary: "Сохранено в библиотеку", scanNext: "Сканировать следующий", notFound: "Код не найден." },
  library: { emptyTitle: "Библиотека пуста", emptySubtitle: "Сохраненных кодов еще нет.", endOfList: "Конец списка", clickToEnlarge: "Нажмите для увеличения", downloadPng: "Загрузить PNG", confirmDelete: "Удалить это?", unknownContact: "Неизвестный контакт" },
  settings: { language: "Язык", languageAuto: "Автоматически (система)", account: "Аккаунт", about: "О приложении", logout: "Выход", deleteAccount: "Удалить аккаунт", deleteConfirm: "Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя отменить.", version: "Версия приложения", designedBy: "Designed by Cristian", reportProblem: "Сообщить о проблеме" },
  modal: { unsavedTitle: "Несохраненные изменения", unsavedBody: "У вас есть несохраненные данные. Если вы уйдете, эти изменения будут потеряны.", keepEditing: "Остаться и сохранить", discard: "Отменить и уйти" }
};
// --- УКРАЇНСЬКА ---
const uk = {
  common: { back: "Назад", save: "Зберегти", delete: "Видалити", cancel: "Скасувати", download: "Завантажити", share: "Поділитися", edit: "Редагувати", yes: "Так", no: "Ні", loading: "Завантаження...", or: "або", unknown: "Невідомо", error: "Помилка", group: "Група" },
  tabs: { generate: "Створити", scan: "Сканувати", library: "Бібліотека", settings: "Параметри" },
  header: { title: "QR Tool", subtitle: "Усі ваші коди в одному місці.", create: "Створити новий код", edit: "Редагувати код", scan: "Сфокусувати камеру", library: "Збережені коди", settings: "Параметри додатку" },
  auth: { loginTitle: "QR Tool", loginSubtitle: "Усі ваші коди в одному місці.", googleLogin: "Увійти через Google", emailLabel: "Email", passwordLabel: "Пароль", confirmPasswordLabel: "Підтвердити пароль", loginButton: "Увійти", forgotPassword: "Забули пароль?", noAccount: "Немає аккаунту?", registerLink: "Зареєструватися", backToLogin: "← Повернутися до входу", registerTitle: "Створити аккаунт", registerSubtitle: "Введіть дані для реєстрації", registerButton: "Зареєструватися", resetTitle: "Відновлення пароля", resetSubtitle: "Введіть адресу електронної пошти, і ми надішлемо вам посилання для відновлення пароля.", resetButton: "Надіслати посилання для скидання", emailPlaceholder: "you@email.com", passwordPlaceholder: "••••••••", errorInvalidEmail: "Неправильна адреса електронної пошти.", errorUserDisabled: "Цей аккаунт вимкнено.", errorInvalidCredential: "Неправильний email або пароль.", errorWrongPassword: "Неправильний пароль.", errorEmailInUse: "Ця електронна пошта вже зареєстрована.", errorWeakPassword: "Пароль повинен містити щонайменше 6 символів.", errorTooManyRequests: "Занадто багато спроб. Спробуйте пізніше.", errorGeneric: "Щось пішло не так. Спробуйте ще раз.", errorFillFields: "Заповніть усі поля.", errorPasswordMismatch: "Паролі не збігаються.", errorReauthRequired: "Будь ласка, увійдіть знову перед видаленням аккаунту.", errorEmailNotVerified: "Спочатку підтвердіть свій email. Перевірте вхідні.", resetSent: "Посилання для відновлення пароля надіслано на ваш email.", verifyTitle: "Підтвердіть ваш email", continueButton: "Продовжити", verificationSent: "Ми надіслали посилання для підтвердження на ваш email. Натисніть на нього і потім увійдіть." },
  generate: { types: { text: "Текст", url: "URL", wifi: "WiFi", password: "Пароль", vcard: "VCard" }, labels: { text: "Введіть текст", url: "Введіть URL", wifiSsid: "Назва мережі (SSID)", wifiPassword: "Пароль WiFi", security: "Тип безпеки", username: "Ім'я користувача / Логін", password: "Пароль", groupName: "Назва групи / Сервісу", entryName: "Назва запису", firstName: "Ім'я", lastName: "Прізвище", phone: "Телефон", email: "Email", web: "Сайт", company: "Компанія", jobTitle: "Посада" }, placeholders: { text: "Наприклад, замітка, адреса...", url: "https://", wifiSsid: "Назва вашої WiFi", wifiPassword: "Пароль мережі", username: "наприклад, email@example.com", password: "Ваш пароль", groupName: "наприклад, Netflix", entryName: "Назвіть цей код", firstName: "Сергій", lastName: "Коваленко", phone: "+38 066 123 45 67", email: "sergiy@example.com", web: "https://example.com", company: "ТОВ Компанія", jobTitle: "Розробник" }, buttons: { scanVcard: "Сканувати візитну картку (AI)", scanningVcard: "Сканую картку...", takePhoto: "Зробити фото", uploadPhoto: "Завантажити фото", addOptional: "+ Додати деталі", removeOptional: "Видалити", generateNew: "Генерувати новий", generate: "Генерувати QR", saveChanges: "Зберегти зміни" }, ai: { analyzing: "Аналізую...", error: "Не вдалося розпізнати. Спробуйте інше фото." }, success: "Коди збережені до бібліотеки" },
  scan: { btnQrScan: "Сканувати QR код", btnBarcodeScan: "Сканувати штрих-код", btnQrUpload: "Завантажити QR код", btnBarcodeUpload: "Завантажити штрих-код", cameraPermission: "Будь ласка, дозвольте доступ до камери в налаштуваннях браузера.", stopScanning: "Зупинити", resultLabel: "Вміст коду", saveToContacts: "Зберегти в контакти", openUrl: "Відкрити URL", saveToLibrary: "Зберегти до бібліотеки", savedToLibrary: "Збережено до бібліотеки", scanNext: "Сканувати наступний", notFound: "Код не знайдено." },
  library: { emptyTitle: "Бібліотека пуста", emptySubtitle: "Збережених кодів ще немає.", endOfList: "Кінець списку", clickToEnlarge: "Натисніть для збільшення", downloadPng: "Завантажити PNG", confirmDelete: "Видалити це?", unknownContact: "Невідомий контакт" },
  settings: { language: "Мова", languageAuto: "Автоматично (система)", account: "Аккаунт", about: "Про додаток", logout: "Вийти", deleteAccount: "Видалити аккаунт", deleteConfirm: "Ви впевнені, що хочете видалити свій аккаунт? Цю дію не можна скасувати.", version: "Версія додатку", designedBy: "Designed by Cristian", reportProblem: "Повідомити про проблему" },
  modal: { unsavedTitle: "Незбережені зміни", unsavedBody: "У вас є незбережені дані. Якщо ви підете, ці зміни будуть втрачені.", keepEditing: "Залишитися і зберегти", discard: "Скасувати і піти" }
};
// --- TÜRKÇE ---
const tr = {
  common: { back: "Geri", save: "Kaydet", delete: "Sil", cancel: "İptal", download: "İndir", share: "Paylaş", edit: "Düzenle", yes: "Evet", no: "Hayır", loading: "Yükleniyor...", or: "veya", unknown: "Bilinmeyen", error: "Hata", group: "Grup" },
  tabs: { generate: "Oluştur", scan: "Tara", library: "Kütüphane", settings: "Ayarlar" },
  header: { title: "QR Tool", subtitle: "Tüm kodlarınız tek bir yerde.", create: "Yeni kod oluştur", edit: "Kodu düzenle", scan: "Kamerayı odakla", library: "Kaydedilen kodlar", settings: "Uygulama tercihleri" },
  auth: { loginTitle: "QR Tool", loginSubtitle: "Tüm kodlarınız tek bir yerde.", googleLogin: "Google ile oturum aç", emailLabel: "E-posta", passwordLabel: "Parola", confirmPasswordLabel: "Parolayı onayla", loginButton: "Oturum aç", forgotPassword: "Parolayı mı unuttunuz?", noAccount: "Hesabınız yok mu?", registerLink: "Kaydol", backToLogin: "← Oturum açma sayfasına dön", registerTitle: "Hesap oluştur", registerSubtitle: "Kaydolmak için bilgilerinizi girin", registerButton: "Kaydol", resetTitle: "Parolayı sıfırla", resetSubtitle: "E-posta adresinizi girin ve parolanızı sıfırlamak için size bir bağlantı göndereceğiz.", resetButton: "Sıfırlama bağlantısı gönder", emailPlaceholder: "you@email.com", passwordPlaceholder: "••••••••", errorInvalidEmail: "Geçersiz e-posta adresi.", errorUserDisabled: "Bu hesap devre dışı bırakılmış.", errorInvalidCredential: "Hatalı e-posta veya parola.", errorWrongPassword: "Hatalı parola.", errorEmailInUse: "Bu e-posta zaten kayıtlı.", errorWeakPassword: "Parola en az 6 karakter olmalıdır.", errorTooManyRequests: "Çok fazla deneme. Lütfen daha sonra tekrar deneyiniz.", errorGeneric: "Bir şeyler yanlış gitti. Lütfen tekrar deneyiniz.", errorFillFields: "Lütfen tüm alanları doldurunuz.", errorPasswordMismatch: "Parolalar eşleşmiyor.", errorReauthRequired: "Hesabınızı silmeden önce lütfen tekrar oturum açınız.", errorEmailNotVerified: "Lütfen önce e-postanızı doğrulayınız. Gelen kutunuzu kontrol ediniz.", resetSent: "Parola sıfırlama bağlantısı e-postanıza gönderildi.", verifyTitle: "E-postanızı doğrulayın", continueButton: "Devam et", verificationSent: "E-postanıza doğrulama bağlantısı gönderdik. Üzerine tıklayın ve oturum açın." },
  generate: { types: { text: "Metin", url: "URL", wifi: "WiFi", password: "Parola", vcard: "VCard" }, labels: { text: "Metin girin", url: "URL girin", wifiSsid: "Ağ Adı (SSID)", wifiPassword: "WiFi Parolası", security: "Güvenlik Türü", username: "Kullanıcı Adı / Giriş", password: "Parola", groupName: "Grup / Hizmet Adı", entryName: "Giriş Adı", firstName: "Ad", lastName: "Soyadı", phone: "Telefon", email: "E-posta", web: "Web Sitesi", company: "Şirket", jobTitle: "İş Ünvanı" }, placeholders: { text: "Örn. not, adres...", url: "https://", wifiSsid: "WiFi Adınız", wifiPassword: "Ağ Şifresi", username: "örn. email@example.com", password: "Parolanız", groupName: "örn. Netflix", entryName: "Bu kodu adlandırın", firstName: "Ahmet", lastName: "Yılmaz", phone: "+90 555 123 45 67", email: "ahmet@example.com", web: "https://example.com", company: "Örnek A.Ş.", jobTitle: "Geliştirici" }, buttons: { scanVcard: "Kartvizit Tara (AI)", scanningVcard: "Kart taranıyor...", takePhoto: "Fotoğraf Çek", uploadPhoto: "Fotoğraf Yükle", addOptional: "+ Daha fazla ayrıntı ekle", removeOptional: "Kaldır", generateNew: "Yeni Oluştur", generate: "QR Oluştur", saveChanges: "Değişiklikleri Kaydet" }, ai: { analyzing: "Analiz ediliyor...", error: "Tanımlama başarısız. Başka bir fotoğraf deneyin." }, success: "Kodlar kütüphaneye kaydedildi" },
  scan: { btnQrScan: "QR Kod Tara", btnBarcodeScan: "Barkod Tara", btnQrUpload: "QR Kod Yükle", btnBarcodeUpload: "Barkod Yükle", cameraPermission: "Lütfen tarayıcı ayarlarında kamera erişimine izin verin.", stopScanning: "Durdur", resultLabel: "Kod İçeriği", saveToContacts: "Kişilere Kaydet", openUrl: "URL Aç", saveToLibrary: "Kütüphaneye Kaydet", savedToLibrary: "Kütüphaneye Kaydedildi", scanNext: "Sonrakini Tara", notFound: "Kod bulunamadı." },
  library: { emptyTitle: "Kütüphane boş", emptySubtitle: "Henüz kaydedilen kod yok.", endOfList: "Listenin sonu", clickToEnlarge: "Büyütmek için tıklayın", downloadPng: "PNG İndir", confirmDelete: "Bunu sil?", unknownContact: "Bilinmeyen Kişi" },
  settings: { language: "Dil", languageAuto: "Otomatik (sistem)", account: "Hesap", about: "Uygulama Hakkında", logout: "Çıkış yap", deleteAccount: "Hesabı sil", deleteConfirm: "Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.", version: "Uygulama Sürümü", designedBy: "Designed by Cristian", reportProblem: "Sorun bildir" },
  modal: { unsavedTitle: "Kaydedilmemiş Değişiklikler", unsavedBody: "Kaydedilmemiş ayrıntılarınız var. Şimdi ayrılırsanız, bu değişiklikler kaybolur.", keepEditing: "Kal ve Kaydet", discard: "Vazgeç ve Ayrıl" }
};
// --- TIẾNG VIỆT ---
const vi = {
  common: { back: "Quay lại", save: "Lưu", delete: "Xóa", cancel: "Hủy", download: "Tải xuống", share: "Chia sẻ", edit: "Chỉnh sửa", yes: "Có", no: "Không", loading: "Đang tải...", or: "hoặc", unknown: "Không xác định", error: "Lỗi", group: "Nhóm" },
  tabs: { generate: "Tạo", scan: "Quét", library: "Thư viện", settings: "Cài đặt" },
  header: { title: "QR Tool", subtitle: "Tất cả mã của bạn ở một nơi.", create: "Tạo mã mới", edit: "Chỉnh sửa mã", scan: "Lấy nét camera", library: "Mã đã lưu", settings: "Tùy chọn ứng dụng" },
  auth: { loginTitle: "QR Tool", loginSubtitle: "Tất cả mã của bạn ở một nơi.", googleLogin: "Đăng nhập bằng Google", emailLabel: "Email", passwordLabel: "Mật khẩu", confirmPasswordLabel: "Xác nhận mật khẩu", loginButton: "Đăng nhập", forgotPassword: "Quên mật khẩu?", noAccount: "Chưa có tài khoản?", registerLink: "Đăng ký", backToLogin: "← Quay lại đăng nhập", registerTitle: "Tạo tài khoản", registerSubtitle: "Nhập thông tin của bạn để đăng ký", registerButton: "Đăng ký", resetTitle: "Đặt lại mật khẩu", resetSubtitle: "Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu.", resetButton: "Gửi liên kết đặt lại", emailPlaceholder: "you@email.com", passwordPlaceholder: "••••••••", errorInvalidEmail: "Địa chỉ email không hợp lệ.", errorUserDisabled: "Tài khoản này đã bị vô hiệu hóa.", errorInvalidCredential: "Email hoặc mật khẩu không chính xác.", errorWrongPassword: "Mật khẩu không chính xác.", errorEmailInUse: "Email này đã được đăng ký.", errorWeakPassword: "Mật khẩu phải có ít nhất 6 ký tự.", errorTooManyRequests: "Quá nhiều lần thử. Vui lòng thử lại sau.", errorGeneric: "Có điều gì đó sai. Vui lòng thử lại.", errorFillFields: "Vui lòng điền vào tất cả các trường.", errorPasswordMismatch: "Mật khẩu không khớp.", errorReauthRequired: "Vui lòng đăng nhập lại trước khi xóa tài khoản.", errorEmailNotVerified: "Vui lòng xác minh email của bạn trước. Kiểm tra hộp thư.", resetSent: "Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.", verifyTitle: "Xác minh email của bạn", continueButton: "Tiếp tục", verificationSent: "Chúng tôi đã gửi liên kết xác minh đến email của bạn. Nhấp vào nó rồi đăng nhập." },
  generate: { types: { text: "Văn bản", url: "URL", wifi: "WiFi", password: "Mật khẩu", vcard: "VCard" }, labels: { text: "Nhập văn bản", url: "Nhập URL", wifiSsid: "Tên mạng (SSID)", wifiPassword: "Mật khẩu WiFi", security: "Loại bảo mật", username: "Tên đăng nhập", password: "Mật khẩu", groupName: "Tên nhóm / Dịch vụ", entryName: "Tên mục nhập", firstName: "Tên", lastName: "Họ", phone: "Điện thoại", email: "Email", web: "Website", company: "Công ty", jobTitle: "Chức danh" }, placeholders: { text: "Ví dụ: ghi chú, địa chỉ...", url: "https://", wifiSsid: "Tên WiFi của bạn", wifiPassword: "Mật khẩu mạng", username: "ví dụ: email@example.com", password: "Mật khẩu của bạn", groupName: "ví dụ: Netflix", entryName: "Đặt tên cho mã này", firstName: "Tuấn", lastName: "Nguyễn", phone: "+84 123 456 789", email: "tuan@example.com", web: "https://example.com", company: "Công ty ABC", jobTitle: "Lập trình viên" }, buttons: { scanVcard: "Quét danh thiếp (AI)", scanningVcard: "Đang quét danh thiếp...", takePhoto: "Chụp ảnh", uploadPhoto: "Tải ảnh lên", addOptional: "+ Thêm chi tiết khác", removeOptional: "Xóa", generateNew: "Tạo mới", generate: "Tạo QR", saveChanges: "Lưu thay đổi" }, ai: { analyzing: "Đang phân tích...", error: "Không thể nhận diện. Hãy thử ảnh khác." }, success: "Mã đã được lưu vào thư viện" },
  scan: { btnQrScan: "Quét mã QR", btnBarcodeScan: "Quét mã vạch", btnQrUpload: "Tải lên mã QR", btnBarcodeUpload: "Tải lên mã vạch", cameraPermission: "Vui lòng cho phép truy cập camera trong cài đặt trình duyệt.", stopScanning: "Dừng", resultLabel: "Nội dung mã", saveToContacts: "Lưu vào Danh bạ", openUrl: "Mở URL", saveToLibrary: "Lưu vào Thư viện", savedToLibrary: "Đã lưu vào Thư viện", scanNext: "Quét tiếp theo", notFound: "Không tìm thấy mã." },
  library: { emptyTitle: "Thư viện trống", emptySubtitle: "Chưa có mã nào được lưu.", endOfList: "Cuối danh sách", clickToEnlarge: "Nhấp để phóng to", downloadPng: "Tải xuống PNG", confirmDelete: "Xóa cái này?", unknownContact: "Danh bạ không xác định" },
  settings: { language: "Ngôn ngữ", languageAuto: "Tự động (hệ thống)", account: "Tài khoản", about: "Thông tin ứng dụng", logout: "Đăng xuất", deleteAccount: "Xóa tài khoản", deleteConfirm: "Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể được hoàn tác.", version: "Phiên bản ứng dụng", designedBy: "Designed by Cristian", reportProblem: "Báo cáo vấn đề" },
  modal: { unsavedTitle: "Có thay đổi chưa lưu", unsavedBody: "Bạn có những chi tiết chưa lưu. Nếu bạn rời đi, những thay đổi này sẽ bị mất.", keepEditing: "Ở lại và Lưu", discard: "Hủy và Rời đi" }
};
// --- 中文 ---
const zh = {
  common: { back: "返回", save: "保存", delete: "删除", cancel: "取消", download: "下载", share: "分享", edit: "编辑", yes: "是", no: "否", loading: "加载中...", or: "或", unknown: "未知", error: "错误", group: "分组" },
  tabs: { generate: "生成", scan: "扫描", library: "库", settings: "设置" },
  header: { title: "QR Tool", subtitle: "所有代码集中在一个地方。", create: "创建新代码", edit: "编辑代码", scan: "对焦相机", library: "已保存的代码", settings: "应用偏好设置" },
  auth: { loginTitle: "QR Tool", loginSubtitle: "所有代码集中在一个地方。", googleLogin: "使用 Google 登录", emailLabel: "邮箱", passwordLabel: "密码", confirmPasswordLabel: "确认密码", loginButton: "登录", forgotPassword: "忘记密码?", noAccount: "没有账户?", registerLink: "注册", backToLogin: "← 返回登录", registerTitle: "创建账户", registerSubtitle: "输入您的信息进行注册", registerButton: "注册", resetTitle: "重置密码", resetSubtitle: "输入您的电子邮件地址，我们将发送一个链接来重置您的密码。", resetButton: "发送重置链接", emailPlaceholder: "you@email.com", passwordPlaceholder: "••••••••", errorInvalidEmail: "无效的电子邮件地址。", errorUserDisabled: "此账户已被禁用。", errorInvalidCredential: "邮箱或密码不正确。", errorWrongPassword: "密码不正确。", errorEmailInUse: "此电子邮件已注册。", errorWeakPassword: "密码必须至少6个字符。", errorTooManyRequests: "尝试次数过多。请稍后再试。", errorGeneric: "出错了。请重试。", errorFillFields: "请填写所有字段。", errorPasswordMismatch: "密码不匹配。", errorReauthRequired: "删除账户前，请重新登录。", errorEmailNotVerified: "请先验证您的电子邮件。检查您的收件箱。", resetSent: "密码重置链接已发送到您的电子邮件。", verifyTitle: "验证您的电子邮件", continueButton: "继续", verificationSent: "我们已将验证链接发送到您的电子邮件。点击它然后登录。" },
  generate: { types: { text: "文本", url: "URL", wifi: "WiFi", password: "密码", vcard: "VCard" }, labels: { text: "输入文本", url: "输入URL", wifiSsid: "网络名称 (SSID)", wifiPassword: "WiFi密码", security: "安全类型", username: "用户名 / 登录", password: "密码", groupName: "分组 / 服务名称", entryName: "条目名称", firstName: "名", lastName: "姓", phone: "电话", email: "邮箱", web: "网站", company: "公司", jobTitle: "职位" }, placeholders: { text: "如：备注、地址...", url: "https://", wifiSsid: "您的WiFi名称", wifiPassword: "网络密码", username: "如：email@example.com", password: "您的密码", groupName: "如：Netflix", entryName: "给此代码命名", firstName: "张", lastName: "三", phone: "+86 123 4567 8901", email: "zhang@example.com", web: "https://example.com", company: "示例公司有限公司", jobTitle: "开发者" }, buttons: { scanVcard: "扫描名片 (AI)", scanningVcard: "正在扫描名片...", takePhoto: "拍照", uploadPhoto: "上传照片", addOptional: "+ 添加更多详情", removeOptional: "移除", generateNew: "生成新的", generate: "生成二维码", saveChanges: "保存更改" }, ai: { analyzing: "正在分析...", error: "无法识别。请尝试另一张照片。" }, success: "代码已保存到库" },
  scan: { btnQrScan: "扫描二维码", btnBarcodeScan: "扫描条形码", btnQrUpload: "上传二维码", btnBarcodeUpload: "上传条形码", cameraPermission: "请在浏览器设置中允许相机访问。", stopScanning: "停止", resultLabel: "代码内容", saveToContacts: "保存到联系人", openUrl: "打开URL", saveToLibrary: "保存到库", savedToLibrary: "已保存到库", scanNext: "扫描下一个", notFound: "未找到代码。" },
  library: { emptyTitle: "库为空", emptySubtitle: "还没有保存的代码。", endOfList: "列表末尾", clickToEnlarge: "点击放大", downloadPng: "下载PNG", confirmDelete: "删除此项?", unknownContact: "未知联系人" },
  settings: { language: "语言", languageAuto: "自动 (系统)", account: "账户", about: "关于应用", logout: "登出", deleteAccount: "删除账户", deleteConfirm: "您确定要删除您的账户吗?此操作无法撤销。", version: "应用版本", designedBy: "Designed by Cristian", reportProblem: "报告问题" },
  modal: { unsavedTitle: "未保存的更改", unsavedBody: "您有未保存的详情。如果现在离开，这些更改将丢失。", keepEditing: "保留并保存", discard: "放弃并离开" }
};
// --- 日本語 ---
const ja = {
  common: { back: "戻る", save: "保存", delete: "削除", cancel: "キャンセル", download: "ダウンロード", share: "共有", edit: "編集", yes: "はい", no: "いいえ", loading: "読み込み中...", or: "または", unknown: "不明", error: "エラー", group: "グループ" },
  tabs: { generate: "作成", scan: "スキャン", library: "ライブラリ", settings: "設定" },
  header: { title: "QR Tool", subtitle: "すべてのコードを一箇所に。", create: "新しいコードを作成", edit: "コードを編集", scan: "カメラにフォーカス", library: "保存済みコード", settings: "アプリの設定" },
  auth: { loginTitle: "QR Tool", loginSubtitle: "すべてのコードを一箇所に。", googleLogin: "Google でサインイン", emailLabel: "メール", passwordLabel: "パスワード", confirmPasswordLabel: "パスワード確認", loginButton: "サインイン", forgotPassword: "パスワードをお忘れですか?", noAccount: "アカウントをお持ちでないですか?", registerLink: "サインアップ", backToLogin: "← ログインに戻る", registerTitle: "アカウント作成", registerSubtitle: "登録するために詳細を入力してください", registerButton: "サインアップ", resetTitle: "パスワードをリセット", resetSubtitle: "メールアドレスを入力してください。パスワードをリセットするためのリンクをお送りします。", resetButton: "リセットリンクを送信", emailPlaceholder: "you@email.com", passwordPlaceholder: "••••••••", errorInvalidEmail: "無効なメールアドレス。", errorUserDisabled: "このアカウントは無効になっています。", errorInvalidCredential: "メールアドレスまたはパスワードが正しくありません。", errorWrongPassword: "パスワードが正しくありません。", errorEmailInUse: "このメールアドレスは既に登録されています。", errorWeakPassword: "パスワードは最低6文字である必要があります。", errorTooManyRequests: "試行回数が多すぎます。後でもう一度お試しください。", errorGeneric: "エラーが発生しました。もう一度お試しください。", errorFillFields: "すべてのフィールドに入力してください。", errorPasswordMismatch: "パスワードが一致しません。", errorReauthRequired: "アカウントを削除する前に、もう一度サインインしてください。", errorEmailNotVerified: "まずメールアドレスを確認してください。受信トレイを確認してください。", resetSent: "パスワードリセットリンクがメールアドレスに送信されました。", verifyTitle: "メールアドレスを確認", continueButton: "続ける", verificationSent: "確認リンクをメールアドレスに送信しました。それをクリックしてからサインインしてください。" },
  generate: { types: { text: "テキスト", url: "URL", wifi: "WiFi", password: "パスワード", vcard: "VCard" }, labels: { text: "テキストを入力", url: "URLを入力", wifiSsid: "ネットワーク名 (SSID)", wifiPassword: "WiFiパスワード", security: "セキュリティタイプ", username: "ユーザー名 / ログイン", password: "パスワード", groupName: "グループ / サービス名", entryName: "エントリ名", firstName: "名", lastName: "姓", phone: "電話", email: "メール", web: "ウェブサイト", company: "会社", jobTitle: "職位" }, placeholders: { text: "例：メモ、住所...", url: "https://", wifiSsid: "あなたのWiFi名", wifiPassword: "ネットワークパスワード", username: "例：email@example.com", password: "あなたのパスワード", groupName: "例：Netflix", entryName: "このコードに名前を付けます", firstName: "太郎", lastName: "山田", phone: "+81 90 1234 5678", email: "taro@example.com", web: "https://example.com", company: "株式会社サンプル", jobTitle: "開発者" }, buttons: { scanVcard: "名刺をスキャン (AI)", scanningVcard: "名刺をスキャン中...", takePhoto: "写真を撮る", uploadPhoto: "写真をアップロード", addOptional: "+ 詳細情報を追加", removeOptional: "削除", generateNew: "新しいものを生成", generate: "QRコードを生成", saveChanges: "変更を保存" }, ai: { analyzing: "分析中...", error: "認識できません。別の写真を試してください。" }, success: "コードがライブラリに保存されました" },
  scan: { btnQrScan: "QRコードをスキャン", btnBarcodeScan: "バーコードをスキャン", btnQrUpload: "QRコードをアップロード", btnBarcodeUpload: "バーコードをアップロード", cameraPermission: "ブラウザ設定でカメラアクセスを許可してください。", stopScanning: "停止", resultLabel: "コード内容", saveToContacts: "連絡先に保存", openUrl: "URLを開く", saveToLibrary: "ライブラリに保存", savedToLibrary: "ライブラリに保存されました", scanNext: "次をスキャン", notFound: "コードが見つかりません。" },
  library: { emptyTitle: "ライブラリが空です", emptySubtitle: "まだ保存されたコードはありません。", endOfList: "リストの終了", clickToEnlarge: "クリックして拡大", downloadPng: "PNGをダウンロード", confirmDelete: "これを削除しますか?", unknownContact: "不明な連絡先" },
  settings: { language: "言語", languageAuto: "自動 (システム)", account: "アカウント", about: "アプリについて", logout: "ログアウト", deleteAccount: "アカウントを削除", deleteConfirm: "本当にアカウントを削除しますか?このアクションは取り消すことができません。", version: "アプリバージョン", designedBy: "Designed by Cristian", reportProblem: "問題を報告" },
  modal: { unsavedTitle: "保存されていない変更", unsavedBody: "保存されていない詳細があります。今離れると、これらの変更は失われます。", keepEditing: "留まって保存", discard: "破棄して離れる" }
};
// --- 한국어 ---
const ko = {
  common: { back: "뒤로", save: "저장", delete: "삭제", cancel: "취소", download: "다운로드", share: "공유", edit: "편집", yes: "예", no: "아니오", loading: "로딩 중...", or: "또는", unknown: "알 수 없음", error: "오류", group: "그룹" },
  tabs: { generate: "생성", scan: "스캔", library: "라이브러리", settings: "설정" },
  header: { title: "QR Tool", subtitle: "모든 코드를 한 곳에.", create: "새 코드 만들기", edit: "코드 편집", scan: "카메라 초점 맞추기", library: "저장된 코드", settings: "앱 설정" },
  auth: { loginTitle: "QR Tool", loginSubtitle: "모든 코드를 한 곳에.", googleLogin: "Google로 로그인", emailLabel: "이메일", passwordLabel: "비밀번호", confirmPasswordLabel: "비밀번호 확인", loginButton: "로그인", forgotPassword: "비밀번호를 잊으셨나요?", noAccount: "계정이 없으신가요?", registerLink: "가입", backToLogin: "← 로그인으로 돌아가기", registerTitle: "계정 만들기", registerSubtitle: "등록하려면 세부 정보를 입력하세요", registerButton: "가입", resetTitle: "비밀번호 재설정", resetSubtitle: "이메일 주소를 입력하시면 비밀번호를 재설정할 수 있는 링크를 보내드립니다.", resetButton: "재설정 링크 전송", emailPlaceholder: "you@email.com", passwordPlaceholder: "••••••••", errorInvalidEmail: "올바르지 않은 이메일 주소입니다.", errorUserDisabled: "이 계정은 비활성화되었습니다.", errorInvalidCredential: "잘못된 이메일 또는 비밀번호입니다.", errorWrongPassword: "잘못된 비밀번호입니다.", errorEmailInUse: "이 이메일은 이미 등록되었습니다.", errorWeakPassword: "비밀번호는 최소 6자 이상이어야 합니다.", errorTooManyRequests: "시도 횟수가 너무 많습니다. 나중에 다시 시도하세요.", errorGeneric: "오류가 발생했습니다. 다시 시도하세요.", errorFillFields: "모든 필드를 입력하세요.", errorPasswordMismatch: "비밀번호가 일치하지 않습니다.", errorReauthRequired: "계정을 삭제하기 전에 다시 로그인하세요.", errorEmailNotVerified: "먼저 이메일을 확인하세요. 받은편지함을 확인하세요.", resetSent: "비밀번호 재설정 링크가 이메일로 전송되었습니다.", verifyTitle: "이메일 확인", continueButton: "계속", verificationSent: "확인 링크를 이메일로 전송했습니다. 클릭한 후 로그인하세요." },
  generate: { types: { text: "텍스트", url: "URL", wifi: "WiFi", password: "비밀번호", vcard: "VCard" }, labels: { text: "텍스트 입력", url: "URL 입력", wifiSsid: "네트워크 이름(SSID)", wifiPassword: "WiFi 비밀번호", security: "보안 유형", username: "사용자명 / 로그인", password: "비밀번호", groupName: "그룹 / 서비스 이름", entryName: "항목 이름", firstName: "이름", lastName: "성", phone: "전화번호", email: "이메일", web: "웹사이트", company: "회사", jobTitle: "직책" }, placeholders: { text: "예: 메모, 주소...", url: "https://", wifiSsid: "WiFi 이름", wifiPassword: "네트워크 비밀번호", username: "예: email@example.com", password: "비밀번호", groupName: "예: Netflix", entryName: "이 코드의 이름", firstName: "철수", lastName: "김", phone: "+82 10 1234 5678", email: "kim@example.com", web: "https://example.com", company: "주식회사 예시", jobTitle: "개발자" }, buttons: { scanVcard: "명함 스캔 (AI)", scanningVcard: "명함 스캔 중...", takePhoto: "사진 촬영", uploadPhoto: "사진 업로드", addOptional: "+ 더 많은 세부정보 추가", removeOptional: "제거", generateNew: "새로 생성", generate: "QR 생성", saveChanges: "변경사항 저장" }, ai: { analyzing: "분석 중...", error: "인식 실패. 다른 사진을 시도해주세요." }, success: "코드가 라이브러리에 저장되었습니다" },
  scan: { btnQrScan: "QR 코드 스캔", btnBarcodeScan: "바코드 스캔", btnQrUpload: "QR 코드 업로드", btnBarcodeUpload: "바코드 업로드", cameraPermission: "브라우저 설정에서 카메라 액세스를 허용해주세요.", stopScanning: "중지", resultLabel: "코드 내용", saveToContacts: "연락처에 저장", openUrl: "URL 열기", saveToLibrary: "라이브러리에 저장", savedToLibrary: "라이브러리에 저장됨", scanNext: "다음 스캔", notFound: "코드를 찾을 수 없습니다." },
  library: { emptyTitle: "라이브러리가 비어있습니다", emptySubtitle: "저장된 코드가 아직 없습니다.", endOfList: "목록의 끝", clickToEnlarge: "클릭하여 확대", downloadPng: "PNG 다운로드", confirmDelete: "삭제하시겠습니까?", unknownContact: "알 수 없는 연락처" },
  settings: { language: "언어", languageAuto: "자동 (시스템)", account: "계정", about: "앱 정보", logout: "로그아웃", deleteAccount: "계정 삭제", deleteConfirm: "정말로 계정을 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.", version: "앱 버전", designedBy: "Designed by Cristian", reportProblem: "문제 보고" },
  modal: { unsavedTitle: "저장되지 않은 변경사항", unsavedBody: "저장되지 않은 세부정보가 있습니다. 지금 나가시면 이 변경사항이 손실됩니다.", keepEditing: "머무르기 및 저장", discard: "변경사항 버리고 나가기" }
};
// --- العربية ---
const ar = {
  common: { back: "رجوع", save: "حفظ", delete: "حذف", cancel: "إلغاء", download: "تنزيل", share: "مشاركة", edit: "تحرير", yes: "نعم", no: "لا", loading: "جاري التحميل...", or: "أو", unknown: "غير معروف", error: "خطأ", group: "مجموعة" },
  tabs: { generate: "إنشاء", scan: "مسح", library: "المكتبة", settings: "الإعدادات" },
  header: { title: "QR Tool", subtitle: "جميع أكوادك في مكان واحد.", create: "إنشاء رمز جديد", edit: "تحرير الرمز", scan: "تركيز الكاميرا", library: "الرموز المحفوظة", settings: "تفضيلات التطبيق" },
  auth: { loginTitle: "QR Tool", loginSubtitle: "جميع أكوادك في مكان واحد.", googleLogin: "تسجيل الدخول باستخدام Google", emailLabel: "البريد الإلكتروني", passwordLabel: "كلمة المرور", confirmPasswordLabel: "تأكيد كلمة المرور", loginButton: "تسجيل الدخول", forgotPassword: "هل نسيت كلمة المرور؟", noAccount: "ليس لديك حساب؟", registerLink: "إنشاء حساب", backToLogin: "→ العودة إلى تسجيل الدخول", registerTitle: "إنشاء حساب", registerSubtitle: "أدخل التفاصيل الخاصة بك للتسجيل", registerButton: "إنشاء حساب", resetTitle: "إعادة تعيين كلمة المرور", resetSubtitle: "أدخل عنوان بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور.", resetButton: "إرسال رابط إعادة التعيين", emailPlaceholder: "you@email.com", passwordPlaceholder: "••••••••", errorInvalidEmail: "عنوان بريد إلكتروني غير صحيح.", errorUserDisabled: "تم تعطيل هذا الحساب.", errorInvalidCredential: "بريد إلكتروني أو كلمة مرور غير صحيحة.", errorWrongPassword: "كلمة المرور غير صحيحة.", errorEmailInUse: "هذا البريد الإلكتروني مسجل بالفعل.", errorWeakPassword: "يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل.", errorTooManyRequests: "عدد كبير جدا من المحاولات. يرجى المحاولة لاحقا.", errorGeneric: "حدث خطأ ما. يرجى المحاولة مرة أخرى.", errorFillFields: "يرجى ملء جميع الحقول.", errorPasswordMismatch: "كلمات المرور غير متطابقة.", errorReauthRequired: "يرجى تسجيل الدخول مرة أخرى قبل حذف حسابك.", errorEmailNotVerified: "يرجى التحقق من بريدك الإلكتروني أولاً. تحقق من صندوق الوارد.", resetSent: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.", verifyTitle: "التحقق من بريدك الإلكتروني", continueButton: "متابعة", verificationSent: "لقد أرسلنا رابط التحقق إلى بريدك الإلكتروني. انقر عليه ثم قم بتسجيل الدخول." },
  generate: { types: { text: "نص", url: "URL", wifi: "WiFi", password: "كلمة المرور", vcard: "VCard" }, labels: { text: "أدخل النص", url: "أدخل URL", wifiSsid: "اسم الشبكة (SSID)", wifiPassword: "كلمة مرور WiFi", security: "نوع الأمان", username: "اسم المستخدم / تسجيل الدخول", password: "كلمة المرور", groupName: "اسم المجموعة / الخدمة", entryName: "اسم الإدخال", firstName: "الاسم الأول", lastName: "اسم العائلة", phone: "الهاتف", email: "البريد الإلكتروني", web: "الموقع الإلكتروني", company: "الشركة", jobTitle: "المسمى الوظيفي" }, placeholders: { text: "مثال: ملاحظة، عنوان...", url: "https://", wifiSsid: "اسم WiFi الخاص بك", wifiPassword: "كلمة مرور الشبكة", username: "مثال: email@example.com", password: "كلمة المرور الخاصة بك", groupName: "مثال: Netflix", entryName: "أعط هذا الرمز اسماً", firstName: "أحمد", lastName: "محمد", phone: "+966 50 1234 5678", email: "ahmad@example.com", web: "https://example.com", company: "الشركة العربية", jobTitle: "مطور" }, buttons: { scanVcard: "مسح بطاقة العمل (AI)", scanningVcard: "جاري مسح البطاقة...", takePhoto: "التقط صورة", uploadPhoto: "تحميل صورة", addOptional: "+ إضافة المزيد من التفاصيل", removeOptional: "إزالة", generateNew: "إنشاء جديد", generate: "إنشاء رمز QR", saveChanges: "حفظ التغييرات" }, ai: { analyzing: "جاري التحليل...", error: "فشل التعرف. حاول صورة أخرى." }, success: "تم حفظ الرموز في المكتبة" },
  scan: { btnQrScan: "مسح رمز QR", btnBarcodeScan: "مسح الباركود", btnQrUpload: "تحميل رمز QR", btnBarcodeUpload: "تحميل الباركود", cameraPermission: "يرجى السماح بالوصول إلى الكاميرا في إعدادات المتصفح.", stopScanning: "إيقاف", resultLabel: "محتوى الرمز", saveToContacts: "حفظ إلى جهات الاتصال", openUrl: "فتح URL", saveToLibrary: "حفظ في المكتبة", savedToLibrary: "تم الحفظ في المكتبة", scanNext: "المسح التالي", notFound: "لم يتم العثور على الرمز." },
  library: { emptyTitle: "المكتبة فارغة", emptySubtitle: "لا توجد رموز محفوظة بعد.", endOfList: "نهاية القائمة", clickToEnlarge: "انقر للتكبير", downloadPng: "تنزيل PNG", confirmDelete: "هل تريد الحذف؟", unknownContact: "جهة اتصال غير معروفة" },
  settings: { language: "اللغة", languageAuto: "تلقائي (النظام)", account: "الحساب", about: "حول التطبيق", logout: "تسجيل الخروج", deleteAccount: "حذف الحساب", deleteConfirm: "هل أنت متأكد من أنك تريد حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء.", version: "إصدار التطبيق", designedBy: "Designed by Cristian", reportProblem: "الإبلاغ عن مشكلة" },
  modal: { unsavedTitle: "تغييرات غير محفوظة", unsavedBody: "لديك تفاصيل غير محفوظة. إذا تركت الآن، ستفقد هذه التغييرات.", keepEditing: "ابقَ واحفظ", discard: "تجاهل والمغادرة" }
};

// --- EXPORT TRANSLATIONS ---
export const translations = {
  cs, en, sk, de, pl, ro, hu, es, fr, it, pt, ru, uk, tr, vi, zh, ja, ko, ar,
  auto: en
};

// --- HOOK ---
export const useLanguage = () => {
  const [langCode, setLangCode] = useState<LanguageCode>('auto');
  const [t, setT] = useState<typeof cs>(cs);

  useEffect(() => {
    // 1. Get from LocalStorage
    const saved = localStorage.getItem('app_language') as LanguageCode;
    const currentCode = saved || 'auto';
    setLangCode(currentCode);
    updateTranslations(currentCode);

    // Listen for storage changes (in case Settings changes it)
    const handleStorageChange = () => {
      const newSaved = localStorage.getItem('app_language') as LanguageCode;
      setLangCode(newSaved || 'auto');
      updateTranslations(newSaved || 'auto');
    };

    window.addEventListener('storage', handleStorageChange);
    // Custom event for immediate updates within same window
    window.addEventListener('languageChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('languageChanged', handleStorageChange);
    };
  }, []);

  const updateTranslations = (code: LanguageCode) => {
    let finalCode = code;

    if (code === 'auto') {
      const browserLang = navigator.language.split('-')[0];
      // Check if we support browser lang, otherwise EN
      if (Object.keys(translations).includes(browserLang)) {
         finalCode = browserLang as LanguageCode;
      } else {
         finalCode = 'en';
      }
    }

    // Default to EN if key missing or mapped to EN in object
    const selected = translations[finalCode] || translations.en;
    // Basic merge to ensure new keys exist if selected lang is incomplete
    const merged = {
      ...en,
      ...selected,
      common: { ...en.common, ...selected.common },
      tabs: { ...en.tabs, ...selected.tabs },
      header: { ...en.header, ...selected.header },
      auth: { ...en.auth, ...selected.auth },
      generate: { ...en.generate, ...selected.generate, types: { ...en.generate.types, ...selected.generate.types }, labels: { ...en.generate.labels, ...selected.generate.labels }, placeholders: { ...en.generate.placeholders, ...selected.generate.placeholders }, buttons: { ...en.generate.buttons, ...selected.generate.buttons }, ai: { ...en.generate.ai, ...selected.generate.ai } },
      scan: { ...en.scan, ...selected.scan },
      library: { ...en.library, ...selected.library },
      settings: { ...en.settings, ...selected.settings },
      modal: { ...en.modal, ...selected.modal }
    };
    setT(merged as typeof cs);
  };

  const setLanguage = (code: LanguageCode) => {
    localStorage.setItem('app_language', code);
    setLangCode(code);
    updateTranslations(code);
    window.dispatchEvent(new Event('languageChanged'));
  };

  return { t, langCode, setLanguage };
};