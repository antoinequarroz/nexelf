import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { useTranslation } from "react-i18next";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { authClient } from "../lib/auth-client";
import { ProductShell } from "../components/product-shell";

type Horizon = "court" | "moyen" | "long";
type Priorite = "basse" | "normale" | "haute";
const input = "mb-3 min-h-14 rounded border border-line bg-surface px-4 py-3 font-body text-base text-ink";
const initial = { titre: "", motivation: "", horizon: "court" as Horizon, priorite: "normale" as Priorite, echeance: "" };

export default function Objectifs() {
  const { t } = useTranslation();
  const { data: session, isPending } = authClient.useSession();
  const goals = useQuery(api.objectifs.lister, session ? {} : "skip");
  const create = useMutation(api.objectifs.creer);
  const edit = useMutation(api.objectifs.modifier);
  const changeStatus = useMutation(api.objectifs.changerStatut);
  const remove = useMutation(api.objectifs.supprimer);
  const restore = useMutation(api.objectifs.restaurer);
  const [draft, setDraft] = useState(initial);
  const [editing, setEditing] = useState<Id<"objectifs"> | null>(null);
  const [deleted, setDeleted] = useState<Id<"objectifs"> | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Id<"objectifs"> | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!draft.titre.trim()) return setError(t("goals.errors.title"));
    setBusy(true); setError("");
    try {
      const payload = { titre: draft.titre, motivation: draft.motivation, horizon: draft.horizon, priorite: draft.priorite, echeance: draft.echeance || undefined };
      if (editing) await edit({ objectifId: editing, ...payload }); else await create(payload);
      setDraft(initial); setEditing(null);
    } catch { setError(t("goals.errors.save")); } finally { setBusy(false); }
  }

  if (isPending) return <ProductShell title={t("goals.title")} subtitle={t("goals.subtitle")}><Text className="text-muted">{t("etats.chargement")}</Text></ProductShell>;
  if (!session) return <ProductShell title={t("goals.title")} subtitle={t("goals.subtitle")}><Text accessibilityRole="alert" className="text-danger">{t("goals.forbidden")}</Text></ProductShell>;

  return <ProductShell title={t("goals.title")} subtitle={t("goals.subtitle")}>
    <View className="mb-8 rounded-lg border border-line bg-surface p-5">
      <Text className="mb-4 font-semibold text-lg text-ink">{t(editing ? "goals.form.edit" : "goals.form.create")}</Text>
      {error ? <Text accessibilityRole="alert" className="mb-3 text-danger">{error}</Text> : null}
      <TextInput accessibilityLabel={t("goals.form.title")} className={input} placeholder={t("goals.form.title")} placeholderTextColor="#707783" value={draft.titre} onChangeText={titre => setDraft(x => ({ ...x, titre }))} />
      <TextInput accessibilityLabel={t("goals.form.motivation")} className={`${input} min-h-24`} multiline placeholder={t("goals.form.motivation")} placeholderTextColor="#707783" value={draft.motivation} onChangeText={motivation => setDraft(x => ({ ...x, motivation }))} />
      <View className="mb-3 flex-row flex-wrap">{(["court", "moyen", "long"] as Horizon[]).map(h => <Pressable key={h} accessibilityRole="radio" accessibilityState={{ checked: draft.horizon === h }} className={`mb-2 mr-2 min-h-12 justify-center rounded border px-4 ${draft.horizon === h ? "border-lime" : "border-line"}`} onPress={() => setDraft(x => ({ ...x, horizon: h }))}><Text className={draft.horizon === h ? "text-lime" : "text-muted"}>{t(`goals.horizon.${h}`)}</Text></Pressable>)}</View>
      <View className="mb-3 flex-row flex-wrap">{(["basse", "normale", "haute"] as Priorite[]).map(p => <Pressable key={p} accessibilityRole="radio" accessibilityState={{ checked: draft.priorite === p }} className={`mb-2 mr-2 min-h-12 justify-center rounded border px-4 ${draft.priorite === p ? "border-lime" : "border-line"}`} onPress={() => setDraft(x => ({ ...x, priorite: p }))}><Text className={draft.priorite === p ? "text-lime" : "text-muted"}>{t(`goals.priority.${p}`)}</Text></Pressable>)}</View>
      <TextInput accessibilityLabel={t("goals.form.deadline")} className={input} placeholder={t("goals.form.deadlinePlaceholder")} placeholderTextColor="#707783" value={draft.echeance} onChangeText={echeance => setDraft(x => ({ ...x, echeance }))} />
      <Pressable accessibilityRole="button" disabled={busy} className="min-h-14 items-center justify-center rounded bg-lime" onPress={submit}><Text className="font-semibold text-lime-ink">{busy ? t("goals.saving") : t("goals.save")}</Text></Pressable>
      <Text className="mt-3 text-xs leading-5 text-subtle">{t("goals.manual")}</Text>
    </View>
    {goals === undefined ? <Text className="text-muted">{t("etats.chargement")}</Text> : goals.length === 0 ? <View className="rounded border border-line p-5"><Text className="text-lg text-ink">{t("goals.empty.title")}</Text><Text className="mt-2 text-muted">{t("goals.empty.body")}</Text></View> : goals.map(goal => <View key={goal._id} className="mb-4 rounded-lg border border-line bg-surface p-5">
      <View className="flex-row justify-between"><Text className="mr-3 flex-1 font-semibold text-lg text-ink">{goal.titre}</Text><Text className="text-xs uppercase text-lime">{t(`goals.horizon.${goal.horizon}`)}</Text></View>
      <Text className="mt-2 text-sm leading-5 text-muted">{goal.motivation || t("goals.noMotivation")}</Text><Text className="mt-2 text-xs text-subtle">{t(`goals.status.${goal.statut}`)} · {t(`goals.priority.${goal.priorite}`)}</Text>
      <View className="mt-4 flex-row flex-wrap">
        <Pressable accessibilityRole="button" className="mr-4 min-h-11 justify-center" onPress={() => { setEditing(goal._id); setDraft({ titre: goal.titre, motivation: goal.motivation, horizon: goal.horizon, priorite: goal.priorite, echeance: goal.echeance ?? "" }); }}><Text className="text-lime">{t("goals.actions.edit")}</Text></Pressable>
        <Pressable accessibilityRole="button" className="mr-4 min-h-11 justify-center" onPress={() => changeStatus({ objectifId: goal._id, statut: goal.statut === "pause" ? "actif" : "pause" })}><Text className="text-muted">{t(goal.statut === "pause" ? "goals.actions.resume" : "goals.actions.pause")}</Text></Pressable>
        <Pressable accessibilityRole="button" className="mr-4 min-h-11 justify-center" onPress={() => changeStatus({ objectifId: goal._id, statut: "archive" })}><Text className="text-muted">{t("goals.actions.archive")}</Text></Pressable>
        <Pressable accessibilityRole="button" className="min-h-11 justify-center" onPress={() => setPendingDelete(goal._id)}><Text className="text-danger">{t("goals.actions.delete")}</Text></Pressable>
      </View>
      {pendingDelete === goal._id ? <View accessibilityRole="alert" className="mt-3 rounded border border-danger p-3"><Text className="text-ink">{t("goals.deleteConfirm")}</Text><View className="mt-2 flex-row"><Pressable accessibilityRole="button" className="mr-5 min-h-11 justify-center" onPress={() => setPendingDelete(null)}><Text className="text-muted">{t("goals.cancel")}</Text></Pressable><Pressable accessibilityRole="button" className="min-h-11 justify-center" onPress={async () => { await remove({ objectifId: goal._id }); setDeleted(goal._id); setPendingDelete(null); }}><Text className="text-danger">{t("goals.confirm")}</Text></Pressable></View></View> : null}
    </View>)}
    {deleted ? <Pressable accessibilityRole="button" className="mt-2 min-h-14 items-center justify-center rounded border border-lime" onPress={async () => { await restore({ objectifId: deleted }); setDeleted(null); }}><Text className="text-lime">{t("goals.undo")}</Text></Pressable> : null}
  </ProductShell>;
}
