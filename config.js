var private_config = require('./privateConfig.js'); //Private config is just a config file with same keys not to upload to git because it contains sensitive information (passwords, api keys, etc). You just need to create a "privateConfig.js" or replace the keys in this files that use "private_config" variable.

var config = {}

config.base_folder_path = '/media/sharedHDD/';
config.movies_folder_path = '/media/sharedHDD/Movies/';
config.series_folder_path = '/media/sharedHDD/Series/';

config.tmdb_api_key = private_config.tmdb_api_key;

module.exports = config;