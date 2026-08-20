import { useEffect, useState } from "react";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { useTranslation } from "react-i18next";
import { api } from "../../convex/_generated/api";
import { dateLocaleConvex } from "../lib/rituel";
import { Button, Card, Choice, Feedback, Field, Header, Screen } from "../components/ui";

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
    return <Screen centered scroll={false}><Feedback fill loading title={t("revue.chargement")} message={t("revue.chargementCorps")} /></Screen>;
  if (jour === null)
    return <Screen centered scroll={false}><Header title={t("revue.sansJournee")} description={t("revue.sansJourneeCorps")} /><Button label={t("revue.retour")} onPress={() => router.replace("/")} /></Screen>;

  return (
    <Screen keyboard>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("revue.retourAccessible")}
        onPress={() => router.back()}
        className="mb-8 min-h-touch justify-center self-start"
      >
        <Text className="font-medium text-muted">{t("revue.retour")}</Text>
      </Pressable>
      <Header title={t("revue.titre")} description={t("revue.description")} />
      {terminee ? (
        <View className="mb-6"><Feedback tone="success" message={t("revue.terminee")} /></View>
      ) : null}
      {erreur ? (
        <View className="mb-6"><Feedback tone="danger" message={erreur} /></View>
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
          <View key={valeur} className="min-w-12"><Choice accessibilityLabel={t("revue.energieValeur", { value: valeur })} role="radio" label={`${valeur}`} selected={energie === valeur} onPress={() => setEnergie(valeur)} /></View>
        ))}
      </View>
      <Field
        label={t("revue.blocage")}
        value={blocage}
        onChangeText={setBlocage}
        placeholder={t("revue.ignorerPlaceholder")}
      />
      <Field
        label={t("revue.note")}
        value={note}
        onChangeText={setNote}
        multiline
        textAlignVertical="top"
        placeholder={t("revue.ignorerPlaceholder")}
        style={{ minHeight: 112 }}
      />
      <View className="mb-7"><Card tone="reflection">
        <Text className="font-semibold text-xs uppercase tracking-widest text-action">
          {t("revue.memoireLabel")}
        </Text>
        <Text className="mt-3 font-medium text-base leading-6 text-ink">
          {memoire.trim() || t("revue.memoireVide")}
        </Text>
        <Text className="mt-2 font-body text-sm leading-5 text-muted">
          {t("revue.memoireExplication")}
        </Text>
        <Field
          label={t("revue.memoireChamp")}
          value={memoire}
          onChangeText={setMemoire}
          multiline
          textAlignVertical="top"
          placeholder={t("revue.memoirePlaceholder")}
          style={{ minHeight: 96 }}
        />
      </Card></View>
      <Button label={t("revue.terminer")} loadingLabel={t("revue.sauvegarde")} loading={busy} onPress={() => enregistrer(true)} />
      <View className="mt-3"><Button variant="ghost" disabled={busy} label={t("revue.garderBrouillon")} onPress={() => enregistrer(false)} /></View>
    </Screen>
  );
}
