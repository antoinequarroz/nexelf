import { useState } from "react";
import { Link, router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { AuthButton } from "../../components/auth/auth-button";
import { AuthField } from "../../components/auth/auth-field";
import { AuthMessage } from "../../components/auth/auth-message";
import { AuthShell } from "../../components/auth/auth-shell";
import { authClient } from "../../lib/auth-client";

export default function Connexion() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    if (!email.trim() || !password) {
      setError(t("auth.erreurs.champsRequis"));
      return;
    }
    setLoading(true);
    try {
      const result = await authClient.signIn.email({ email: email.trim(), password });
      if (result.error) {
        setError(t("auth.erreurs.identifiants"));
        return;
      }
      router.replace("/");
    } catch {
      setError(t("auth.erreurs.reseau"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title={t("auth.connexionTitre")} description={t("auth.connexionDescription")}>
      {error ? <AuthMessage kind="error" message={error} /> : null}
      <AuthField
        autoCapitalize="none"
        autoComplete="email"
        inputMode="email"
        keyboardType="email-address"
        label={t("auth.email")}
        onChangeText={setEmail}
        returnKeyType="next"
        value={email}
      />
      <AuthField
        autoComplete="current-password"
        label={t("auth.motdepasse")}
        onChangeText={setPassword}
        onSubmitEditing={submit}
        returnKeyType="done"
        secureTextEntry
        value={password}
      />
      <Link href="/mot-de-passe-oublie" asChild>
        <Pressable accessibilityRole="link" className="mb-6 min-h-12 justify-center self-start">
          <Text className="font-medium text-sm text-lime">{t("auth.motDePasseOublie")}</Text>
        </Pressable>
      </Link>
      <AuthButton label={t("auth.seConnecter")} loadingLabel={t("auth.connexionEnCours")} loading={loading} onPress={submit} />
      <View className="mt-7 flex-row flex-wrap items-center justify-center">
        <Text className="font-body text-sm text-muted">{t("auth.pasDeCompte")} </Text>
        <Link href="/inscription" asChild>
          <Pressable accessibilityRole="link" className="min-h-12 justify-center">
            <Text className="font-semibold text-sm text-lime">{t("auth.creerCompte")}</Text>
          </Pressable>
        </Link>
      </View>
    </AuthShell>
  );
}
