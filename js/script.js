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
});