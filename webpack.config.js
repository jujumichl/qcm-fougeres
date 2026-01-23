const Encore = require('@symfony/webpack-encore');

Encore
  .setOutputPath('public/build/')
  .setPublicPath('/stages_fougeres_owen/qcm/build') // Dans le public path, il faut mettre le lien qui mène vers le build et pas juste /build
  .setManifestKeyPrefix('build/')
  .enableStimulusBridge('./assets/controllers.json') // ← important
  .addEntry('app', './assets/app.js')
  .enableSassLoader()
  .enableSingleRuntimeChunk()
;

/* Pour une config plus propre si apache pointe sur /public (c'est le cas de notre server)
.setPublicPath('/build')
.setManifestKeyPrefix('build/')
 */

module.exports = Encore.getWebpackConfig();
