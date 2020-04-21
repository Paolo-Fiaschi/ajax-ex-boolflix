
$(document).ready(function () {

  var buttonSearch = $(".search");
  var input = $(".inputSearch").val().toLowerCase();

  buttonSearch.click(

    function(){
      $.ajax({
        url: 'https://api.themoviedb.org/3/search/tv',
        type: 'GET',
        data: {
          api_key: '96dbb3102bf928acfb45de0581e0ec43',
          language: "it-IT",
          query: input
        }
      })
      .done(function(results) {
        console.log("success");
        console.log(input);
        console.log(results);
        $(".inputSearch").val("");
      })
      .fail(function(richiesta, stato, errori) {
        console.log("error");
        console.log(richiesta, stato, errori);
      })

    }
  );



});
