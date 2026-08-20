import { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { Pressable, Text, TextInput, View } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { useTranslation } from "react-i18next";
import { api } from "../../../convex/_generated/api";
import { ChoiceChip } from "../../components/onboarding/choice-chip";
import { OnboardingShell } from "../../components/onboarding/onboarding-shell";

type Tone = "doux" | "direct" | "equilibre";
type Draft = { domaines: string[]; futur: string; objectifs: string[]; contraintes: string[]; energie: number; ton: Tone; durees: number[] };
const initial: Draft = { domaines: [], futur: "", objectifs: [""], contraintes: [], energie: 3, ton: "equilibre", durees: [30] };
const fieldClass = "mb-4 min-h-14 rounded border border-line bg-surface px-4 py-3 font-body text-base text-ink";

export default function Onboarding() {
  const { t } = useTranslation();
  const saved = useQuery(api.onboarding.reprendre);
  const save = useMutation(api.onboarding.sauvegarder);
  const finish = useMutation(api.onboarding.terminer);
  const createGoal = useMutation(api.objectifs.creer);
  const createDay = useMutation(api.planning.creerJournee);
  const addAction = useMutation(api.planning.ajouterAction);
  const hydrated = useRef(false);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (saved === undefined || hydrated.current) return;
    hydrated.current = true;
    if (saved) {
      // Hydrate une seule fois le brouillon local depuis la sauvegarde distante.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStep(Math.min(saved.etape, 6));
      setDraft({ domaines: saved.domaines, futur: saved.futurSouhaite ?? "", objectifs: saved.objectifsPrioritaires.length ? saved.objectifsPrioritaires : [""], contraintes: saved.contraintes, energie: saved.niveauEnergie ?? 3, ton: saved.tonCopilote ?? "equilibre", durees: saved.objectifsPrioritaires.map(() => 30) });
    }
  }, [saved]);

  const cleanGoals = draft.objectifs.map(x => x.trim()).filter(Boolean).slice(0, 3);
  async function persist(next: number) {
    setBusy(true); setError("");
    try {
      await save({ etape: next, domaines: draft.domaines, futurSouhaite: draft.futur.trim() || undefined, objectifsPrioritaires: cleanGoals, contraintes: draft.contraintes, niveauEnergie: draft.energie, tonCopilote: draft.ton });
      setStep(next);
    } catch { setError(t("onboarding.erreur")); } finally { setBusy(false); }
  }
  async function complete() {
    setBusy(true); setError("");
    try {
      await save({ etape: 6, domaines: draft.domaines, futurSouhaite: draft.futur.trim(), objectifsPrioritaires: cleanGoals, contraintes: draft.contraintes, niveauEnergie: draft.energie, tonCopilote: draft.ton });
      const date = new Date().toISOString().slice(0, 10);
      const dayId = await createDay({ date, cap: draft.futur.trim().slice(0, 120) });
      for (let i = 0; i < cleanGoals.length; i++) {
        const goalId = await createGoal({ titre: cleanGoals[i], motivation: draft.futur.trim(), horizon: "moyen", priorite: i === 0 ? "haute" : "normale" });
        await addAction({ journeeId: dayId, objectifId: goalId, titre: cleanGoals[i], raison: t("onboarding.plan.raison"), dureeMinutes: draft.durees[i] ?? 30, priorite: i === 0 ? "haute" : "normale", ordre: i });
      }
      await finish(); router.replace("/");
    } catch { setError(t("onboarding.erreur")); } finally { setBusy(false); }
  }
  function toggle(key: "domaines" | "contraintes", value: string) { setDraft(d => ({ ...d, [key]: d[key].includes(value) ? d[key].filter(x => x !== value) : [...d[key], value] })); }
  function valid() { if (step === 0) return draft.domaines.length > 0; if (step === 1) return draft.futur.trim().length >= 10; if (step === 2) return cleanGoals.length > 0; return true; }

  if (saved === undefined) return <View className="flex-1 items-center justify-center bg-canvas"><Text className="text-muted">{t("etats.chargement")}</Text></View>;
  const domains = ["personnel", "professionnel", "sante", "apprentissage", "projets"];
  const constraints = ["travail", "sommeil", "famille", "transport", "autre"];
  return (
    <OnboardingShell step={step}>
      <Text accessibilityRole="header" className="font-display text-3xl leading-10 text-ink">{t(`onboarding.etapes.${step}.titre`)}</Text>
      <Text className="mb-7 mt-3 font-body text-base leading-6 text-muted">{t(`onboarding.etapes.${step}.description`)}</Text>
      {error ? <Text accessibilityRole="alert" className="mb-5 rounded border border-danger bg-surface p-4 text-danger">{error}</Text> : null}
      {step === 0 && <View className="flex-row flex-wrap">{domains.map(x => <ChoiceChip key={x} label={t(`onboarding.domaines.${x}`)} selected={draft.domaines.includes(x)} onPress={() => toggle("domaines", x)} />)}</View>}
      {step === 1 && <TextInput accessibilityLabel={t("onboarding.futurLabel")} className={`${fieldClass} min-h-36`} multiline onChangeText={futur => setDraft(d => ({ ...d, futur }))} placeholder={t("onboarding.futurPlaceholder")} placeholderTextColor="#707783" textAlignVertical="top" value={draft.futur} />}
      {step === 2 && <View>{draft.objectifs.map((goal, i) => <TextInput key={i} accessibilityLabel={t("onboarding.objectifLabel", { number: i + 1 })} className={fieldClass} onChangeText={value => setDraft(d => ({ ...d, objectifs: d.objectifs.map((x, index) => index === i ? value : x) }))} placeholder={t("onboarding.objectifPlaceholder")} placeholderTextColor="#707783" value={goal} />)}{draft.objectifs.length < 3 && <Pressable accessibilityRole="button" className="min-h-12 justify-center self-start" onPress={() => setDraft(d => ({ ...d, objectifs: [...d.objectifs, ""], durees: [...d.durees, 30] }))}><Text className="font-semibold text-lime">{t("onboarding.ajouterObjectif")}</Text></Pressable>}</View>}
      {step === 3 && <View className="flex-row flex-wrap">{constraints.map(x => <ChoiceChip key={x} label={t(`onboarding.contraintes.${x}`)} selected={draft.contraintes.includes(x)} onPress={() => toggle("contraintes", x)} />)}</View>}
      {step === 4 && <View className="flex-row justify-between">{[1,2,3,4,5].map(x => <ChoiceChip key={x} label={`${x}`} role="radio" selected={draft.energie === x} onPress={() => setDraft(d => ({ ...d, energie: x }))} />)}</View>}
      {step === 5 && <View>{(["doux","equilibre","direct"] as Tone[]).map(x => <ChoiceChip key={x} label={t(`onboarding.tons.${x}`)} role="radio" selected={draft.ton === x} onPress={() => setDraft(d => ({ ...d, ton: x }))} />)}</View>}
      {step === 6 && <View>{cleanGoals.map((goal, i) => <View key={i} className="mb-4 rounded border border-line bg-surface p-4"><TextInput accessibilityLabel={t("onboarding.plan.action", { number: i + 1 })} className="font-medium text-base text-ink" onChangeText={value => setDraft(d => ({ ...d, objectifs: d.objectifs.map((x, index) => index === i ? value : x) }))} value={goal} /><View className="mt-3 flex-row items-center"><Text className="mr-3 text-sm text-muted">{t("onboarding.plan.duree")}</Text>{[15,30,45,60].map(n => <Pressable key={n} accessibilityRole="radio" accessibilityState={{ checked: (draft.durees[i] ?? 30) === n }} className="mr-2 min-h-11 justify-center rounded border border-line px-2" onPress={() => setDraft(d => ({ ...d, durees: d.durees.map((x,index) => index === i ? n : x) }))}><Text className={(draft.durees[i] ?? 30) === n ? "text-lime" : "text-muted"}>{n}</Text></Pressable>)}</View></View>)}</View>}
      <View className="mt-auto flex-row pt-8">
        {step > 0 && <Pressable accessibilityRole="button" disabled={busy} className="mr-3 min-h-14 flex-1 items-center justify-center rounded border border-line" onPress={() => persist(step - 1)}><Text className="font-semibold text-ink">{t("onboarding.retour")}</Text></Pressable>}
        <Pressable accessibilityRole="button" accessibilityState={{ busy, disabled: busy || !valid() }} disabled={busy || !valid()} className="min-h-14 flex-1 items-center justify-center rounded bg-lime disabled:opacity-40" onPress={() => step === 6 ? complete() : persist(step + 1)}><Text className="font-semibold text-lime-ink">{busy ? t("onboarding.sauvegarde") : step === 6 ? t("onboarding.validerPlan") : t("onboarding.continuer")}</Text></Pressable>
      </View>
      <Text className="mt-4 text-center font-body text-xs text-subtle">{t("onboarding.autoSave")}</Text>
    </OnboardingShell>
  );
}
