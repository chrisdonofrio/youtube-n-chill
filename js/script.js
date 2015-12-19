$(document).ready(function() {

  function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
  }

  $(".addVideoUrlBtn").on("click", function(){
    var videoId = youtube_parser($(".idInput").val());
    var player = $("<iframe>");
    player.attr("width", "560").attr("height", "315")
    .attr("src", "https://www.youtube.com/embed/"+videoId)
    .attr("frameborder", "0")
    .attr("allowfullscreen");
    $(".videoDiv").append(player);
  })
});