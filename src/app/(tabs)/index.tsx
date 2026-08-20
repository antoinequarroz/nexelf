import { useState } from "react";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { useTranslation } from "react-i18next";
import { api } from "../../../convex/_generated/api";
import { dateLocale, dateLocaleConvex, detailAction } from "../../lib/rituel";
import { Button, Card, Feedback, Header, Progress, Screen, Section } from "../../components/ui";
import { ManifestImage } from "../../components/media/manifest-image";

export default function Accueil() {
  const { t, i18n } = useTranslation();
  const date = dateLocaleConvex();
  const briefing = useQuery(api.planning.obtenirJournee, { date });
  const contexte = useQuery(api.onboarding.reprendre);
  const habitudes = useQuery(api.habitudes.lister);
  const creerJournee = useMutation(api.planning.creerJournee);
  const [creation, setCreation] = useState(false);
  const [planAccepte, setPlanAccepte] = useState(false);
  const [erreur, setErreur] = useState("");

  async function creer() {
    setCreation(true);
    setErreur("");
    try {
      await creerJournee({ date });
    } catch {
      setErreur(t("rituel.erreurCreation"));
    } finally {
      setCreation(false);
    }
  }

  if (
    briefing === undefined ||
    contexte === undefined ||
    habitudes === undefined
  )
    return <Screen centered scroll={false}><Feedback fill loading title={t("rituel.chargementTitre")} message={t("rituel.chargementCorps")} /></Screen>;

  if (briefing === null)
    return <Screen centered scroll={false}><Header title={t("rituel.videTitre")} description={t("rituel.videCorps")} />{erreur ? <View className="mb-6"><Feedback tone="danger" message={erreur} /></View> : null}<Button label={t("rituel.creerJournee")} loadingLabel={t("rituel.creation")} loading={creation} onPress={creer} /></Screen>;

  const actionsActives = briefing.actions.filter(
    (action) => action.statut === "aFaire",
  );
  const habitudesDuJour = habitudes.filter(
    (habitude) =>
      habitude.statut === "active" &&
      habitude.jours.includes(new Date().getDay()),
  );
  const essentiel = actionsActives[0];
  const terminees = briefing.actions.filter((action) => action.statut === "terminee").length;
  return (
    <Screen>
      <Header eyebrow={dateLocale(i18n.language)} title={t("rituel.bonjour")} />
      <View className="mb-8"><ManifestImage aboveFold assetId="illustration-placeholder-portrait-01" /></View>
      <Section title={t("rituel.cap")}>
      <Card tone="reflection">
        <Text className="font-semibold text-xs uppercase tracking-widest text-muted">
          {t("onboarding.cap")}
        </Text>
        <Text className="mt-4 font-display text-2xl leading-8 text-ink">
          {briefing.journee.cap || t("rituel.capLibre")}
        </Text>
        <Text className="mt-3 font-body text-sm leading-6 text-muted">
          {t("rituel.controle")}
        </Text>
      </Card>
      </Section>
      <Section title={t("rituel.priorites", { count: actionsActives.length })}>
        {essentiel ? <Card tone="impulse"><Text className="font-display text-xl leading-7 text-ink">{essentiel.titre}</Text><Text className="mt-2 font-body text-sm text-muted">{detailAction(essentiel, t)}</Text>{essentiel.raison ? <Text className="mt-2 font-body text-sm leading-5 text-subtle">{essentiel.raison}</Text> : null}</Card> : <Feedback title={t("rituel.aucunePriorite")} message={t("rituel.aucunePrioriteCorps")} />}
      </Section>
      <Section title={t("briefing.progress")}>
        <Progress value={terminees} max={Math.max(1, briefing.actions.length)} label={t("rituel.priorites", { count: terminees })} />
        {actionsActives.slice(1).map((action) => <View key={action._id} className="mt-4 border-t border-line pt-4"><Text className="font-medium text-ink">{action.titre}</Text><Text className="mt-1 text-sm text-muted">{detailAction(action, t)}</Text></View>)}
      </Section>
      {habitudesDuJour.length > 0 || (contexte?.contraintes.length ?? 0) > 0 ? (
        <View className="mb-8 flex-row gap-3">
          <View className="flex-1 rounded border border-line bg-surface p-4">
            <Text className="font-semibold text-xs uppercase tracking-widest text-subtle">
              {t("rituel.routines")}
            </Text>
            {habitudesDuJour.length ? (
              habitudesDuJour.map((habitude) => (
                <Text
                  key={habitude._id}
                  className="mt-3 font-medium text-sm text-ink"
                >
                  {habitude.nom}
                  {habitude.moment ? ` · ${habitude.moment}` : ""}
                </Text>
              ))
            ) : (
              <Text className="mt-3 text-sm text-muted">
                {t("rituel.rien")}
              </Text>
            )}
          </View>
          <View className="flex-1 rounded border border-line bg-surface p-4">
            <Text className="font-semibold text-xs uppercase tracking-widest text-subtle">
              {t("rituel.contraintes")}
            </Text>
            {contexte?.contraintes.length ? (
              contexte.contraintes.map((contrainte) => (
                <Text
                  key={contrainte}
                  className="mt-3 font-medium text-sm text-ink"
                >
                  {t(`onboarding.contraintes.${contrainte}`)}
                </Text>
              ))
            ) : (
              <Text className="mt-3 text-sm text-muted">
                {t("rituel.rien")}
              </Text>
            )}
          </View>
        </View>
      ) : null}
      {planAccepte ? <View className="mb-3"><Feedback tone="success" message={t("rituel.planAccepte")} /></View> : <Button label={t("rituel.accepter")} onPress={() => setPlanAccepte(true)} />}
      <View className="mt-3"><Button variant="secondary" label={t("rituel.adapter")} onPress={() => router.push("/planning")} /></View>
      <View className="mt-1"><Button variant="ghost" label={t("rituel.ouvrirRevue")} onPress={() => router.push("/revue-soir")} /></View>
    </Screen>
  );
}
