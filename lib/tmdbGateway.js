var request = require('request');

var errorCodes = {
    movieNotFound: 100,
    problemInvokingMovieDb: 200
}

exports.errorCodes = errorCodes


exports.getMovieInfo = function(apiKey, title, year, callback){
    var url = encodeURI('http://api.themoviedb.org/3/search/movie?api_key=' + apiKey + '&query=' + title);

    request.get(url, function(error, response, body){
        
        if(error){
            callback({ errorCode: errorCodes.problemInvokingMovieDb, errorDescription: error});
        }else{        
            var result = JSON.parse(body);
            if(result.total_results > 0){
                var candidateMovie = result.results[0];
            
                //After we got the response if we have the year, we filter by year
                if(year){
                    var resultsFilteredByYear = result.results.filter(function(item){ return item.release_date.substring(0, 4) == year});
                    if(resultsFilteredByYear.length > 0){
                        candidateMovie = resultsFilteredByYear[0];
                    }
                }
                
                //Here we have the basic information about the movie but we want some more details, so we are doing another request
                var detailsUrl = 'http://api.themoviedb.org/3/movie/' + candidateMovie.id +'?api_key=' + apiKey;
                
                request.get(detailsUrl, function(error, response, body){
                    var details = JSON.parse(body);
                    var movieInfo = {
                        title: details.title,
                        releaseDate: details.release_date,
                        duration: details.runtime,
                        summary: details.overview,
                        rating: details.vote_average,
                        imdbUrl: 'http://www.imdb.com/title/' + details.imdb_id,
                        posterUrl: 'http://image.tmdb.org/t/p/w185/' + details.poster_path
                    }
                    
                    callback(null, movieInfo);
                });
            }else{
                callback({ errorCode: errorCodes.movieNotFound, errorDescription: 'Movie ' + title + ' not found' });
            }
        }
       
    })
}
