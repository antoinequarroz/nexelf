export default {
  providers: [
    {
      // L'URL du site Convex, pas celle du front. Elle diffère entre
      // dev et prod : à déclarer dans les variables d'environnement Convex.
      domain: process.env.CONVEX_SITE_URL,
      applicationID: 'convex'
    }
  ]
}
