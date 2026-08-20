import { useState } from "react";
import { Link } from "expo-router";
import { Pressable, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { AuthButton } from "../../components/auth/auth-button";
import { AuthField } from "../../components/auth/auth-field";
import { AuthMessage } from "../../components/auth/auth-message";
import { AuthShell } from "../../components/auth/auth-shell";
import { authClient } from "../../lib/auth-client";

export default function MotDePasseOublie() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function submit() {
    setError("");
    if (!email.trim()) {
      setError(t("auth.erreurs.champsRequis"));
      return;
    }
    setLoading(true);
    try {
      const result = await authClient.requestPasswordReset({
        email: email.trim(),
        redirectTo: "/connexion",
      });
      if (result.error) {
        setError(t("auth.erreurs.reinitialisation"));
        return;
      }
      setSent(true);
    } catch {
      setError(t("auth.erreurs.reseau"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title={t("auth.oubliTitre")} description={t("auth.oubliDescription")}>
      {sent ? <AuthMessage kind="success" message={t("auth.lienEnvoye")} /> : null}
      {error ? <AuthMessage kind="error" message={error} /> : null}
      {!sent ? (
        <>
          <AuthField autoCapitalize="none" autoComplete="email" inputMode="email" keyboardType="email-address" label={t("auth.email")} onChangeText={setEmail} onSubmitEditing={submit} value={email} />
          <AuthButton label={t("auth.envoyerLien")} loadingLabel={t("auth.envoiEnCours")} loading={loading} onPress={submit} />
        </>
      ) : null}
      <Link href="/connexion" asChild>
        <Pressable accessibilityRole="link" className="mt-6 min-h-12 items-center justify-center">
          <Text className="font-semibold text-sm text-action">{t("auth.retourConnexion")}</Text>
        </Pressable>
      </Link>
    </AuthShell>
  );
}
