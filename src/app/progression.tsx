import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { useTranslation } from "react-i18next";
import { api } from "../../convex/_generated/api";
import { QuietScreen } from "../components/quiet-screen";
import { Badge, Button, Card, Feedback, Progress, Section } from "../components/ui";

function iso(date: Date) { return date.toISOString().slice(0, 10); }
function bornesSemaine() {
  const now = new Date(); now.setHours(12, 0, 0, 0);
  const start = new Date(now); start.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const end = new Date(start); end.setDate(start.getDate() + 6);
  const previousStart = new Date(start); previousStart.setDate(start.getDate() - 7);
  const previousEnd = new Date(start); previousEnd.setDate(start.getDate() - 1);
  return { debut: iso(start), fin: iso(end), debutPrecedent: iso(previousStart), finPrecedent: iso(previousEnd) };
}

export default function Progression() {
  const { t, i18n } = useTranslation();
  const periode = useMemo(() => bornesSemaine(), []);
  const bilan = useQuery(api.progression.bilanHebdomadaire, periode);
  const evaluer = useMutation(api.progression.evaluerInsight);
  const [erreur, setErreur] = useState(false);
  const [envoi, setEnvoi] = useState("");

  async function retour(id: string, valeur: "faux" | "inutile") {
    setEnvoi(id); setErreur(false);
    try { await evaluer({ insightId: id, semaine: periode.debut, retour: valeur }); }
    catch { setErreur(true); }
    finally { setEnvoi(""); }
  }
  if (bilan === undefined) return <QuietScreen title={t("progression.title")} description={t("progression.description")}><Feedback fill loading message={t("progression.loading")} /></QuietScreen>;
  const format = (date: string) => new Intl.DateTimeFormat(i18n.language, { day: "numeric", month: "short" }).format(new Date(`${date}T12:00:00`));
  const labels: Record<string, string> = { terminees: t("progression.completed"), reportees: t("progression.postponed"), abandonnees: t("progression.abandoned"), objectifsTermines: t("progression.goals"), total: t("progression.total") };
  return <QuietScreen title={t("progression.title")} description={t("progression.description")}>
    <Text className="mb-6 font-medium text-sm text-muted">{t("progression.week", { start: format(bilan.periode.debut), end: format(bilan.periode.fin) })}</Text>
    <Section title={t("progression.rawTitle")}>
      <Card tone="growth">
        <View accessible accessibilityLabel={t("progression.chartSummary", { completed: bilan.actuel.terminees, postponed: bilan.actuel.reportees, abandoned: bilan.actuel.abandonnees })}>
          <Progress value={bilan.actuel.terminees} max={Math.max(1, bilan.actuel.total)} label={t("progression.chartSummary", { completed: bilan.actuel.terminees, postponed: bilan.actuel.reportees, abandoned: bilan.actuel.abandonnees })} />
          <View className="mt-5 flex-row justify-between"><Text className="text-ink">{t("progression.completed")}: {bilan.actuel.terminees}</Text><Text className="text-muted">{t("progression.postponed")}: {bilan.actuel.reportees}</Text></View>
          <Text className="mt-3 text-muted">{t("progression.abandoned")}: {bilan.actuel.abandonnees}</Text>
          <Text className="mt-3 text-muted">{t("progression.goals")}: {bilan.actuel.objectifsTermines} · {t("progression.steps", { count: bilan.actuel.etapesObjectifs })}</Text>
        </View>
      </Card>
      {(["terminees", "reportees", "abandonnees", "objectifsTermines"] as const).map(key => {
        const delta = bilan.actuel[key] - bilan.precedent[key];
        return <Text key={key} className="mt-3 font-body text-sm leading-6 text-muted">{t("progression.comparison", { label: labels[key], current: bilan.actuel[key], previous: bilan.precedent[key], delta: delta > 0 ? `+${delta}` : delta })}</Text>;
      })}
    </Section>
    {erreur ? <View className="mb-6"><Feedback tone="danger" message={t("progression.feedbackError")} /></View> : null}
    {bilan.actuel.joursDocumentes < bilan.minimumJours ? <Feedback title={t("progression.emptyTitle")} message={t("progression.empty", { count: bilan.minimumJours })} /> :
      <Section title={t("progression.insightsTitle")}>
        {bilan.hypotheses.length === 0 ? <Feedback message={t("progression.empty", { count: bilan.minimumJours })} /> : bilan.hypotheses.map((insight) => <View className="mb-4" key={insight.id}><Card tone="reflection">
          <Badge label={t("progression.hypothesis")} tone="action" />
          <Text className="mt-4 font-display text-lg leading-7 text-ink">{t(`progression.insights.${insight.type}`)}</Text>
          <Text className="mt-3 text-xs leading-5 text-muted">{t("progression.sources", { sources: insight.sources.map(source => t("progression.sourceItem", { label: labels[source.cle] || source.cle, value: source.valeur })).join(" · ") })}</Text>
          <View className="mt-4 flex-row gap-3"><View className="flex-1"><Button disabled={Boolean(envoi)} loading={envoi === insight.id} label={t("progression.false")} variant="secondary" onPress={() => void retour(insight.id, "faux")} /></View><View className="flex-1"><Button disabled={Boolean(envoi)} label={t("progression.useless")} variant="ghost" onPress={() => void retour(insight.id, "inutile")} /></View></View>
        </Card></View>)}
      </Section>}
  </QuietScreen>;
}
