var config = require('../config.js');
var fs = require('fs');
var path = require("path");
var express = require('express');
var router = express.Router();
var tmdbgateway = require('../lib/tmdbGateway.js');
var filenameParser = require('../lib/filenameParser.js');

router.get('/movie-info', function (req, res) {
    var movieParsedName = filenameParser.parseMovieFileName(req.query.filename);
    if(movieParsedName){
        tmdbgateway.getMovieInfo(config.tmdbApiKey, movieParsedName.title, movieParsedName.year, function(error, movieInfo){
            if(error){
                if(error.errorCode == tmdbgateway.errorCodes.movieNotFound){
                    res.status(404);
                }else{
                    res.status(500);
                }
                return res.json('');
            }else{
                return res.json(movieInfo);
            }
        }); 
    }else{
        res.status(404);
        return res.json('');
    }    
})

//"touch" a file by renaming it so the minidlna server notices a file change and adds the video file and it's subtitle (if any) to its library
router.post('/touch/:file(*)', function (req, res) {
    
    var filePath = config.baseFolderPath + req.params.file;
    var tempFilePath = config.baseFolderPath + req.params.file + '_dlna_rename';


    fs.renameSync(filePath, tempFilePath);
    fs.renameSync(tempFilePath, filePath);

    //Check if the file has subs, if it has subs, we "touch them too"
    var srtFile = req.params.file.substring(0, req.params.file.length - 4) + '.srt';
    if (fs.existsSync(config.baseFolderPath + srtFile)) {
        var srtFilePath = config.baseFolderPath + srtFile;
        var strTempFile = config.baseFolderPath  + srtFile + '_dlna_rename';

        fs.renameSync(srtFilePath, strTempFile);
        fs.renameSync(strTempFile, srtFilePath);
    }
    
    return res.json();
})

//Gets the media files in a particular folder relative to the base folder
router.get('/files/:dir(*)?', function (req, res) {
 
  var folderUrl = '';
  var folder = config.baseFolderPath;
  if(req.params.dir){
    folder += req.params.dir;
    folderUrl = '/' + req.params.dir; 
  }
  
  var arrayOfFiles = fs.readdirSync(folder);

  var result = [];
  arrayOfFiles.filter(function(file){
        var fullPath = path.join(folder, file);
        if(!fs.statSync(fullPath).isFile()){
            return true;
        }else if(file.length < 4){
            return false;
        }
        else{
            var extension = file.substring(file.length - 4).toLowerCase();
            return extension == '.mkv'|| extension == '.avi';
        }
  }).forEach(function (file) {
        var fullPath = path.join(folder, file);
        var isDir = !fs.statSync(fullPath).isFile();
        if(isDir){
            result.push({ isDir: isDir, name: file, url: folderUrl + '/' + file });
        }else{
            var srtFilePath = path.join(folder, file.substring(0, file.length - 4) + '.srt');
            result.push({ isDir: isDir, name: file, url: folderUrl + '/' + file, hasSubs: fs.existsSync(srtFilePath) });
        }
  });
  
  var folderType = 'Undefined';
    
  if((folder + '/').indexOf(config.moviesFolderPath) == 0){
    folderType = 'Movies';
  }else if((folder + '/').indexOf(config.seriesFolderPath) == 0){
    folderType = 'Series';
  }

  res.json({ folderType: folderType, items: result });
})

module.exports = router;
