import { useEffect, useMemo, useRef, useState } from "react";
import { Platform, Pressable, Switch, Text, View } from "react-native";
import Constants from "expo-constants";
import { useLocalSearchParams } from "expo-router";
import { useMutation } from "convex/react";
import type { FunctionReference } from "convex/server";
import { useTranslation } from "react-i18next";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { QuietScreen } from "../components/quiet-screen";
import { Button, Card, Feedback, Field, Section } from "../components/ui";
import { authClient } from "../lib/auth-client";
import { clearSupportDraft, loadSupportDraft, saveSupportDraft } from "../lib/support-draft";
import { createOperationId, SUPPORT_CATEGORIES, type SupportCategory, type SupportDiagnostic, validateSupportDraft } from "../lib/support";
import { theme } from "../lib/theme";

const articles = ["account", "data", "subscription", "ai"] as const;
type SendSupport = FunctionReference<"mutation", "public", {
  type: "contact" | "signalement";
  categorie: SupportCategory;
  sujet: string;
  message: string;
  operationId: string;
  messageId?: Id<"messagesConversation">;
  diagnostic?: SupportDiagnostic;
  consentementDiagnostic: boolean;
}, { reference: string; statut: "recu" }>;
const supportApi = (api as unknown as { support: { envoyer: SendSupport } }).support;

