import { useEffect, useState } from "react";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { useTranslation } from "react-i18next";
import { api } from "../../convex/_generated/api";
import { dateLocaleConvex } from "../lib/rituel";
import { theme } from "../lib/theme";

export default function RevueSoir() {
  const { t } = useTranslation();
  const jour = useQuery(api.planning.obtenirJournee, {
    date: dateLocaleConvex(),
  });
  const revue = useQuery(
    api.revues.obtenir,
    jour?.journee._id ? { journeeId: jour.journee._id } : "skip",
  );
  const sauvegarder = useMutation(api.revues.sauvegarder);
  const proposerMemoire = useMutation(api.revues.proposerMemoire);
  const [energie, setEnergie] = useState<number | undefined>();
  const [blocage, setBlocage] = useState("");
  const [note, setNote] = useState("");
  const [memoire, setMemoire] = useState("");
  const [hydrate, setHydrate] = useState(false);
  const [busy, setBusy] = useState(false);
  const [erreur, setErreur] = useState("");
  const [terminee, setTerminee] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- hydrate une seule fois le brouillon Convex */
  useEffect(() => {
    if (revue === undefined || hydrate) return;
    setHydrate(true);
    if (revue) {
      setEnergie(revue.energie);
      setBlocage(revue.blocage ?? "");
      setNote(revue.note ?? "");
      setTerminee(Boolean(revue.termineeLe));
    }
  }, [hydrate, revue]);
  /* eslint-enable react-hooks/set-state-in-effect */

  async function enregistrer(terminer: boolean) {
    if (!jour) return;
    setBusy(true);
    setErreur("");
    try {
      await sauvegarder({
        journeeId: jour.journee._id,
        energie,
        blocage: blocage.trim() || undefined,
        note: note.trim() || undefined,
        terminer,
      });
      if (memoire.trim())
        await proposerMemoire({
          journeeId: jour.journee._id,
          categorie: "observationTemporaire",
          contenu: memoire.trim(),
        });
      setTerminee(terminer);
      if (terminer) setMemoire("");
    } catch {
      setErreur(t("revue.erreur"));
    } finally {
      setBusy(false);
    }
  }

  if (jour === undefined || (jour && revue === undefined))
    return (
      <View className="flex-1 items-center justify-center bg-canvas px-8">
        <Text className="font-display text-xl text-ink">
          {t("revue.chargement")}
        </Text>
        <Text className="mt-2 text-center text-muted">
          {t("revue.chargementCorps")}
        </Text>
      </View>
    );
  if (jour === null)
    return (
      <View className="flex-1 justify-center bg-canvas px-6">
        <Text
          accessibilityRole="header"
          className="font-display text-3xl text-ink"
        >
          {t("revue.sansJournee")}
        </Text>
        <Text className="mt-3 leading-6 text-muted">
          {t("revue.sansJourneeCorps")}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace("/")}
          className="mt-8 min-h-14 items-center justify-center rounded bg-lime"
        >
          <Text className="font-semibold text-lime-ink">
            {t("revue.retour")}
          </Text>
        </Pressable>
      </View>
    );

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      className="flex-1 bg-canvas"
      contentContainerClassName="px-6 pb-12 pt-8"
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("revue.retourAccessible")}
        onPress={() => router.back()}
        className="mb-8 min-h-11 justify-center self-start"
      >
        <Text className="font-medium text-muted">{t("revue.retour")}</Text>
      </Pressable>
      <Text
        accessibilityRole="header"
        className="font-display text-3xl leading-10 text-ink"
      >
        {t("revue.titre")}
      </Text>
      <Text className="mb-8 mt-3 font-body text-base leading-6 text-muted">
        {t("revue.description")}
      </Text>
      {terminee ? (
        <Text
          accessibilityLiveRegion="polite"
          className="mb-6 rounded border border-lime bg-surface p-4 text-lime"
        >
          {t("revue.terminee")}
        </Text>
      ) : null}
      {erreur ? (
        <Text
          accessibilityRole="alert"
          className="mb-6 rounded border border-danger bg-surface p-4 text-danger"
        >
          {erreur}
        </Text>
      ) : null}
      <Text className="font-semibold text-base text-ink">
        {t("revue.energie")}
      </Text>
      <Text className="mb-3 mt-1 text-sm text-subtle">
        {t("revue.facultatif")}
      </Text>
      <View
        accessibilityRole="radiogroup"
        className="mb-7 flex-row justify-between"
      >
        {[1, 2, 3, 4, 5].map((valeur) => (
          <Pressable
            key={valeur}
            accessibilityRole="radio"
            accessibilityLabel={t("revue.energieValeur", { value: valeur })}
            accessibilityState={{ checked: energie === valeur }}
            onPress={() => setEnergie(energie === valeur ? undefined : valeur)}
            className={`h-12 w-12 items-center justify-center rounded border ${energie === valeur ? "border-lime bg-lime" : "border-line bg-surface"}`}
          >
            <Text
              className={
                energie === valeur
                  ? "font-semibold text-lime-ink"
                  : "font-medium text-muted"
              }
            >
              {valeur}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text className="font-semibold text-base text-ink">
        {t("revue.blocage")}
      </Text>
      <TextInput
        accessibilityLabel={t("revue.blocage")}
        value={blocage}
        onChangeText={setBlocage}
        placeholder={t("revue.ignorerPlaceholder")}
        placeholderTextColor={theme.textSubtle}
        className="mb-7 mt-3 min-h-14 rounded border border-line bg-surface px-4 py-3 font-body text-base text-ink"
      />
      <Text className="font-semibold text-base text-ink">
        {t("revue.note")}
      </Text>
      <TextInput
        accessibilityLabel={t("revue.note")}
        value={note}
        onChangeText={setNote}
        multiline
        textAlignVertical="top"
        placeholder={t("revue.ignorerPlaceholder")}
        placeholderTextColor={theme.textSubtle}
        className="mb-7 mt-3 min-h-28 rounded border border-line bg-surface px-4 py-3 font-body text-base text-ink"
      />
      <View className="mb-7 rounded-lg border border-line bg-surface p-5">
        <Text className="font-semibold text-xs uppercase tracking-widest text-lime">
          {t("revue.memoireLabel")}
        </Text>
        <Text className="mt-3 font-medium text-base leading-6 text-ink">
          {memoire.trim() || t("revue.memoireVide")}
        </Text>
        <Text className="mt-2 font-body text-sm leading-5 text-muted">
          {t("revue.memoireExplication")}
        </Text>
        <TextInput
          accessibilityLabel={t("revue.memoireChamp")}
          value={memoire}
          onChangeText={setMemoire}
          multiline
          textAlignVertical="top"
          placeholder={t("revue.memoirePlaceholder")}
          placeholderTextColor={theme.textSubtle}
          className="mt-4 min-h-24 rounded border border-line bg-canvas px-4 py-3 font-body text-base text-ink"
        />
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ busy, disabled: busy }}
        disabled={busy}
        onPress={() => enregistrer(true)}
        className="min-h-14 items-center justify-center rounded bg-lime disabled:opacity-40"
      >
        <Text className="font-semibold text-base text-lime-ink">
          {busy ? t("revue.sauvegarde") : t("revue.terminer")}
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ busy, disabled: busy }}
        disabled={busy}
        onPress={() => enregistrer(false)}
        className="mt-3 min-h-12 items-center justify-center"
      >
        <Text className="font-medium text-sm text-muted">
          {t("revue.garderBrouillon")}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
