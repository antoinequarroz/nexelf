import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { useTranslation } from "react-i18next";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { authClient } from "../lib/auth-client";
import { ProductShell } from "../components/product-shell";
import { Button, Card, Choice, ChoiceGroup, Feedback, Field } from "../components/ui";
import { composerPlanDeterministe, type PrioritePlanning } from "../lib/planning/deterministe";

const today = () => new Date().toISOString().slice(0, 10);

export default function Planning() {
  const { t } = useTranslation();
  const { data: session, isPending } = authClient.useSession();
  const date = today();
  const data = useQuery(api.planning.obtenirJournee, session ? { date } : "skip");
  const createDay = useMutation(api.planning.creerJournee);
  const add = useMutation(api.planning.ajouterAction);
  const update = useMutation(api.planning.mettreAJourAction);
  const remove = useMutation(api.planning.supprimerAction);
  const [draft, setDraft] = useState({ titre: "", raison: "", duree: "30", creneau: "", priorite: "normale" as PrioritePlanning });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<ReturnType<typeof composerPlanDeterministe> | null>(null);
  const [undo, setUndo] = useState<{ id: Id<"actionsQuotidiennes">; ordre: number }[] | null>(null);

  async function addAction() {
    const duration = Number(draft.duree);
    if (!draft.titre.trim() || !Number.isFinite(duration) || duration < 1) return setError(t("planning.errors.invalid"));
    setBusy(true); setError("");
    try {
      const dayId = data?.journee._id ?? await createDay({ date });
      await add({ journeeId: dayId, titre: draft.titre, raison: draft.raison || t("planning.manualReason"), dureeMinutes: duration, creneau: draft.creneau || undefined, priorite: draft.priorite, ordre: data?.actions.length ?? 0 });
      setDraft({ titre: "", raison: "", duree: "30", creneau: "", priorite: "normale" });
    } catch { setError(t("planning.errors.save")); } finally { setBusy(false); }
  }

  function prepare() {
    if (!data) return;
    setPreview(composerPlanDeterministe(data.actions.map(a => ({ titre: a.titre, dureeMinutes: a.dureeMinutes, priorite: a.priorite, creneau: a.creneau, raison: a.raison }))));
  }

  async function applyPreview() {
    if (!data || !preview) return;
    setBusy(true); setError("");
    try {
      setUndo(data.actions.map(a => ({ id: a._id, ordre: a.ordre })));
      for (const item of preview) {
        const action = data.actions.find(a => a.titre === item.titre && a.dureeMinutes === item.dureeMinutes);
        if (action) await update({ actionId: action._id, ordre: item.ordre });
      }
      setPreview(null);
    } catch { setError(t("planning.errors.save")); } finally { setBusy(false); }
  }

  async function undoLast() {
    if (!undo) return;
    for (const item of undo) await update({ actionId: item.id, ordre: item.ordre });
    setUndo(null);
  }

  if (isPending) return <ProductShell title={t("planning.title")} subtitle={t("planning.subtitle")}><Text className="text-muted">{t("etats.chargement")}</Text></ProductShell>;
  if (!session) return <ProductShell title={t("planning.title")} subtitle={t("planning.subtitle")}><Text accessibilityRole="alert" className="text-danger">{t("planning.forbidden")}</Text></ProductShell>;
  const actions = data?.actions ?? [];
  return <ProductShell title={t("planning.title")} subtitle={t("planning.subtitle")}>
    <View className="mb-6"><Feedback message={t("planning.deterministic")} /></View>
    {error ? <View className="mb-4"><Feedback tone="danger" message={error} /></View> : null}
    {data === undefined ? <Text className="mb-5 text-muted">{t("etats.chargement")}</Text> : actions.length === 0 ? <View className="mb-5 rounded border border-line p-5"><Text className="text-lg text-ink">{t("planning.empty.title")}</Text><Text className="mt-2 text-muted">{t("planning.empty.body")}</Text></View> : actions.map(action => <View key={action._id} className="mb-4 rounded-lg border border-line bg-surface p-5">
      <View className="flex-row justify-between"><Text className={`mr-3 flex-1 font-semibold text-lg ${action.statut === "terminee" ? "text-subtle line-through" : "text-ink"}`}>{action.titre}</Text><Text className="text-action">{action.dureeMinutes} min</Text></View>
      <Text className="mt-2 text-sm text-muted">{action.creneau || t("planning.flexible")} · {t(`goals.priority.${action.priorite}`)}</Text><Text className="mt-2 text-sm leading-5 text-subtle">{action.raison || t("planning.manualReason")}</Text>
      <View className="mt-3 flex-row flex-wrap"><Pressable accessibilityRole="checkbox" accessibilityState={{ checked: action.statut === "terminee" }} className="mr-5 min-h-touch justify-center" onPress={() => update({ actionId: action._id, statut: action.statut === "terminee" ? "aFaire" : "terminee" })}><Text className="text-action">{t(action.statut === "terminee" ? "planning.actions.reopen" : "planning.actions.complete")}</Text></Pressable><Pressable accessibilityRole="button" className="mr-5 min-h-touch justify-center" onPress={() => update({ actionId: action._id, statut: "reportee", reporteeAu: new Date(Date.now() + 86400000).toISOString().slice(0,10) })}><Text className="text-muted">{t("planning.actions.postpone")}</Text></Pressable><Pressable accessibilityRole="button" className="min-h-touch justify-center" onPress={() => remove({ actionId: action._id })}><Text className="text-danger">{t("planning.actions.delete")}</Text></Pressable></View>
    </View>)}
    {actions.length > 1 ? <Pressable accessibilityRole="button" className="mb-4 min-h-14 items-center justify-center rounded border border-action" onPress={prepare}><Text className="font-semibold text-action">{t("planning.reorganize")}</Text></Pressable> : null}
    {undo ? <Pressable accessibilityRole="button" className="mb-6 min-h-12 items-center justify-center" onPress={undoLast}><Text className="text-action">{t("planning.undo")}</Text></Pressable> : null}
    {preview ? <View className="mb-6 rounded-lg border border-action bg-surface p-5"><Text accessibilityRole="header" className="font-semibold text-lg text-ink">{t("planning.preview")}</Text>{preview.map((a, i) => <Text key={`${a.titre}-${i}`} className="mt-3 text-muted">{i + 1}. {a.titre} · {a.dureeMinutes} min</Text>)}<View className="mt-4 flex-row"><Pressable accessibilityRole="button" className="mr-4 min-h-12 flex-1 items-center justify-center rounded border border-line" onPress={() => setPreview(null)}><Text className="text-muted">{t("planning.cancel")}</Text></Pressable><Pressable accessibilityRole="button" disabled={busy} className="min-h-12 flex-1 items-center justify-center rounded bg-action" onPress={applyPreview}><Text className="text-action-ink">{t("planning.confirm")}</Text></Pressable></View></View> : null}
    <Card><Text className="mb-4 font-semibold text-lg text-ink">{t("planning.compose")}</Text><Field label={t("planning.form.title")} value={draft.titre} onChangeText={titre => setDraft(x => ({...x,titre}))}/><Field label={t("planning.form.reason")} value={draft.raison} onChangeText={raison => setDraft(x => ({...x,raison}))}/><Field label={t("planning.form.duration")} keyboardType="number-pad" value={draft.duree} onChangeText={duree => setDraft(x => ({...x,duree}))}/><Field label={t("planning.form.slot")} placeholder={t("planning.form.slot")} value={draft.creneau} onChangeText={creneau => setDraft(x => ({...x,creneau}))}/><View className="mb-5"><ChoiceGroup>{(["basse","normale","haute"] as PrioritePlanning[]).map(p => <Choice key={p} role="radio" label={t(`goals.priority.${p}`)} selected={draft.priorite===p} onPress={() => setDraft(x => ({...x,priorite:p}))}/>)}</ChoiceGroup></View><Button loading={busy} loadingLabel={t("planning.saving")} label={t("planning.add")} onPress={addAction}/></Card>
  </ProductShell>;
}
