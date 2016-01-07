//link to firebase database
var database = new Firebase("https://dazzling-fire-1875.firebaseio.com/");
var currentVideo = new Firebase("https://dazzling-fire-1875.firebaseio.com/currentVideo");
var queuedVideos =  new Firebase("https://dazzling-fire-1875.firebaseio.com/queuedVideos");
var timer = new Firebase("https://dazzling-fire-1875.firebaseio.com/timer");

//takes YouTube URL and returns video ID
function youtube_parser(url){
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  var match = url.match(regExp);
  return (match&&match[7].length==11)? match[7] : false;
}

//create youtube player
var player;
function onYouTubePlayerAPIReady() {
  
}

// autoplay video
function onPlayerReady(event) {
  event.target.playVideo();
  timer.set({
      seconds: 0
    });
  setInterval(function(){
    currentTime = player.getCurrentTime();
    timer.set({
      seconds: currentTime
    })
  }, 1000);
}

function onPlayerReadyWithSeek(event) {
  event.target.playVideo();
  timer.once("value", function(snapshot){
    currentTime = snapshot.val().seconds;
    console.log(currentTime);
    player.seekTo(currentTime);
  })
  setInterval(function(){
    currentTime = player.getCurrentTime();
    timer.set({
      seconds: currentTime
    })
  }, 1000);
}



// when video ends
function onPlayerStateChange(event) {
/* 
  ******YouTube API reference******
    for event.data:
    -1 (unstarted)
    0 (ended)
    1 (playing)
    2 (paused)
    3 (buffering)
    5 (video cued)
  */
  if(event.data === 2){
    event.target.playVideo();
  }else if(event.data === 0) {
    $("iframe").attr("src", "");
    $("iframe").remove();
    //creates new div for youtube API to replace with iframe
    newPlayerDiv = $("<div id='player'></div>");
    $(".videoDiv").prepend(newPlayerDiv);
    $(".urlInput").show();
    $(".urlInput").val("");
    $(".startVideoUrlBtn").show();
    currentVideo.update({
      vidId: "donotdelete"
    })
  }
  //if a video has been added to queued video list this will run otherwise it will not
  queuedVideos.limitToFirst(1).on("child_added", function(snapshot) { 
    if(event.data === 0) {
      //change event data so if statement will not return true everytime a child is added after video has ended
      event.data = 6;
      $(".urlInput").hide();
      $(".startVideoUrlBtn").hide();
      nextVideo = snapshot.val();
      console.log(nextVideo)
      currentVideo.set({
        url: nextVideo.url,
        vidId: nextVideo.vidId,
      });
      var nextVideoInfoKey = snapshot.key();
      var queuedRef = database.child("queuedVideos");
      var nextVideoRef = queuedRef.child(nextVideoInfoKey);
      nextVideoRef.remove();
    }
  })
}



