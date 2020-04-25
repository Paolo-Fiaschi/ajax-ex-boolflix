$(document).ready(function () {
  var buttonSearch = $(".search");
  var source = $('.film-template').html();
  var template = Handlebars.compile(source);
  var imgFlag = ["en","it","fr","es"];
  var container = $('.filmContainer');
  var apiKey = "96dbb3102bf928acfb45de0581e0ec43";
  $(".inputSearch").val("");

  // al click genera i film corrispondenti
  buttonSearch.click(searchMovie);
  // al pulsante invio genera i film corrispondenti
  $(".inputSearch").keydown(searchMovieTastiera);

  // FUNZIONI -------------------------------------------------------------

  // mostra la bandiera della lingua se presente nelle img
  function generaFlag(codiceLing){
    var imgLing;
    if (imgFlag.includes(codiceLing)) {
      imgLing = "<img src='img/" + codiceLing + ".png'>";
      console.log("si");
      return imgLing;
    }
    return codiceLing;
  };
  //genera il voto come stella
  function generaStella(voto){
    var stelle = "";
    for (var i = 0; i < voto; i++) {
      stelle += "<span class='yellow'><i class='fas fa-star'></i></span>"
    };
    for (var j = 0; j < (5 - voto); j++) {
      stelle += "<span><i class='far fa-star'></i></span>"
    }
    return stelle;
  }
  // cerca film o serietv click
  function searchMovie(){
    var input = $(".inputSearch").val().toLowerCase();
    $(".box").data('index', '0');
    // reset della pagina e dell'input di ricerca
    $('.filmContainer').empty();
    $('.serieContainer').empty();
    $(".inputSearch").val("");

    // richieste per film
    chiamataAjax("Film",apiKey,"https://api.themoviedb.org/3/search/movie",input,$('.filmContainer'));

    // richieste per serie
    chiamataAjax("Serie TV",apiKey,"https://api.themoviedb.org/3/search/tv",input,$('.serieContainer'));
  };

  // cerca film o serie da pulsante invio
  function searchMovieTastiera(event){
    if ((event.which == 13)&&($(".inputSearch").val().length > 0)) {
      searchMovie();
    }
  };

  // // GENERARE CHIAMATA AJAX
  function chiamataAjax(tipo,api_key,url,queryArg,contPag){
    $.ajax({
      url: url,
      type: 'GET',
      data: {
        api_key: api_key,
        language: "it-IT",
        query: queryArg
      }
    })
    .done(function(data) {
      console.log("success");
      var filmInfo = data.results;
      contPag.append("<h2>" + tipo + "</h2>");
      generaOutput(filmInfo, tipo, "<div class='noResults'><H2>Nessun risultato trovato per: Film</H2><H2>Nessun risultato trovato per: Serie TV</H2></div>");

    })
    .fail(function(richiesta, stato, errori) {
      console.log(richiesta, stato, errori);
    })
  };

  // genera in pagina film o serietv
  function generaOutput(listaOggetti, tipo, noMovie){
    //fai un ciclo per i dati dei film
    for (var i = 0; i < listaOggetti.length; i++) {
      // se è una serie metti il nome serieTV
      if (tipo === "Serie TV") {
        var titoloGenerato = listaOggetti[i].name;
        var titoloOriginaleGenerato = listaOggetti[i].original_name;
        container = $('.serieContainer');
        var type = "tv";
        chiamataAjaxAttori(tipo, apiKey, type, listaOggetti[i].id);
      }else if(tipo === "Film"){//altrimenti metti quello del film
        var titoloGenerato = listaOggetti[i].title;
        var titoloOriginaleGenerato = listaOggetti[i].original_title;
        container = $('.filmContainer');
        var type = "movie";
        chiamataAjaxAttori(tipo, apiKey, type, listaOggetti[i].id);
      }
      var allFilmInfo = {
        cover: "https://image.tmdb.org/t/p/w342" + listaOggetti[i].poster_path,
        titolo: titoloGenerato,
        lingua: generaFlag(listaOggetti[i].original_language),
        votiTot: listaOggetti[i].vote_count,
        stelle: generaStella(Math.round(listaOggetti[i].vote_average/2)),
        trama: listaOggetti[i].overview,
        tipo: tipo,
        // cast: chiamataAjaxAttori(tipo, apiKey, type, listaOggetti[i].id)
      };

      // se non ho la cover mostra il titolo
      if (listaOggetti[i].poster_path == null) {
        allFilmInfo.noImg = "<div class='imgAssente'><span>" + titoloGenerato + "</span></div>";
      }

      // se non ho la trama non mostrare overview
      if (listaOggetti[i].overview != "") {
        allFilmInfo.overview = "Overview: ";
      }

      //se il titolo è uguale al titolo originale ne metto uno
      if (titoloGenerato == titoloOriginaleGenerato) {
        container.append(template(allFilmInfo));
      }else{//altrimenti appendi il film con entrambi i titoli
        allFilmInfo.titoloOriginale = titoloOriginaleGenerato;
        allFilmInfo.preTitolo = "Titolo Originale: ";
        container.append(template(allFilmInfo));
      };
    }
    // se non trovo risultati dillo all'utente
    if (listaOggetti.length == 0 ) {
      $('.filmContainer').html("");
      $('.serieContainer').html("");
      container.append(noMovie);
    }

  };
  // chiamata ajax attori
  function chiamataAjaxAttori(tipo, api_key, urlType, idType){
    $.ajax({
      url: "https://api.themoviedb.org/3/" + urlType + "/" + idType + "/credits?",
      type: 'GET',
      data: {
        api_key: apiKey,
        language: "it-IT",
      }
    })
    .done(function(data) {
      console.log("success");
      var castInfo = data.cast;
      var i = 0;
      while (i < castInfo.length) {
        if (i < 5) {
          var castName = {
            actor: castInfo[i].name,
          };
          var cast = "";
          cast += castInfo[i].name + ", ";
          console.log(cast);
          $(".cast").append(cast);
        }
        i++
      }
    })
    .fail(function(richiesta, stato, errori) {
      console.log("error");
    })
  };

});
