class PostsController < ApplicationController
  
  respond_to :json, :html

  def index
    @posts = Post.recent.all
    respond_with @posts
  end

  def last
    @posts = Post.latest(params[:id]).all
    respond_with @posts
  end

  def likes
    @posts = Post.where( :id => params[:ids] ).select([:id, :likes]).all
    render :json => @posts
  end

  def like
    @post = Post.find params[:id]
    @post.increment! :likes
    render :json => @post
  end
  
  def dislike
    @post = Post.find params[:id]
    @post.decrement! :likes if @post.likes > 0
    render :json => @post
  end
  
  def fetch
    Source.fetch
    redirect_to posts_path
  end

end
