import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useMutation, useQuery } from "convex/react";
import { useTranslation } from "react-i18next";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { QuietScreen } from "../../components/quiet-screen";
import { Chargement } from "../../components/etat";

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
      <View
        accessibilityRole="summary"
        className="mb-6 rounded border border-lime bg-surface p-4"
      >
        <Text className="font-semibold text-lime">
          {t("copilote.manualTitle")}
        </Text>
        <Text className="mt-2 text-sm leading-5 text-muted">
          {t("copilote.manualBody")}
        </Text>
      </View>
      {current ? (
        <Pressable
          accessibilityRole="switch"
          accessibilityState={{ checked: current.exclueMemoire }}
          className="mb-6 min-h-12 justify-center"
          onPress={() =>
            exclude({
              conversationId: current._id,
              exclue: !current.exclueMemoire,
            })
          }
        >
          <Text className="text-ink">
            {current.exclueMemoire
              ? t("copilote.memoryExcluded")
              : t("copilote.excludeMemory")}
          </Text>
        </Pressable>
      ) : null}
      {!messages?.length ? (
        <View className="mb-6 rounded border border-line p-4">
          <Text className="font-medium text-ink">
            {t("copilote.emptyTitle")}
          </Text>
          <Text className="mt-2 text-sm leading-5 text-muted">
            {t("copilote.emptyBody")}
          </Text>
        </View>
      ) : (
        messages.map((message) => (
          <View key={message._id} className="mb-3 ml-8 rounded bg-raised p-4">
            <Text className="text-xs uppercase tracking-widest text-subtle">
              {t("copilote.you")}
            </Text>
            <Text className="mt-2 text-ink">{message.contenu}</Text>
          </View>
        ))
      )}
      {error ? (
        <Text accessibilityRole="alert" className="mb-3 text-danger">
          {error}
        </Text>
      ) : null}
      <TextInput
        accessibilityLabel={t("copilote.inputLabel")}
        className="min-h-28 rounded border border-line bg-surface p-4 text-base text-ink"
        multiline
        placeholder={t("copilote.placeholder")}
        placeholderTextColor="#707783"
        value={draft}
        onChangeText={setDraft}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: !draft.trim() || busy }}
        disabled={!draft.trim() || busy}
        className="mt-3 min-h-14 items-center justify-center rounded bg-lime disabled:opacity-40"
        onPress={submit}
      >
        <Text className="font-semibold text-lime-ink">
          {busy ? t("copilote.saving") : t("copilote.save")}
        </Text>
      </Pressable>
    </QuietScreen>
  );
}