$(document).ready(function() {
  var database = new Firebase("https://dazzling-fire-1875.firebaseio.com/")
  var queuedVideos =  new Firebase("https://dazzling-fire-1875.firebaseio.com/queuedVideos");
  var currentVideo = new Firebase("https://dazzling-fire-1875.firebaseio.com/currentVideo")
  //hide alerts
  $(".videoAddedAlert").hide();
  $(".noTextAlertStart").hide();
  $(".noTextAlertAdded").hide();
  $(".embedErrorAlert").hide();
  $(".videoNotFoundAlert").hide();
  $(".noSearchTerm").hide();
  $(".urlQueueInput").hide();
  $(".addVideoUrlBtn").hide();


  //on click function to hide embed error alert
  $(".confirmVideoSkippedBtn").on("click", function(){
    $(".alert").slideUp();
  })

  queuedVideos.on("child_added", function(snapshot){
    videoId = snapshot.val().vidId;
    youtubeApiUrl = "https://www.googleapis.com/youtube/v3/videos?part=id%2Csnippet&id="+videoId+"&key=AIzaSyDh7vcT2FXjwM9cLOpOq8zOZ52MGr-TVtQ";
    $.ajax({
      type: "GET",
      url: youtubeApiUrl,
      success: youtubeApiSuccessHandlerQueue
    });
  });

  database.on("child_removed", function(snapshot){
    console.log(snapshot.key());
    if (snapshot.key() === "queuedVideos"){
      $(".queuePanel").addClass("hidden");
    }
  })

  queuedVideos.on("child_removed", function(snapshot){
    $("#queue").children().first().remove();
  })

  function youtubeApiSuccessHandlerQueue(response){
    newli = $("<li>");
    videoTitle = response.items[0].snippet.title;
    newli.append(videoTitle);
    $("#queue").append(newli);
    $(".queuePanel").removeClass("hidden");
  }

  //shows an alert and move to next video if there is an error embeding a video
  function onErrorFunction(event){
    if (event.data === 100)
      $("#videoNotFound").slideDown();
    else{
      $("#embedNotAllowed").slideDown();
    }
    $(".urlInput").show();
    $(".startVideoUrlBtn").show();
    $("iframe").attr("src", "");
    $("iframe").remove();
    currentVideo.update({
      vidId: "donotdelete"
    })

    //changes current video to next in queue if there is one
    queuedVideos.limitToFirst(1).once("child_added", function(snapshot) { 
      $(".urlInput").hide();
      $(".startVideoUrlBtn").hide();
      nextVideo = snapshot.val();
      currentVideo.set({
        url: nextVideo.url,
        vidId: nextVideo.vidId,
      });
      var nextVideoInfoKey = snapshot.key();
      var queuedRef = database.child("queuedVideos");
      var nextVideoRef = queuedRef.child(nextVideoInfoKey);
      nextVideoRef.remove();
    })
  }

  //search
  $(".searchBtn").on("click", function(){
    searchQuery = $(".searchInput").val().trim();
    if (searchQuery === ""){
      $(".noSearchTerm").slideDown().delay(1500).slideUp();
      return;
    }else{
      youtubeApiUrl = "https://www.googleapis.com/youtube/v3/search?q="+searchQuery+"&part=snippet&maxResults=50&key=AIzaSyDh7vcT2FXjwM9cLOpOq8zOZ52MGr-TVtQ"
      $.ajax({
          type: "GET",
          url: youtubeApiUrl,
          success: youtubeApiSuccessHandlerSearch
      
      })
    }
  })

  function youtubeApiSuccessHandlerSearch(response){
    console.log(response.items);
    $("#searchResults").empty();
    for (i = 0; i < 50; i++) { 
      if (response.items[i].id.kind ==="youtube#video"){
        resultTitle = response.items[i].snippet.title;
        videoId = response.items[i].id.videoId
        newLi = $("<li>");
        newA= $("<a class='resultLink'>");
        newA.html(resultTitle)
        newA.attr("href", "https://www.youtube.com/watch?v="+videoId);
        newA.attr("target", "_blank");
        newImg = $("<img>");
        newImg.attr("src", response.items[i].snippet.thumbnails.default.url);
        newBr = $("<br>");
        newBtn = $("<button id='"+videoId+"' class='btn btn-priamry addVideoSearchBtn'>");
        newBtn.html("Add To Queue");
        newAlertDiv = $("<div class='alert alert-info videoaddedsearchalert"+videoId+"'>");
        newAlertDiv.html("Added to Queue!");
        newLi.append(newImg).append(newBtn).append(newBr).append(newA).append(newAlertDiv);
        $("#searchResults").append(newLi);
        newAlertDiv.hide();
      }
    } 
  }

  $(document).on("click", ".addVideoSearchBtn", function(){
    videoId = $(this).attr("id");
    url = "https://www.youtube.com/watch?v="+$(this).attr("id");
    alertClass= "videoaddedsearchalert"+videoId;
    $("."+alertClass).slideDown().delay(1500).slideUp();
    currentVideo.limitToLast(1).once("value", function(snapshot) {
      currentVideoId = snapshot.val().vidId;
      if (currentVideoId==="donotdelete"){
        currentVideo.update({
          vidId: videoId,
          url: url
        });
      }else{
        queuedVideos.push({
          vidId: videoId,
          url: url
        });
      }
    }) 
  });

  //hide searh panel on click
  $(document).on("click", ".hidePanelBtn", function(){
    $(".hidePanelBtn").toggleClass("hidePanelBtn showPanelBtn");
    $(".showPanelBtn").html("<i class='fa fa-caret-right'>");
    currentVideo.once("value", function(snapshot) {
      $(".searchColumn").toggleClass("col-md-3 col-md-1");
      $(".searchInput").hide();
      $(".searchBtn").hide();
      $("#searchResults").hide();
      $(".queuePanel").css("height", "-=30")
      $(".videoDiv").toggleClass("col-md-6 col-md-8");
      videoId = snapshot.val().vidId;
      //if there is a video playing currently
      if(videoId != "donotdelete"){
        $("iframe").attr("width", "750").attr("height", "422");
      }
    })
  })

  //show searh panel on click
  $(document).on("click", ".showPanelBtn", function(){
    $(".showPanelBtn").toggleClass("hidePanelBtn showPanelBtn");
    $(".hidePanelBtn").html("<i class='fa fa-caret-left'>");
    currentVideo.once("value", function(snapshot) {
      $(".searchColumn").toggleClass("col-md-3 col-md-1");
      $(".searchInput").show();
      $(".searchBtn").show();
      $("#searchResults").show();
      $(".queuePanel").css("height", "+=30")
      $(".videoDiv").toggleClass("col-md-6 col-md-8");
      videoId = snapshot.val().vidId;
      //if there is a video playing currently
      if(videoId != "donotdelete"){
        $("iframe").attr("width", "560").attr("height", "315");
      }
    })
  })

  //add start video to DB
  $(".startVideoUrlBtn").on("click", function(){
    url = $(".urlInput").val();
    videoId = youtube_parser($(".urlInput").val());
    if (videoId === false){
      $(".noTextAlertStart").slideDown().delay(1500).slideUp();
    }else{
      var currentVideoRef = database.child("currentVideo");
      currentVideoRef.update({
        vidId: videoId,
        url: url,
      })
    $(".urlInput").hide();
    $(".startVideoUrlBtn").hide();
    }
  })

  //pulls current video if there one from DB and plays it
  currentVideo.limitToLast(1).once("child_added", function(snapshot) {
    videoId = snapshot.val();
    console.log(videoId);
    if(videoId === "donotdelete"){
      return;
    }else{
      player = new YT.Player("player", {
        height: "315",
        width: "560",
        videoId:  videoId,
        playerVars: {"controls": 0, "disablekb": 1},
        events: {
          "onError": onErrorFunction,
          "onReady": onPlayerReadyWithSeek,
          "onStateChange": onPlayerStateChange
        }
      });
      $(".urlInput").hide();
      $(".startVideoUrlBtn").hide();
      $(".urlQueueInput").show();
      $(".addVideoUrlBtn").show();
    }
   })

  //removes current video and loads new one everytime current video is changed on DB
  currentVideo.limitToLast(1).on("child_changed", function(snapshot) {
    $("iframe").attr("src", "");
    $("iframe").remove();
    //creates new div for youtube API to replace with iframe
    newPlayerDiv = $("<div id='player'></div>");
    $(".videoDiv").prepend(newPlayerDiv);
    //creates new iframe of new current video
    videoId = snapshot.val();
    console.log(videoId)
    //exits function if there not a another video
    if (videoId === "donotdelete"){
      $(".urlInput").show();
      $(".urlInput").val("");
      $(".startVideoUrlBtn").show();
      $(".urlQueueInput").hide();
      $(".addVideoUrlBtn").hide();
      return;
    }else{
      if ($(".videoDiv").attr("class") === "videoDiv text-center col-md-8"){
        player = new YT.Player("player", {
          height: "422",
          width: "750",
          videoId:  videoId,
          playerVars: {"controls": 0, "disablekb": 1},
          events: {
            "onError": onErrorFunction,
            "onReady": onPlayerReady,
            "onStateChange": onPlayerStateChange
          }
        });
        $(".urlQueueInput").show();
        $(".addVideoUrlBtn").show();
        $(".urlInput").hide();
        $(".startVideoUrlBtn").hide();
      }else{
        player = new YT.Player("player", {
          height: "315",
          width: "560",
          videoId:  videoId,
          playerVars: {"controls": 0, "disablekb": 1},
          events: {
            "onError": onErrorFunction,
            "onReady": onPlayerReady,
            "onStateChange": onPlayerStateChange
          }
        });
        $(".urlQueueInput").show();
        $(".addVideoUrlBtn").show();
        $(".urlInput").hide();
        $(".startVideoUrlBtn").hide();
      }
    }
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
      queuedVideos.push({
        vidId: videoId,
        url: url
      });
      $(".urlQueueInput").val("");
      $(".videoAddedAlert").slideDown().delay(1500).slideUp();
    }
  });
});