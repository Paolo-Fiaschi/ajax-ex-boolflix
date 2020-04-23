$(document).ready(function () {
  var buttonSearch = $(".search");
  var source = $('.film-template').html();
  var template = Handlebars.compile(source);
  var imgFlag = ["en","it","fr","es"];
  var container = $('.filmContainer');
  $(".inputSearch").val("");

  // al click genera i film corrispondenti
  buttonSearch.click(searchMovie);
  // al pulsante invio genera i film corrispondenti
  $(".inputSearch").keydown(searchMovieTastiera);

  // FUNZIONI
  function generaStella(voto){
    var stelle = "";
    for (var i = 0; i < voto; i++) {
      stelle += "<span class='yellow'><i class='fas fa-star'></i></span>"
    };
    for (var j = 0; j < (5 - voto); j++) {
      stelle += "<span><i class='far fa-star'></i></span>"
    }
    console.log(stelle);
    return stelle;
  }
  // function generaFlags(codiceLing){
  //var imgFlag = ["en","it","fr","es"];
  // for (var j = 0; j < imgFlag.length; j++) {
  //   // console.log(imgFlag[j]);
  //   if (listaOggetti[i].original_language == imgFlag[j]) {
  //     allFilmInfo.lingua = "<img src='img/" + listaOggetti[i].original_language + ".png'>";
  //     console.log("si");
  //   }
  // };

  // }
  // function noImg(cover, key, valore){
  //   if (listaOggetti[i].poster_path == null) {
  //     allFilmInfo.noImg = "<div class='imgAssente'><span>" + titoloGenerato + "</span></div>";
  //     console.log(titoloGenerato);
  //     return allFilmInfo.noImg;
  //   }
  // }

  // cerca film o serietv click
  function searchMovie(){
    var input = $(".inputSearch").val().toLowerCase();
    $('.filmContainer').html("");
    $('.serieContainer').html("");
    $.ajax({
      url: 'https://api.themoviedb.org/3/search/movie',
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
      if (filmInfo.length == 0 ) {
        $('.filmContainer').append("<div><H2>Nessun risultato trovato per: Film</H2><H2>Nessun risultato trovato per: Serie TV</H2></div>");
      }else {
        generaOutput(filmInfo, "Film");
      }
    })
    .fail(function(richiesta, stato, errori) {
      console.log(richiesta, stato, errori);
    })
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
      generaOutput(filmInfo, "Serie TV");
    })
    .fail(function(richiesta, stato, errori) {
      console.log(richiesta, stato, errori);
      $('.filmContainer').append("<div><H2>Nessun risultato trovato per: Film</H2><H2>Nessun risultato trovato per: Serie TV</H2></div>");
    })
    $(".inputSearch").val("");//cancella ricerca
  };
  // cerca film o serie da pulsante invio
  function searchMovieTastiera(event){
    if ((event.which == 13)&&($(".inputSearch").val().length > 0)) {
      searchMovie();
    }
  };
  // genera in pagina film o serietv
  function generaOutput(listaOggetti, tipo){
    //fai un ciclo per i dati dei film
    for (var i = 0; i < listaOggetti.length; i++) {
      // se è una serie metti il nome giusto
      if (tipo === "Serie TV") {
        var titoloGenerato = listaOggetti[i].name;
        var titoloOriginaleGenerato = listaOggetti[i].original_name;
        container = $('.serieContainer');
      }else if(tipo === "Film"){//altrimenti metti quello del film
        var titoloGenerato = listaOggetti[i].title;
        var titoloOriginaleGenerato = listaOggetti[i].original_title;
        container = $('.filmContainer');
      }
      var allFilmInfo = {
        cover: "https://image.tmdb.org/t/p/w342" + listaOggetti[i].poster_path,
        titolo: titoloGenerato,
        lingua: listaOggetti[i].original_language,
        votiTot: listaOggetti[i].vote_count,
        stelle: generaStella(Math.round(listaOggetti[i].vote_average/2)),
        trama: listaOggetti[i].overview,
        tipo: tipo
      };
      // mostra la bandiera della lingua se presente nelle img
      for (var j = 0; j < imgFlag.length; j++) {
        if (listaOggetti[i].original_language == imgFlag[j]) {
          allFilmInfo.lingua = "<img src='img/" + listaOggetti[i].original_language + ".png'>";
          console.log("si");
        }
      };
      // se non ho la cover mostra il titolo
      if (listaOggetti[i].poster_path == null) {
        allFilmInfo.noImg = "<div class='imgAssente'><span>" + titoloGenerato + "</span></div>";
        console.log(titoloGenerato);
      }
      // se non ho la trama non mostrare overview
      if (listaOggetti[i].overview != "") {
        allFilmInfo.overview = "Overview: ";
      }
      //se il titolo è uguale al titolo originale ne metto uno
      if (titoloGenerato == titoloOriginaleGenerato) {
        console.log(allFilmInfo);
        container.append(template(allFilmInfo));
      }else{//altrimenti appendi il film con entrambi i titoli
        allFilmInfo.titoloOriginale = titoloOriginaleGenerato;
        console.log(allFilmInfo);
        allFilmInfo.preTitolo = "Titolo Originale: ";
        container.append(template(allFilmInfo));
      };
    }

  }

});
