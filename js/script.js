//link to firebase database
var database = new Firebase("https://dazzling-fire-1875.firebaseio.com/")
var currentVideo = new Firebase("https://dazzling-fire-1875.firebaseio.com/currentVideo")
var queuedVideos =  new Firebase("https://dazzling-fire-1875.firebaseio.com/queuedVideos");



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
      var videoIdRef = database.child("currentVideo");
      videoIdRef.push({
        vidId: videoId,
        url: url
      })
      currentVideo.limitToFirst(1).on("child_added", function(snapshot) {
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
          playerVars: {'controls': 0 },
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
  }
}

$(document).ready(function() {
  var database = new Firebase("https://dazzling-fire-1875.firebaseio.com/")
  var queuedVideos =  new Firebase("https://dazzling-fire-1875.firebaseio.com/queuedVideos");
  $(".videoAddedAlert").hide();
  $(".noTextAlertStart").hide();
  $(".noTextAlertAdded").hide();

 //pulls current video, if there is one, from DB and plays it
  currentVideo.limitToFirst(1).on("child_added", function(snapshot) {
    firstVideo = snapshot.val();
    videoId = firstVideo.vidId;
    console.log(firstVideo);
    player = new YT.Player('player', {
      height: '315',
      width: '560',
      videoId:  videoId,
      playerVars: {'controls': 0 },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
    $(".urlInput").hide();
    $(".startVideoUrlBtn").hide();
  })

  //removes current video and loads new one everytime current video is changed on DB
  currentVideo.limitToFirst(1).on("child_changed", function(snapshot) {
    $("iframe").attr("src", "");
    $("iframe").remove();
    //creates new div for youtube API to replace with iframe
    newPlayerDiv = $("<div id='player'></div>");
    $(".videoDiv").prepend(newPlayerDiv);
    //creates new iframe of new current video
    newVideo = snapshot.val();
    videoId = newVideo.vidId;
    player = new YT.Player('player', {
      height: '315',
      width: '560',
      videoId:  videoId,
      playerVars: {'controls': 0 },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  })

  //takes YouTube URL as arguemnt and returns video ID
  function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
  }

  //adds url and video ID for a queued video to DB
  $(".addVideoUrlBtn").on("click", function(){
    videoId = youtube_parser($(".urlQueueInput").val());
    if  (videoId === false){
      $(".noTextAlertAdded").slideDown().delay(1500).slideUp();
    }else{
      url = $(".urlQueueInput").val();
      videoId = youtube_parser($(".urlQueueInput").val());
      var videoIdRef = database.child("queuedVideos");
      videoIdRef.push({
        vidId: videoId,
        url: url
      });
      $(".urlQueueInput").val("");
      $(".videoAddedAlert").slideDown().delay(1500).slideUp();
    }
  });
});