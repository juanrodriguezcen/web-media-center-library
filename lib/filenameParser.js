
function parseMovieFileName(filename){
   
    var rePattern = new RegExp(/^(.*)\.(\d{4})\..*(\d{3,4}p)\..*[^-]*-(.*)\.(.*)$/);
    var arrMatches = filename.match(rePattern);

    if(arrMatches && arrMatches.length == 6){
        return {
            type: 'Movie',
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

function parseSeriesFileName (filename){
    var rePattern = new RegExp(/^(.*)\.S(\d{1,2})E(\d{1,2}).*(\d{3,4}p).*$/);
    var arrMatches = filename.match(rePattern);
    if(arrMatches && arrMatches.length == 5){
        return {
            type: 'Series',
            title: arrMatches[1].replace(/\./g, ' '),
            season: arrMatches[2],
            episode: arrMatches[3],
            quality: arrMatches[4] + 'p'
        }
    }else{
        return '';
    }
}

exports.parseFileName = function(filename){
    //We try to match it as a serie
    var result = parseSeriesFileName(filename);
    if(!result){
        //We try to match it as a movie
        result = parseMovieFileName(filename);
    }
    
    return result;
}


