const Encore = require('@symfony/webpack-encore');

Encore
  .setOutputPath('public/build/')
  .setPublicPath('/stage_fougeres_owen/qcm/public/build') // Dans le public path, il faut mettre le lien qui mène vers le build et pas juste /build
  .enableStimulusBridge('./assets/controllers.json') // ← important
  .addEntry('app', './assets/app.js')
  .enableSassLoader()
  .enableSingleRuntimeChunk()
;

module.exports = Encore.getWebpackConfig();
