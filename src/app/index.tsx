import { useState } from "react";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { useTranslation } from "react-i18next";
import { api } from "../../convex/_generated/api";
import { dateLocale, dateLocaleConvex, detailAction } from "../lib/rituel";

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
    return (
      <View
        accessibilityLiveRegion="polite"
        className="flex-1 items-center justify-center bg-canvas px-8"
      >
        <Text className="font-display text-xl text-ink">
          {t("rituel.chargementTitre")}
        </Text>
        <Text className="mt-2 text-center font-body text-muted">
          {t("rituel.chargementCorps")}
        </Text>
      </View>
    );

  if (briefing === null)
    return (
      <View className="flex-1 justify-center bg-canvas px-6">
        <Text
          accessibilityRole="header"
          className="font-display text-3xl text-ink"
        >
          {t("rituel.videTitre")}
        </Text>
        <Text className="mt-3 font-body text-base leading-6 text-muted">
          {t("rituel.videCorps")}
        </Text>
        {erreur ? (
          <Text
            accessibilityRole="alert"
            className="mt-5 rounded border border-danger p-4 text-danger"
          >
            {erreur}
          </Text>
        ) : null}
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ busy: creation, disabled: creation }}
          disabled={creation}
          onPress={creer}
          className="mt-8 min-h-14 items-center justify-center rounded bg-lime px-6 disabled:opacity-40"
        >
          <Text className="font-semibold text-base text-lime-ink">
            {creation ? t("rituel.creation") : t("rituel.creerJournee")}
          </Text>
        </Pressable>
      </View>
    );

  const actionsActives = briefing.actions.filter(
    (action) => action.statut === "aFaire",
  );
  const habitudesDuJour = habitudes.filter(
    (habitude) =>
      habitude.statut === "active" &&
      habitude.jours.includes(new Date().getDay()),
  );
  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentContainerClassName="px-6 pb-12 pt-8"
    >
      <View className="mb-9 flex-row items-start justify-between">
        <View className="flex-1 pr-5">
          <Text className="font-medium text-xs uppercase tracking-widest text-subtle">
            {dateLocale(i18n.language)}
          </Text>
          <Text
            accessibilityRole="header"
            className="mt-2 font-display text-4xl tracking-calm text-ink"
          >
            {t("rituel.bonjour")}
          </Text>
        </View>
        <View
          accessibilityLabel={t("app.nom")}
          className="h-10 w-10 items-center justify-center rounded-full border border-line bg-surface"
        >
          <Text className="font-semibold text-sm text-lime">NX</Text>
        </View>
      </View>
      <View className="mb-8 rounded-lg border border-line bg-surface p-5">
        <Text className="font-semibold text-xs uppercase tracking-widest text-muted">
          {t("rituel.cap")}
        </Text>
        <Text className="mt-4 font-display text-2xl leading-8 text-ink">
          {briefing.journee.cap || t("rituel.capLibre")}
        </Text>
        <Text className="mt-3 font-body text-sm leading-6 text-muted">
          {t("rituel.controle")}
        </Text>
      </View>
      <Text className="mb-5 font-semibold text-xs uppercase tracking-widest text-subtle">
        {t("rituel.priorites", { count: actionsActives.length })}
      </Text>
      {actionsActives.length === 0 ? (
        <View className="mb-8 rounded border border-line bg-surface p-5">
          <Text className="font-medium text-ink">
            {t("rituel.aucunePriorite")}
          </Text>
          <Text className="mt-2 font-body text-sm leading-5 text-muted">
            {t("rituel.aucunePrioriteCorps")}
          </Text>
        </View>
      ) : (
        <View className="mb-5">
          {actionsActives.map((action, index) => (
            <View
              key={action._id}
              className="mb-3 flex-row rounded border border-line bg-surface p-4"
            >
              <View className="mr-4 h-7 w-7 items-center justify-center rounded-full border border-lime">
                <Text className="font-semibold text-xs text-lime">
                  {index + 1}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="font-medium text-base text-ink">
                  {action.titre}
                </Text>
                <Text className="mt-1 font-body text-sm text-muted">
                  {detailAction(action, t)}
                </Text>
                {action.raison ? (
                  <Text className="mt-2 font-body text-xs leading-5 text-subtle">
                    {action.raison}
                  </Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      )}
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
      {planAccepte ? (
        <View
          accessibilityLiveRegion="polite"
          className="mb-3 rounded border border-lime bg-surface p-4"
        >
          <Text className="font-medium text-lime">
            {t("rituel.planAccepte")}
          </Text>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          onPress={() => setPlanAccepte(true)}
          className="min-h-14 items-center justify-center rounded bg-lime px-6"
        >
          <Text className="font-semibold text-base text-lime-ink">
            {t("rituel.accepter")}
          </Text>
        </Pressable>
      )}
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push("/planning")}
        className="mt-3 min-h-14 items-center justify-center rounded border border-line px-6"
      >
        <Text className="font-semibold text-base text-ink">
          {t("rituel.adapter")}
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push("/revue-soir")}
        className="mt-3 min-h-12 items-center justify-center px-6"
      >
        <Text className="font-medium text-sm text-muted">
          {t("rituel.ouvrirRevue")}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
