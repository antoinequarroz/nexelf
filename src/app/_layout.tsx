import "../../global.css";
import "../i18n";

import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ConvexReactClient } from "convex/react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import * as Sentry from "@sentry/react-native";
import { authClient } from "../lib/auth-client";
import { theme } from "../lib/theme";
import { useFonts as useSora, Sora_600SemiBold } from "@expo-google-fonts/sora";
import {
  useFonts as useManrope,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
} from "@expo-google-fonts/manrope";

// Monitoring : configuré dès le départ, testé avec une erreur volontaire.
// Choisir la région EU côté Sentry si contrainte nLPD — irréversible.
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: __DEV__ ? "development" : "production",
  tracesSampleRate: 0.1,
  // Pas de données personnelles dans les contextes.
  sendDefaultPii: false,
});

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  // Sur mobile, on met les requêtes en pause tant que l'utilisateur n'est
  // pas authentifié, plutôt que d'afficher des états vides trompeurs.
  unsavedChangesWarning: false,
});

function RootLayout() {
  const [soraLoaded] = useSora({ Sora_600SemiBold });
  const [manropeLoaded] = useManrope({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
  });

  useEffect(() => {
    if (!process.env.EXPO_PUBLIC_CONVEX_URL) {
      console.warn("EXPO_PUBLIC_CONVEX_URL absente — lance `npx convex dev`");
    }
  }, []);

  if (!soraLoaded || !manropeLoaded) return null;

  return (
    // Même cause que dans auth-client.ts : incompatibilité de typage en amont
    // entre le plugin Expo et better-auth. Sans effet à l'exécution.
    <ConvexBetterAuthProvider client={convex} authClient={authClient as never}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
          contentStyle: { backgroundColor: theme.background },
        }}
      />
    </ConvexBetterAuthProvider>
  );
}

// Sentry.wrap capture les erreurs de rendu que le try/catch ne voit pas.
export default Sentry.wrap(RootLayout);
