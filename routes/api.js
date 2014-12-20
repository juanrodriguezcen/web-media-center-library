var config = require('../config.js');
var fs = require('fs');
var path = require("path");
var express = require('express');
var router = express.Router();

//"touch" a file by renaming it so the minidlna server notices a file change and adds the video file and it's subtitle (if any) to its library
router.post('/touch/:file(*)', function (req, res) {
    
    var file_path = config.base_folder_path + req.params.file;
    var temp_file_path = config.base_folder_path + req.params.file + '_dlna_rename';


    fs.renameSync(file_path, temp_file_path);
    fs.renameSync(temp_file_path, file_path);

    //Check if the file has subs, if it has subs, we "touch them too"
    var srt_file = req.params.file.substring(0, req.params.file.length - 4) + '.srt';
    if (fs.existsSync(config.base_folder_path + srt_file)) {
        var srt_file_path = config.base_folder_path + srt_file;
        var str_temp_file = config.base_folder_path  + srt_file + '_dlna_rename';

        fs.renameSync(srt_file_path, str_temp_file);
        fs.renameSync(str_temp_file, srt_file_path);
    }
    
    return res.json();
})

//Gets the media files in a particular folder relative to the base folder
router.get('/files/:dir(*)?', function (req, res) {
 
  var folder_url = '';
  var folder = config.base_folder_path;
  if(req.params.dir){
    folder += req.params.dir;
    folder_url = '/' + req.params.dir; 
  }
  
  var arrayOfFiles = fs.readdirSync(folder);

  var result = [];
  arrayOfFiles.filter(function(file){
        var full_path = path.join(folder, file);
        if(!fs.statSync(full_path).isFile()){
            return true;
        }else if(file.length < 4){
            return false;
        }
        else{
            var extension = file.substring(file.length - 4).toLowerCase();
            return extension == '.mkv'|| extension == '.avi';
        }
  }).forEach(function (file) {
        var full_path = path.join(folder, file);
        var is_dir = !fs.statSync(full_path).isFile();
        if(is_dir){
            result.push({ is_dir: is_dir, name: file, url: folder_url + '/' + file });
        }else{
            var srtFilePath = path.join(folder, file.substring(0, file.length - 4) + '.srt');
            result.push({ is_dir: is_dir, name: file, url: folder_url + '/' + file, has_subs: fs.existsSync(srtFilePath) });
        }
  });

  res.json(result);
})

module.exports = router;
