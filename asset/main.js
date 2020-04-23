$(document).ready(function () {
  var buttonSearch = $(".search");
  var source = $('.film-template').html();
  var template = Handlebars.compile(source);
  var imgFlag = ["en","it","fr","es"];
  $(".inputSearch").val("");

  // al click genera i film corrispondenti
  buttonSearch.click(

    function(){
      var input = $(".inputSearch").val().toLowerCase();
      $(".filmContainer").empty();
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
        if (filmInfo.length == 0) {
          $('.filmContainer').append("<div><H2>Nessun risultato trovato per: Film</H2><H2>Nessun risultato trovato per: Serie TV</H2></div>");
        }else {
          generaOutput(filmInfo, "Film");

          // for (var i = 0; i < filmInfo.length; i++) {//fai un ciclo per i dati dei film
          //   var allFilmInfo = {
          //     cover: "https://image.tmdb.org/t/p/w185" + filmInfo[i].poster_path,
          //     titolo: filmInfo[i].title,
          //     lingua: filmInfo[i].original_language,
          //     votiTot: filmInfo[i].vote_count,
          //     tipo: "Film"
          //   };
          //   for (var j = 0; j < imgFlag.length; j++) {
          //     // console.log(imgFlag[j]);
          //     if (filmInfo[i].original_language == imgFlag[j]) {
          //       allFilmInfo.lingua = "<img src='img/" + filmInfo[i].original_language + ".png'>";
          //       console.log("si");
          //     }
          //   };
          //   var voto = Math.round(filmInfo[i].vote_average/2);
          //   var stelle = generaStella(voto);
          //   allFilmInfo.stelle = stelle;
          //   var titolo = filmInfo[i].title;
          //   var titoloOriginale = filmInfo[i].original_title;
          //   if (titolo == titoloOriginale) {
          //     console.log(allFilmInfo);
          //     $('.filmContainer').append(template(allFilmInfo));//se il titolo è uguale al titolo originale ne metto uno
          //   }else{
          //     allFilmInfo.titoloOriginale = filmInfo[i].original_title;
          //     console.log(allFilmInfo);
          //     allFilmInfo.preTitolo = "Titolo Originale: ";
          //     $('.filmContainer').append(template(allFilmInfo));//appendi il film con entrambi i titoli
          //   };
          // }
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
        // for (var i = 0; i < filmInfo.length; i++) {//fai un ciclo per i dati dei film
        //   var allFilmInfo = {
        //     cover: "https://image.tmdb.org/t/p/w185" + filmInfo[i].poster_path,
        //     titolo: filmInfo[i].name,
        //     lingua: filmInfo[i].original_language,
        //     votiTot: filmInfo[i].vote_count,
        //     tipo: "Serie TV"
        //   };
        //   for (var j = 0; j < imgFlag.length; j++) {
        //     // console.log(imgFlag[j]);
        //     if (filmInfo[i].original_language == imgFlag[j]) {
        //       allFilmInfo.lingua = "<img src='img/" + filmInfo[i].original_language + ".png'>";
        //       console.log("si");
        //     }
        //   };
        //   var voto = Math.round(filmInfo[i].vote_average/2);
        //   console.log(voto);
        //   var stelle = generaStella(voto);
        //   allFilmInfo.stelle = stelle;
        //   var titolo = filmInfo[i].name;
        //   var titoloOriginale = filmInfo[i].original_name;
        //   if (titolo == titoloOriginale) {
        //     // console.log(allFilmInfo);
        //     $('.filmContainer').append(template(allFilmInfo));//se il titolo è uguale al titolo originale ne metto uno
        //   }else{
        //     allFilmInfo.titoloOriginale = filmInfo[i].original_name;
        //     // console.log(allFilmInfo);
        //     allFilmInfo.preTitolo = "Titolo Originale: ";
        //     $('.filmContainer').append(template(allFilmInfo));//appendi il film con entrambi i titoli
        //   };
        // }
      })
      .fail(function(richiesta, stato, errori) {
        console.log(richiesta, stato, errori);
      })
      $(".inputSearch").val("");//cancella ricerca
    }
  );

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
  function generaOutput(listaOggetti, tipo){
    for (var i = 0; i < listaOggetti.length; i++) {//fai un ciclo per i dati dei film
      if (tipo === "Serie TV") {
        var titoloGenerato = listaOggetti[i].name;
        var titoloOriginaleGenerato = listaOggetti[i].original_name;
      }else if(tipo === "Film"){
        var titoloGenerato = listaOggetti[i].title;
        var titoloOriginaleGenerato = listaOggetti[i].original_title;
      }
      var allFilmInfo = {
        cover: "https://image.tmdb.org/t/p/w185" + listaOggetti[i].poster_path,
        titolo: titoloGenerato,
        lingua: listaOggetti[i].original_language,
        votiTot: listaOggetti[i].vote_count,
        stelle: generaStella(Math.round(listaOggetti[i].vote_average/2)),
        tipo: tipo
      };
      for (var j = 0; j < imgFlag.length; j++) {
        // console.log(imgFlag[j]);
        if (listaOggetti[i].original_language == imgFlag[j]) {
          allFilmInfo.lingua = "<img src='img/" + listaOggetti[i].original_language + ".png'>";
          console.log("si");
        }
      };
      // var voto = Math.round(listaOggetti[i].vote_average/2);
      // var stelle = generaStella(voto);
      // allFilmInfo.stelle = stelle;
      if (titoloGenerato == titoloOriginaleGenerato) {
        console.log(allFilmInfo);
        $('.filmContainer').append(template(allFilmInfo));//se il titolo è uguale al titolo originale ne metto uno
      }else{
        allFilmInfo.titoloOriginale = titoloOriginaleGenerato;
        console.log(allFilmInfo);
        allFilmInfo.preTitolo = "Titolo Originale: ";
        $('.filmContainer').append(template(allFilmInfo));//appendi il film con entrambi i titoli
      };
    }

  }

});
