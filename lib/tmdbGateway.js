var request = require('request');

var errorCodes = {
    movie_not_found: 100,
    problem_invoking_movie_db: 200
}

exports.errorCodes = errorCodes


exports.getMovieInfo = function(api_key, title, year, callback){
    var url = encodeURI('http://api.themoviedb.org/3/search/movie?api_key=' + api_key + '&query=' + title);

    request.get(url, function(error, response, body){
        
        if(error){
            callback({ error_code: errorCodes.problem_invoking_movie_db, error_description: error});
        }else{
            var result = JSON.parse(body);
            if(result.total_results > 0){
                var candidate_movie = result.results[0];
            
                //After we got the response if we have the year, we filter by year
                if(year){
                    var results_filtered_by_year = result.results.filter(function(item){ return item.release_date.substring(0, 4) == year});
                    if(results_filtered_by_year.length > 0){
                        candidate_movie = results_filtered_by_year[0];
                    }
                }
                
                //Here we have the basic information about the movie but we want some more details, so we are doing another request
                var details_url = 'http://api.themoviedb.org/3/movie/' + candidate_movie.id +'?api_key=' + api_key;
                request.get(details_url, function(error, response, body){
                    var details = JSON.parse(body);
                    var movie_info = {
                        title: details.title,
                        release_date: details.release_date,
                        duration: details.runtime,
                        summary: details.overview,
                        rating: details.vote_average,
                        imdb_url: 'http://www.imdb.com/title/' + details.imdb_id,
                        poster_url: 'http://image.tmdb.org/t/p/w185/' + details.poster_path
                    }
                    
                    callback(null, movie_info);
                });
            }else{
                callback({ error_code: errorCodes.movie_not_found, error_description: 'Movie ' + title + ' not found' });
            }
        }
       
    })
}