export default function Aide() {
  const { t, i18n } = useTranslation();
  const { data: session, isPending } = authClient.useSession();
  const params = useLocalSearchParams<{ messageId?: string }>();
  const report = Boolean(params.messageId);
  const send = useMutation(supportApi.envoyer);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<SupportCategory>(report ? "ia" : "compte");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [diagnostic, setDiagnostic] = useState<SupportDiagnostic | null>(null);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [restored, setRestored] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const operationId = useRef(createOperationId());
  const accountId = session?.user.id;

  useEffect(() => {
    if (!accountId) return;
    void loadSupportDraft(accountId).then((draft) => {
      if (draft && !report) {
        setCategory(draft.category);
        setSubject(draft.subject);
        setMessage(draft.message);
        setRestored(true);
      }
      setDraftLoaded(true);
    });
  }, [accountId, report]);

  useEffect(() => {
    if (!accountId || !draftLoaded || report || reference) return;
    const timer = setTimeout(() => {
      if (subject || message) void saveSupportDraft(accountId, { category, subject, message, updatedAt: Date.now() });
    }, 300);
    return () => clearTimeout(timer);
  }, [accountId, category, draftLoaded, message, reference, report, subject]);

  const visibleArticles = useMemo(() => {
    const needle = search.trim().toLocaleLowerCase(i18n.language);
    if (!needle) return articles;
    return articles.filter((article) => `${t(`support.articles.${article}Title`)} ${t(`support.articles.${article}Body`)}`.toLocaleLowerCase(i18n.language).includes(needle));
  }, [i18n.language, search, t]);

  function toggleDiagnostic(enabled: boolean) {
    setDiagnostic(enabled ? {
      appVersion: Constants.expoConfig?.version ?? "unknown",
      platform: (["ios", "android", "web"].includes(Platform.OS) ? Platform.OS : "unknown") as SupportDiagnostic["platform"],
      systemVersion: String(Platform.Version),
      locale: i18n.language,
    } : null);
  }

  async function submit() {
    const draft = { category, subject, message, updatedAt: Date.now() };
    const invalid = validateSupportDraft(draft);
    if (invalid) {
      setError(t(`support.invalid${invalid === "subject" ? "Subject" : "Message"}`));
      return;
    }
    setBusy(true);
    setError("");
    try {
      const result = await send({
        type: report ? "signalement" : "contact",
        categorie: category,
        sujet: subject.trim(),
        message: message.trim(),
        operationId: operationId.current,
        messageId: report ? params.messageId as Id<"messagesConversation"> : undefined,
        diagnostic: diagnostic ?? undefined,
        consentementDiagnostic: Boolean(diagnostic),
      });
      setReference(result.reference);
      if (accountId) await clearSupportDraft(accountId);
    } catch (caught) {
      const code = caught instanceof Error ? caught.message : "";
      setError(t(code.includes("RATE_LIMIT") ? "support.errors.rate" : code.includes("FORBIDDEN") ? "support.errors.forbidden" : "support.errors.generic"));
    } finally {
      setBusy(false);
    }
  }

  if (isPending || (accountId && !draftLoaded)) return <QuietScreen title={t("support.title")} description={t("support.description")}><Feedback loading message={t("etats.chargement")} /></QuietScreen>;

  return (
    <QuietScreen title={t("support.title")} description={t("support.description")}>
      <Section title={t("support.articlesTitle")}>
        <Field accessibilityLabel={t("support.search")} label={t("support.search")} placeholder={t("support.searchPlaceholder")} value={search} onChangeText={setSearch} />
        {visibleArticles.length ? visibleArticles.map((article) => <View className="mb-3" key={article}><Card><Text accessibilityRole="header" className="font-semibold text-ink">{t(`support.articles.${article}Title`)}</Text><Text className="mt-2 text-sm leading-5 text-muted">{t(`support.articles.${article}Body`)}</Text></Card></View>) : <Feedback actionLabel={t("support.clearSearch")} message={t("support.noResultBody")} onAction={() => setSearch("")} title={t("support.noResultTitle")} />}
      </Section>

      {!session ? <Feedback message={t("support.errors.forbidden")} tone="warning" /> : reference ? <Feedback actionLabel={t("support.newRequest")} message={`${t("support.successBody")} ${t("support.reference", { reference })}`} onAction={() => { setReference(""); setSubject(""); setMessage(""); setDiagnostic(null); operationId.current = createOperationId(); }} title={t("support.successTitle")} tone="success" /> : <Section title={t(report ? "support.reportTitle" : "support.contactTitle")}>
        {report ? <View className="mb-4"><Feedback message={t("support.reportHint")} /></View> : null}
        {restored ? <View className="mb-4"><Feedback message={t("support.draftRestored")} /></View> : null}
        {error ? <View className="mb-4"><Feedback message={error} tone="danger" /></View> : null}
        <View className="mb-4"><Feedback message={t("support.privacyWarning")} tone="warning" /></View>
        <Text className="mb-2 font-medium text-sm text-ink">{t("support.category")}</Text>
        <View accessibilityRole="radiogroup" className="mb-5 flex-row flex-wrap gap-2">
          {SUPPORT_CATEGORIES.map((item) => <Pressable key={item} accessibilityRole="radio" accessibilityState={{ checked: category === item }} className={`min-h-touch justify-center rounded border px-4 ${category === item ? "border-action bg-reflection" : "border-line bg-surface"}`} onPress={() => setCategory(item)}><Text className={category === item ? "text-action" : "text-ink"}>{t(`support.categories.${item}`)}</Text></Pressable>)}
        </View>
        <Field error={error && validateSupportDraft({ category, subject, message, updatedAt: 0 }) === "subject" ? t("support.invalidSubject") : undefined} label={t("support.subject")} maxLength={120} placeholder={t("support.subjectPlaceholder")} value={subject} onChangeText={setSubject} />
        <Field error={error && validateSupportDraft({ category, subject, message, updatedAt: 0 }) === "message" ? t("support.invalidMessage") : undefined} label={t("support.message")} maxLength={2000} multiline placeholder={t("support.messagePlaceholder")} value={message} onChangeText={setMessage} />
        <Card><View className="flex-row items-center justify-between gap-4"><View className="flex-1"><Text className="font-medium text-ink">{t("support.diagnosticTitle")}</Text><Text className="mt-1 text-sm leading-5 text-muted">{t("support.diagnosticOptional")}</Text></View><Switch accessibilityLabel={t("support.diagnosticTitle")} accessibilityHint={t("support.diagnosticDetails")} accessibilityState={{ checked: Boolean(diagnostic) }} value={Boolean(diagnostic)} onValueChange={toggleDiagnostic} trackColor={{ false: theme.border, true: theme.progress }} thumbColor={theme.surface} /></View><Text className="mt-4 text-sm leading-5 text-muted">{t("support.diagnosticDetails")}</Text>{diagnostic ? <Text className="mt-3 text-sm leading-5 text-ink">{t("support.diagnosticReview", diagnostic)}</Text> : null}</Card>
        <View className="mt-5"><Button disabled={busy} label={t("support.send")} loading={busy} loadingLabel={t("support.sending")} onPress={() => void submit()} /></View>
      </Section>}
    </QuietScreen>
  );
}
