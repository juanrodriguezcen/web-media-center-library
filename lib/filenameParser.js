

exports.parseMovieFileName= function (filename){
   
    var rePattern = new RegExp(/^(.*)\.(\d{4})\.(\d{3,4}p)\..*[^-]*-(.*)\.(.*)$/);

    
    var arrMatches = filename.match(rePattern);

    if(arrMatches && arrMatches.length == 6){
        return {
            title: arrMatches[1].replace(/\./g, ' '),
            year: arrMatches[2],
            quality: arrMatches[3] + 'p',
            group: arrMatches[4],
            extension: arrMatches[5]
        }
    }else{
        return '';
    }
}