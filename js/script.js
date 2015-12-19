$(document).ready(function() {

  function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
  }

  $(".startVideoUrlBtn").on("click", function(){
    var videoId = youtube_parser($(".urlInput").val());
    var player = $("<iframe>");
    player.attr("width", "560").attr("height", "315")
    .attr("src", "https://www.youtube.com/embed/"+videoId)
    .attr("frameborder", "0")
    .attr("allowfullscreen");
    $(".videoDiv").append(player);
    $(".urlInput").hide();
    $(".startVideoUrlBtn").hide();
  })


function loadAPIClientInterfaces() {
  gapi.client.load('youtube', 'v3', function() {
    gapi.client.load();
    gapi.client.setApiKey(AIzaSyDh7vcT2FXjwM9cLOpOq8zOZ52MGr-TVtQ)
  });
}

loadAPIClientInterfaces();

/*
  $.ajax({
    type: "GET",
    url: "https://developers.google.com/apis-explorer/#p/youtube/v3/youtube.search.list?part=snippet&order=viewCount&q=skateboarding+dog&type=video&videoDefinition=high&key=AIzaSyDh7vcT2FXjwM9cLOpOq8zOZ52MGr-TVtQ",
  });

*/
});