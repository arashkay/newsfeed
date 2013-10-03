var feed = {};

$(function(){

$.extend(feed, {
  sources: {
    saved: function(data){
      if(data.id)
        location.href= '/sources';
    }
  }
});

});
