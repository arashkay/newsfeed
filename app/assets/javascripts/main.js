var feed = {};

$(function(){

$.extend(feed, {
  storage: {
    index: 1,
    likes: []
  },
  init: function(){
    $.cookie.json = true;
    feed.liking();
    $('.fn-posts').on( 'click', '.fn-more, .fn-like, .fn-dislike', feed.posts.actions );
  },
  liking: function(){
    var likes = $.cookie('likes');
    if(likes==null||likes=='') likes = [];
    feed.storage.likes = likes;
    var posts = $('.fn-post');
    $.each(feed.storage.likes, function(i,v){
      posts.filter('[data-dbid='+v+']').addClass('liked');
    });
  },
  sources: {
    saved: function(data){
      if(data.id)
        location.href= '/sources';
    }
  },
  posts: {
    actions: function(){
      if($(this).is('.fn-more'))
        feed.posts.more.call(this);
      if($(this).is('.fn-like'))
        feed.posts.like.call(this);
      if($(this).is('.fn-dislike'))
        feed.posts.dislike.call(this);
    },
    more: function(){
      var post = $(this).parents('.fn-post');
      if(post.is('.expanded')){
        post.find('.fn-description').slideUp();
        post.removeClass('expanded');
      }else{
        $('.fn-post.expanded').removeClass('expanded').find('.fn-description').slideUp();
        post.css( 'zIndex', feed.storage.index++ );
        post.find('.fn-description').slideDown();
        post.addClass('expanded');
      }
    },
    liked: function(data){
      $(this).parents('.fn-post').find('.fn-likecount').text(data.likes);
    },
    like: function(){
      var post = $(this).parents('.fn-post').addClass('liked');
      var id = post.data('dbid');
      var isnew = true;
      $.each(feed.storage.likes,function(i,v){
        if(v!=id) return true;
        isnew = false;
        return false;
      });
      if(!isnew) return;
      feed.storage.likes.push(id);
      $.cookie('likes', feed.storage.likes, { expires: 1500 });
    },
    dislike: function(){
      var post = $(this).parents('.fn-post').removeClass('liked');
      var id = post.data('dbid');
      feed.storage.likes.splice( feed.storage.likes.indexOf( id ), 1 )
      $.cookie('likes', feed.storage.likes, { expires: 1500 });
    }
  }
});

feed.init();

});
