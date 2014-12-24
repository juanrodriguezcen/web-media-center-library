var privateConfig = require('./privateConfig.js'); //Private config is just a config file with same keys not to upload to git because it contains sensitive information (passwords, api keys, etc). You just need to create a "privateConfig.js" or replace the keys in this files that use "private_config" variable.

var config = {}

config.baseFolderPath = '/media/sharedHDD/';
config.moviesFolderPath = '/media/sharedHDD/Movies/';
config.seriesFolderPath = '/media/sharedHDD/Series/';

config.tmdbApiKey = privateConfig.tmdbApiKey;

module.exports = config;