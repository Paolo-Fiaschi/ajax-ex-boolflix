$(document).ready(function () {
  var buttonSearch = $(".search");
  var source = $('.film-template').html();
  var template = Handlebars.compile(source);
  $(".inputSearch").val("");

  // al click genera i film corrispondenti
  buttonSearch.click(

    function(){
      var input = $(".inputSearch").val().toLowerCase();
      $(".filmContainer").empty();
      $.ajax({
        url: 'https://api.themoviedb.org/3/search/tv',
        type: 'GET',
        data: {
          api_key: '96dbb3102bf928acfb45de0581e0ec43',
          language: "it-IT",
          query: input
        }
      })
      .done(function(data) {
        console.log("success");
        var filmInfo = data.results;
        if (filmInfo.length == 0) {
          $('.filmContainer').append("<H2>Nessun risultato trovato</div>");
        }else {
          for (var i = 0; i < filmInfo.length; i++) {//fai un ciclo per i dati dei film
            var allFilmInfo = {
              titolo: filmInfo[i].name,
              lingua: filmInfo[i].original_language,
              voto: filmInfo[i].vote_average
            };
            var titolo = filmInfo[i].name;
            var titoloOriginale = filmInfo[i].original_name;
            if (titolo == titoloOriginale) {
              console.log(allFilmInfo);
              $('.filmContainer').append(template(allFilmInfo));//se il titolo è uguale al titolo originale ne metto uno
            }else{
              allFilmInfo.titoloOriginale = filmInfo[i].original_name;
              console.log(allFilmInfo);
              allFilmInfo.preTitolo = "Titolo Originale: ";
              $('.filmContainer').append(template(allFilmInfo));//appendi il film con entrambi i titoli
            };
          }
        }
        $(".inputSearch").val("");//cancella ricerca
      })
      .fail(function(richiesta, stato, errori) {
        console.log(richiesta, stato, errori);
      })

    }
  );



});
