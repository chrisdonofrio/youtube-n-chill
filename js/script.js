//link to firebase database
var database = new Firebase("https://dazzling-fire-1875.firebaseio.com/")
var videoDB =  new Firebase("https://dazzling-fire-1875.firebaseio.com/videos");

//pulls first video in queue, if there is one, from DB and plays it
videoDB.limitToFirst(1).on("child_added", function(snapshot) {
  firstVideo = snapshot.val();
  videoId = firstVideo.vidId;
  player = new YT.Player('player', {
    height: '315',
    width: '560',
    videoId:  videoId,
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
  $(".urlInput").hide();
  $(".startVideoUrlBtn").hide();
})

function youtube_parser(url){
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  var match = url.match(regExp);
  return (match&&match[7].length==11)? match[7] : false;
}
// create youtube player
var player;
function onYouTubePlayerAPIReady() {
  $(".startVideoUrlBtn").on("click", function(){
    url = $(".urlInput").val();
    videoId = youtube_parser($(".urlInput").val());
    if (videoId === false){
      $(".noTextAlertStart").slideDown().delay(1500).slideUp();
    }else{
      var videoIdRef = database.child("videos");
      videoIdRef.push({
          vidId: videoId,
          url: url
      })
      videoDB.limitToFirst(1).on("child_added", function(snapshot) {
        firstVideo = snapshot.val();
        key = snapshot.key();
        console.log(key);
        console.log(snapshot.val());
        videoId = snapshot.val().vidId;
        console.log(videoId);
        player = new YT.Player('player', {
          height: '315',
          width: '560',
          videoId:  videoId,
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
        $(".urlInput").hide();
        $(".startVideoUrlBtn").hide();
      })
    }
  })
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



$(document).ready(function() {
  var database = new Firebase("https://dazzling-fire-1875.firebaseio.com/")
  var videoDB =  new Firebase("https://dazzling-fire-1875.firebaseio.com/videos");
  $(".videoAddedAlert").hide();
  $(".noTextAlertStart").hide();
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
      var videoIdRef = videoDB.child("videos");
      videoIdRef.push({
          id: videoId,
          url: url
      });
      $(".urlQueueInput").val("");
      $(".videoAddedAlert").slideDown().delay(1500).slideUp();
    }
  });
});