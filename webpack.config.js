const Encore = require('@symfony/webpack-encore');

Encore
  .setOutputPath('public/build/')
  .setPublicPath('/truc/qcm/public/build')
  .addEntry('app', './assets/app.js')
  .enableSassLoader()
  .enableSingleRuntimeChunk()
;

/* Pour une config plus propre si apache pointe sur /public (c'est le cas de notre server)
.setPublicPath('/build')
.setManifestKeyPrefix('build/')
 */

module.exports = Encore.getWebpackConfig();
