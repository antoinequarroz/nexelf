import { useState } from "react";
import { Text, View } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { useTranslation } from "react-i18next";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { authClient } from "../../lib/auth-client";
import { ProductShell } from "../../components/product-shell";
import { Badge, Button, Card, Choice, ChoiceGroup, Feedback, Field, Section } from "../../components/ui";
import { ManifestImage } from "../../components/media/manifest-image";

type Horizon = "court" | "moyen" | "long";
type Priorite = "basse" | "normale" | "haute";
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
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Id<"objectifs"> | null>(null);
  const [expandedActions, setExpandedActions] = useState<Id<"objectifs"> | null>(null);
  const [deleted, setDeleted] = useState<Id<"objectifs"> | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Id<"objectifs"> | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [actionBusy, setActionBusy] = useState("");
  const [actionError, setActionError] = useState(false);
  const [retryAction, setRetryAction] = useState<(() => void) | null>(null);

  async function performAction(key: string, operation: () => Promise<unknown>) {
    setActionBusy(key);
    setActionError(false);
    try {
      await operation();
      setRetryAction(null);
    } catch {
      setActionError(true);
      setRetryAction(() => () => void performAction(key, operation));
    } finally {
      setActionBusy("");
    }
  }

  async function submit() {
    if (!draft.titre.trim()) return setError(t("goals.errors.title"));
    setBusy(true);
    setError("");
    try {
      const payload = { titre: draft.titre, motivation: draft.motivation, horizon: draft.horizon, priorite: draft.priorite, echeance: draft.echeance || undefined };
      if (editing) await edit({ objectifId: editing, ...payload });
      else await create(payload);
      setDraft(initial);
      setEditing(null);
      setFormOpen(false);
    } catch {
      setError(t("goals.errors.save"));
    } finally {
      setBusy(false);
    }
  }

  if (isPending) return <ProductShell title={t("goals.title")} subtitle={t("goals.subtitle")}><Feedback loading message={t("etats.chargement")} /></ProductShell>;
  if (!session) return <ProductShell title={t("goals.title")} subtitle={t("goals.subtitle")}><Feedback message={t("goals.forbidden")} tone="danger" /></ProductShell>;

  return (
    <ProductShell title={t("goals.title")} subtitle={t("goals.subtitle")}>
      <View className="mb-8"><ManifestImage aboveFold assetId="gesture-objectifs-trajectoire-01" /></View>
      {actionError ? <View className="mb-5"><Feedback actionLabel={t("etats.erreur.reessayer")} message={t("etats.erreur.corps")} onAction={retryAction ?? undefined} tone="danger" /></View> : null}
      {!formOpen ? <Section><Button label={t("goals.form.create")} onPress={() => { setEditing(null); setDraft(initial); setError(""); setFormOpen(true); }} /></Section> : null}
      {formOpen ? <Section>
        <Card tone="reflection">
          <Text className="mb-4 font-semibold text-lg text-ink">{t(editing ? "goals.form.edit" : "goals.form.create")}</Text>
          {error ? <View className="mb-4"><Feedback message={error} tone="danger" /></View> : null}
          <Field label={t("goals.form.title")} placeholder={t("goals.form.title")} value={draft.titre} onChangeText={(titre) => setDraft((value) => ({ ...value, titre }))} />
          <Field label={t("goals.form.motivation")} multiline placeholder={t("goals.form.motivation")} value={draft.motivation} onChangeText={(motivation) => setDraft((value) => ({ ...value, motivation }))} />
          <View accessibilityRole="radiogroup" className="mb-4"><ChoiceGroup>{(["court", "moyen", "long"] as Horizon[]).map((horizon) => <Choice key={horizon} label={t(`goals.horizon.${horizon}`)} role="radio" selected={draft.horizon === horizon} onPress={() => setDraft((value) => ({ ...value, horizon }))} />)}</ChoiceGroup></View>
          <View accessibilityRole="radiogroup" className="mb-4"><ChoiceGroup>{(["basse", "normale", "haute"] as Priorite[]).map((priorite) => <Choice key={priorite} label={t(`goals.priority.${priorite}`)} role="radio" selected={draft.priorite === priorite} onPress={() => setDraft((value) => ({ ...value, priorite }))} />)}</ChoiceGroup></View>
          <Field label={t("goals.form.deadline")} placeholder={t("goals.form.deadlinePlaceholder")} value={draft.echeance} onChangeText={(echeance) => setDraft((value) => ({ ...value, echeance }))} />
          <View className="gap-2">
            <Button label={t("goals.save")} loading={busy} loadingLabel={t("goals.saving")} onPress={submit} />
            <Button disabled={busy} label={t("goals.cancel")} variant="ghost" onPress={() => { setDraft(initial); setEditing(null); setError(""); setFormOpen(false); }} />
          </View>
          <Text className="mt-3 font-body text-xs leading-5 text-subtle">{t("goals.manual")}</Text>
        </Card>
      </Section> : null}
      {!formOpen && (goals === undefined ? <Feedback loading message={t("etats.chargement")} /> : goals.length === 0 ? <Feedback message={t("goals.empty.body")} title={t("goals.empty.title")} /> : goals.map((goal) => (
        <View key={goal._id} className="mb-5"><Card>
          <View className="flex-row items-start justify-between gap-3"><Text className="min-w-0 flex-1 font-semibold text-lg text-ink">{goal.titre}</Text><Badge label={t(`goals.horizon.${goal.horizon}`)} tone="action" /></View>
          <Text className="mt-3 font-body text-sm leading-5 text-muted">{goal.motivation || t("goals.noMotivation")}</Text>
          <Text className="mt-2 font-body text-xs text-subtle">{t(`goals.status.${goal.statut}`)} · {t(`goals.priority.${goal.priorite}`)}</Text>
          <View className="mt-5 gap-2">
            <Button
              disabled={Boolean(actionBusy)}
              label={t(expandedActions === goal._id ? "goals.actions.hide" : "goals.actions.show")}
              variant="secondary"
              onPress={() => setExpandedActions((current) => current === goal._id ? null : goal._id)}
            />
            {expandedActions === goal._id ? <View className="gap-2" accessibilityLabel={t("goals.actions.group")}>
              <Button disabled={Boolean(actionBusy)} label={t("goals.actions.edit")} variant="ghost" onPress={() => { setEditing(goal._id); setDraft({ titre: goal.titre, motivation: goal.motivation, horizon: goal.horizon, priorite: goal.priorite, echeance: goal.echeance ?? "" }); setError(""); setFormOpen(true); setExpandedActions(null); }} />
              <Button disabled={Boolean(actionBusy)} label={t(goal.statut === "pause" ? "goals.actions.resume" : "goals.actions.pause")} loading={actionBusy === `status-${goal._id}`} loadingLabel={t("goals.saving")} variant="ghost" onPress={() => void performAction(`status-${goal._id}`, () => changeStatus({ objectifId: goal._id, statut: goal.statut === "pause" ? "actif" : "pause" }))} />
              <Button disabled={Boolean(actionBusy)} label={t("goals.actions.archive")} loading={actionBusy === `archive-${goal._id}`} loadingLabel={t("goals.saving")} variant="ghost" onPress={() => void performAction(`archive-${goal._id}`, () => changeStatus({ objectifId: goal._id, statut: "archive" }))} />
              <Button disabled={Boolean(actionBusy)} label={t("goals.actions.delete")} variant="ghost" onPress={() => setPendingDelete(goal._id)} />
            </View> : null}
          </View>
          {pendingDelete === goal._id ? <View className="mt-4"><Feedback message={t("goals.deleteConfirm")} tone="danger" /><View className="mt-3 gap-2"><Button disabled={Boolean(actionBusy)} label={t("goals.cancel")} variant="secondary" onPress={() => setPendingDelete(null)} /><Button disabled={Boolean(actionBusy)} label={t("goals.confirm")} loading={actionBusy === `delete-${goal._id}`} loadingLabel={t("goals.saving")} variant="destructive" onPress={() => void performAction(`delete-${goal._id}`, async () => { await remove({ objectifId: goal._id }); setDeleted(goal._id); setPendingDelete(null); })} /></View></View> : null}
        </Card></View>
      )))}
      {!formOpen && deleted ? actionBusy === `restore-${deleted}`
        ? <Feedback loading message={t("goals.saving")} />
        : <Feedback actionLabel={t("goals.undo")} message={t("goals.undoAvailable")} onAction={() => void performAction(`restore-${deleted}`, async () => { await restore({ objectifId: deleted }); setDeleted(null); })} />
        : null}
    </ProductShell>
  );
}
