import Purchases, { LOG_LEVEL } from 'react-native-purchases'
import { Platform } from 'react-native'

// RevenueCat, pas Stripe.
// Le contenu numérique passe OBLIGATOIREMENT par les achats in-app :
// brancher Stripe dans une app fait rejeter la soumission.

export function initAchats(appUserId?: string) {
  Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.ERROR)

  const apiKey = Platform.select({
    ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS,
    android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID
  })
  if (!apiKey) return

  // Lier l'achat à l'identité applicative, pas à l'identifiant anonyme :
  // c'est ce qui permet de retrouver l'abonnement sur un autre appareil,
  // et de le partager avec une éventuelle version web.
  Purchases.configure({ apiKey, appUserID: appUserId })
}

export async function estAbonne(): Promise<boolean> {
  const infos = await Purchases.getCustomerInfo()
  return Object.keys(infos.entitlements.active).length > 0
}

// Restauration des achats : OBLIGATOIRE chez Apple.
// Une app sans ce bouton est rejetée.
export async function restaurerAchats(): Promise<boolean> {
  const infos = await Purchases.restorePurchases()
  return Object.keys(infos.entitlements.active).length > 0
}
