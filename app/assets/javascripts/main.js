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
    $('.fn-posts').on( 'click', '.fn-more, .fn-read, .fn-like, .fn-dislike, .fn-tagit, .fn-add-tag, .fn-cancel-tag', feed.posts.actions );
    $('.fn-taggable').mouseup( feed.tags.tag );
    if($('.fn-tagging').size()>0) feed.tags.highlight();
    if($('.fn-reader').size()>0) feed.reader.init();
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
  reader: {
    init: function(){
      $('.fn-like').click(feed.posts.like);
      $('.fn-dislike').click(feed.posts.dislike);
    }
  },
  sources: {
    saved: function(data){
      if(data.id)
        location.href= '/sources';
    },
    deleted: function(data){
      $(this).parents('.fn-source').fadeOut();
    }
  },
  tags: {
    find: function(){
      var text = "";
      if (window.getSelection) {
        text = window.getSelection().toString();
      } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
      }
      return text;
    },
    tag: function(){
      var tag = $.trim(feed.tags.find());
      var post = $(this).parents('.fn-post');
      $('.fn-taggable', post).popover('destroy');
      $(this).popover( { html: true, content: '<input name="tag" type="text" value="'+tag+'"><a class="btn btn-success icon-plus fn-add-tag"></a><a class="btn btn-danger icon-remove fn-cancel-tag"></a>', placement: 'top' } );
    },
    cancel: function(){
      var post = $(this).parents('.fn-post');
      $('.fn-taggable', post).popover('destroy');
    },
    save: function(){
      var post = $(this).parents('.fn-post');
      var tag = $('[name=tag]', post).val();
      $.post( '/tags.json', { tag: { name: tag } }, feed.tags.saved );
      $('.fn-taggable', post).popover('destroy');
    },
    highlight: function(){
      $.get( '/tags.json', feed.tags.colorise );
    },
    colorise: function(tags){
      var posts = $('.fn-taggable');
      $.each( tags, function(){
        posts.highlight(this.name);
      });
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
      if($(this).is('.fn-read'))
        feed.posts.read.call(this);
      if($(this).is('.fn-tagit'))
        feed.tags.save.call(this);
      if($(this).is('.fn-cancel-tag'))
        feed.tags.cancel.call(this);
      if($(this).is('.fn-add-tag'))
        feed.tags.save.call(this);
    },
    read: function(){
      var post = $(this).parents('.fn-post');
      $('.fn-news-title').text($('.fn-title', post).text());
      $('.fn-news-url').attr( 'href', $('.fn-url', post).attr('href') );
      $('.fn-news-body').text($('.fn-body', post).text());
      $('#postbody').modal('show');
    },
    more: function(){
      var post = $(this).parents('.fn-post');
      if(post.is('.expanded')){
        post.find('.fn-description').slideUp();
        post.removeClass('expanded').addClass('shrinked');
      }else{
        $('.fn-post.expanded').removeClass('expanded').find('.fn-description').slideUp();
        post.css( 'zIndex', feed.storage.index++ );
        post.find('.fn-description').slideDown();
        post.addClass('expanded').removeClass('shrinked');
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
