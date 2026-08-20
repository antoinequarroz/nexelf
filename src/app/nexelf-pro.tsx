import { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import type { PurchasesPackage } from "react-native-purchases";
import { useTranslation } from "react-i18next";
import { QuietScreen } from "../components/quiet-screen";
import { Badge, Button, Card, Feedback, Section } from "../components/ui";
import {
  acheterOffre,
  chargerOffre,
  estPro,
  initialiserAchats,
  ouvrirGestionAbonnement,
  restaurerAchats,
  type EtatAchats,
} from "../lib/achats";
import { achatAnnule } from "../lib/achats-logic";
import { authClient } from "../lib/auth-client";

type Retour =
  | ""
  | "cancelled"
  | "purchaseError"
  | "notActivated"
  | "restored"
  | "nothingRestored"
  | "restoreError"
  | "manageUnavailable";

export default function NexelfPro() {
  const { t } = useTranslation();
  const { data: session, isPending } = authClient.useSession();
  const accountId = session?.user.id;
  const [etat, setEtat] = useState<EtatAchats | null>(null);
  const [offres, setOffres] = useState<PurchasesPackage[]>([]);
  const [chargement, setChargement] = useState(true);
  const [occupation, setOccupation] = useState<
    "" | "purchase" | "restore" | "manage"
  >("");
  const [packageEnCours, setPackageEnCours] = useState("");
  const [retour, setRetour] = useState<Retour>("");
  const [pro, setPro] = useState(false);

  const charger = useCallback(async () => {
    setChargement(true);
    setRetour("");
    try {
      const configuration = await initialiserAchats(accountId);
      setEtat(configuration);
      if (!configuration.disponible) {
        setOffres([]);
        return;
      }
      const [offering, actif] = await Promise.all([chargerOffre(), estPro()]);
      setOffres(offering?.availablePackages ?? []);
      setPro(actif);
    } catch {
      setEtat({ disponible: false, raison: "cle_absente" });
      setOffres([]);
    } finally {
      setChargement(false);
    }
  }, [accountId]);

  useEffect(() => {
    if (!isPending) queueMicrotask(() => void charger());
  }, [charger, isPending]);

  function periode(pack: PurchasesPackage) {
    const period = pack.product.subscriptionPeriod;
    if (period === "P1M") return t("nexelfPro.periodMonth");
    if (period === "P1Y") return t("nexelfPro.periodYear");
    if (period === "P1W") return t("nexelfPro.periodWeek");
    return t("nexelfPro.periodOther", { period: period ?? pack.packageType });
  }

  async function acheter(pack: PurchasesPackage) {
    if (occupation) return;
    setOccupation("purchase");
    setPackageEnCours(pack.identifier);
    setRetour("");
    try {
      const actif = await acheterOffre(pack);
      setPro(actif);
      if (!actif) setRetour("notActivated");
    } catch (erreur) {
      setRetour(achatAnnule(erreur) ? "cancelled" : "purchaseError");
    } finally {
      setOccupation("");
      setPackageEnCours("");
    }
  }

  async function restaurer() {
    if (occupation || !etat?.disponible) return;
    setOccupation("restore");
    setRetour("");
    try {
      const actif = await restaurerAchats();
      setPro(actif);
      setRetour(actif ? "restored" : "nothingRestored");
    } catch {
      setRetour("restoreError");
    } finally {
      setOccupation("");
    }
  }

  async function gerer() {
    if (occupation || !etat?.disponible) return;
    setOccupation("manage");
    setRetour("");
    try {
      if (!(await ouvrirGestionAbonnement())) setRetour("manageUnavailable");
    } catch {
      setRetour("manageUnavailable");
    } finally {
      setOccupation("");
    }
  }

  const retourErreur =
    retour === "purchaseError" ||
    retour === "notActivated" ||
    retour === "restoreError";

  return (
    <QuietScreen
      title={t("nexelfPro.title")}
      description={t("nexelfPro.description")}
    >
      <Section>
        <View className="gap-4">
          <Card>
            <Badge label={t("nexelfPro.freeTitle")} />
            <Text className="mt-3 font-body text-sm leading-5 text-muted">
              {t("nexelfPro.freeBody")}
            </Text>
          </Card>
          <Card tone="reflection">
            <Badge label={t("nexelfPro.proTitle")} tone="action" />
            <Text className="mt-3 font-body text-sm leading-5 text-muted">
              {t("nexelfPro.proBody")}
            </Text>
          </Card>
        </View>
      </Section>

      <Section title={t("nexelfPro.offersTitle")}>
        {chargement ? (
          <Feedback loading message={t("nexelfPro.loading")} />
        ) : !session ? (
          <Feedback message={t("nexelfPro.identityRequired")} tone="warning" />
        ) : !etat?.disponible ? (
          <Feedback
            title={t("nexelfPro.unavailableTitle")}
            message={t("nexelfPro.unavailableBody")}
          />
        ) : pro ? (
          <Feedback
            title={t("nexelfPro.successTitle")}
            message={t("nexelfPro.successBody")}
            tone="success"
          />
        ) : offres.length === 0 ? (
          <Feedback
            actionLabel={t("nexelfPro.retry")}
            message={t("nexelfPro.noOfferBody")}
            onAction={() => void charger()}
            title={t("nexelfPro.noOfferTitle")}
          />
        ) : (
          <View className="gap-4">
            {offres.map((pack) => (
              <Card key={pack.identifier}>
                <Text
                  accessibilityRole="header"
                  className="font-semibold text-lg text-ink"
                >
                  {pack.product.title}
                </Text>
                <Text className="mb-4 mt-2 font-body text-sm text-muted">
                  {t("nexelfPro.packagePeriod", {
                    price: pack.product.priceString,
                    period: periode(pack),
                  })}
                </Text>
                <Button
                  disabled={Boolean(occupation)}
                  label={t("nexelfPro.buy", { offer: pack.product.title })}
                  loading={
                    occupation === "purchase" &&
                    packageEnCours === pack.identifier
                  }
                  loadingLabel={t("nexelfPro.buying")}
                  onPress={() => void acheter(pack)}
                />
              </Card>
            ))}
          </View>
        )}
      </Section>

      {retour ? (
        <View className="mb-8">
          <Feedback
            message={t(`nexelfPro.${retour}`)}
            tone={
              retourErreur
                ? "danger"
                : retour === "restored"
                  ? "success"
                  : "neutral"
            }
          />
        </View>
      ) : null}

      <Section title={t("nexelfPro.accountTitle")}>
        <View className="gap-3">
          <Button
            disabled={Boolean(occupation) || !etat?.disponible || !session}
            label={t("nexelfPro.restore")}
            loading={occupation === "restore"}
            loadingLabel={t("nexelfPro.restoring")}
            onPress={() => void restaurer()}
            variant="secondary"
          />
          <Button
            disabled={Boolean(occupation) || !etat?.disponible || !session}
            label={t("nexelfPro.manage")}
            onPress={() => void gerer()}
            variant="ghost"
          />
        </View>
      </Section>
    </QuietScreen>
  );
}
