import { useState } from "react";
import { Link, router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { AuthButton } from "../../components/auth/auth-button";
import { AuthField } from "../../components/auth/auth-field";
import { AuthMessage } from "../../components/auth/auth-message";
import { AuthShell } from "../../components/auth/auth-shell";
import { authClient } from "../../lib/auth-client";

export default function Inscription() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    if (!name.trim() || !email.trim() || !password) {
      setError(t("auth.erreurs.champsRequis"));
      return;
    }
    if (password.length < 8) {
      setError(t("auth.erreurs.motDePasseCourt"));
      return;
    }
    setLoading(true);
    try {
      const result = await authClient.signUp.email({ name: name.trim(), email: email.trim(), password });
      if (result.error) {
        setError(t("auth.erreurs.inscription"));
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
    <AuthShell title={t("auth.inscriptionTitre")} description={t("auth.inscriptionDescription")}>
      {error ? <AuthMessage kind="error" message={error} /> : null}
      <AuthField autoComplete="name" label={t("auth.nom")} onChangeText={setName} value={name} />
      <AuthField autoCapitalize="none" autoComplete="email" inputMode="email" keyboardType="email-address" label={t("auth.email")} onChangeText={setEmail} value={email} />
      <AuthField autoComplete="new-password" label={t("auth.motdepasse")} onChangeText={setPassword} onSubmitEditing={submit} secureTextEntry value={password} />
      <Text className="-mt-3 mb-6 font-body text-xs leading-5 text-subtle">{t("auth.motDePasseAide")}</Text>
      <AuthButton label={t("auth.creerMonCompte")} loadingLabel={t("auth.creationEnCours")} loading={loading} onPress={submit} />
      <View className="mt-7 flex-row flex-wrap items-center justify-center">
        <Text className="font-body text-sm text-muted">{t("auth.dejaUnCompte")} </Text>
        <Link href="/connexion" asChild>
          <Pressable accessibilityRole="link" className="min-h-12 justify-center">
            <Text className="font-semibold text-sm text-action">{t("auth.seConnecter")}</Text>
          </Pressable>
        </Link>
      </View>
    </AuthShell>
  );
}
