import Purchases, {
  LOG_LEVEL,
  type PurchasesOffering,
  type PurchasesPackage,
} from "react-native-purchases";
import { Linking, Platform } from "react-native";
import { entitlementProActif } from "./achats-logic";

export { ENTITLEMENT_PRO } from "./achats-logic";

export type EtatAchats =
  | { disponible: false; raison: "plateforme" | "cle_absente" }
  | { disponible: true };

let configure = false;
let utilisateurCourant: string | undefined;

function clePublique() {
  return Platform.select({
    ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS,
    android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID,
  });
}

/** Configure RevenueCat une seule fois, puis lie l'identité authentifiée. */
export async function initialiserAchats(
  appUserId?: string,
): Promise<EtatAchats> {
  if (Platform.OS !== "ios" && Platform.OS !== "android") {
    return { disponible: false, raison: "plateforme" };
  }

  const apiKey = clePublique();
  if (!apiKey) return { disponible: false, raison: "cle_absente" };

  if (!configure) {
    Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.ERROR);
    Purchases.configure({ apiKey });
    configure = true;
  }

  if (appUserId && appUserId !== utilisateurCourant) {
    await Purchases.logIn(appUserId);
    utilisateurCourant = appUserId;
  }

  return { disponible: true };
}

export async function deconnecterAchats() {
  if (!configure || !utilisateurCourant) return;
  await Purchases.logOut();
  utilisateurCourant = undefined;
}

export async function chargerOffre(): Promise<PurchasesOffering | null> {
  const offerings = await Purchases.getOfferings();
  return offerings.current ?? null;
}

export async function acheterOffre(pack: PurchasesPackage): Promise<boolean> {
  const { customerInfo } = await Purchases.purchasePackage(pack);
  return entitlementProActif(customerInfo);
}

export async function estPro(): Promise<boolean> {
  return entitlementProActif(await Purchases.getCustomerInfo());
}

export async function restaurerAchats(): Promise<boolean> {
  return entitlementProActif(await Purchases.restorePurchases());
}

export async function ouvrirGestionAbonnement(): Promise<boolean> {
  const infos = await Purchases.getCustomerInfo();
  if (!infos.managementURL) return false;
  return Linking.openURL(infos.managementURL).then(() => true);
}
