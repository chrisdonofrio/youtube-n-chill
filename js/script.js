$(document).ready(function() {
  var videoDB =  new Firebase("https://dazzling-fire-1875.firebaseio.com/");
  $(".videoAddedAlert").hide();
  $(".noTextAlertAdded").hide();

  function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
  }

  $(".addVideoUrlBtn").on("click", function(){
    videoId = youtube_parser($(".urlQueueInput").val());
    if  (videoId === false){
      $(".noTextAlertAdded").slideDown().delay(1500).slideUp();
    }else{
      url = $(".urlQueueInput").val();
      videoId = youtube_parser($(".urlQueueInput").val());
      var videoIdRef = videoDB;
      videoIdRef.push({
        video: {
          id: videoId,
          url: url
        }
      });
      $(".urlQueueInput").val("");
      $(".videoAddedAlert").slideDown().delay(1500).slideUp();
    }
  });

  videoDB.on("child_added", function(snapshot, prevChildKey) {
    var newVideo = snapshot.val();
    console.log(newVideo.video.id);
  });

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