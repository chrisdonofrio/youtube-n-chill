$(document).ready(function() {
  var videoDB =  new Firebase("https://dazzling-fire-1875.firebaseio.com/");

  function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
  }


  // create youtube player
  var player;
  function onYouTubePlayerAPIReady() {
    player = new YT.Player('player', {
      height: '315',
      width: '560',
      videoId: youtube_parser($(".urlStartVideoInput").val()),
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }

  // autoplay video
  function onPlayerReady(event) {
    event.target.playVideo();
  }

  // when video ends
  function onPlayerStateChange(event) {        
    if(event.data === 0) {            
      alert('done');
    }
  }
  /*
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
*/
});