import { useState } from "react";
import { Switch, Text, View } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { useTranslation } from "react-i18next";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { QuietScreen } from "../../components/quiet-screen";
import { Chargement } from "../../components/etat";
import { Button, Card, Feedback, Field, Section } from "../../components/ui";
import { theme } from "../../lib/theme";

export default function Copilote() {
  const { t } = useTranslation();
  const conversations = useQuery(api.copilote.listerConversations);
  const create = useMutation(api.copilote.creerConversation);
  const send = useMutation(api.copilote.enregistrerMessageUtilisateur);
  const exclude = useMutation(api.copilote.exclureDeLaMemoire);
  const [conversationId, setConversationId] = useState<Id<"conversations">>();
  const current =
    conversations?.find(
      (conversation) => conversation._id === conversationId,
    ) ?? conversations?.[0];
  const messages = useQuery(
    api.copilote.messages,
    current ? { conversationId: current._id } : "skip",
  );
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function ensureConversation() {
    if (current) return current._id;
    const id = await create({ titre: t("copilote.defaultTitle") });
    setConversationId(id);
    return id;
  }
  async function submit() {
    const content = draft.trim();
    if (!content || busy) return;
    setBusy(true);
    setError("");
    try {
      const id = await ensureConversation();
      await send({
        conversationId: id,
        contenu: content,
        operationId: `${Date.now()}-${Math.random()}`,
      });
      setDraft("");
    } catch {
      setError(t("copilote.error"));
    } finally {
      setBusy(false);
    }
  }

  if (conversations === undefined) return <Chargement />;

  return (
    <QuietScreen
      title={t("copilote.title")}
      description={t("copilote.description")}
    >
      <View className="mb-8">
        <Card tone="growth">
        <Text className="font-semibold text-progress">
          {t("copilote.manualTitle")}
        </Text>
        <Text className="mt-2 text-sm leading-5 text-muted">
          {t("copilote.manualBody")}
        </Text>
        </Card>
      </View>
      {current ? (
        <View className="mb-8"><Card><View className="flex-row items-center justify-between gap-4"><Text className="min-w-0 flex-1 font-body text-sm leading-5 text-ink">
            {current.exclueMemoire ? t("copilote.memoryExcluded") : t("copilote.excludeMemory")}
          </Text><Switch accessibilityLabel={t("copilote.excludeMemory")} value={current.exclueMemoire} trackColor={{ false: theme.border, true: theme.progress }} thumbColor={theme.surface} onValueChange={(exclue) => void exclude({
              conversationId: current._id,
              exclue,
            })} /></View></Card></View>
      ) : null}
      {!messages?.length ? (
        <View className="mb-8"><Feedback message={t("copilote.emptyBody")} title={t("copilote.emptyTitle")} /></View>
      ) : (
        <Section>{messages.map((message) => (
          <View key={message._id} className="mb-3 ml-6"><Card tone="reflection">
            <Text className="text-xs uppercase tracking-widest text-subtle">
              {t("copilote.you")}
            </Text>
            <Text className="mt-2 text-ink">{message.contenu}</Text>
          </Card></View>
        ))}</Section>
      )}
      {error ? (
        <View className="mb-4"><Feedback message={error} tone="danger" /></View>
      ) : null}
      <Field
        label={t("copilote.inputLabel")}
        multiline
        placeholder={t("copilote.placeholder")}
        value={draft}
        onChangeText={setDraft}
      />
      <Button
        disabled={!draft.trim() || busy}
        label={t("copilote.save")}
        loading={busy}
        loadingLabel={t("copilote.saving")}
        onPress={submit}
      />
    </QuietScreen>
  );
}
