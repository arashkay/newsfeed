class PostsController < ApplicationController
  
  respond_to :json, :html

  def index
    @posts = Post.recent.all
    respond_with @posts
  end

  def list
    @posts = Post.where [ 'created_at > ?', Time.now-2.days ] 
    @tags = Tag.trends
    respond_with @posts
  end

  def read
    @post = Post.find params[:id]
    render :layout => false
  end

  def last
    render :json => Post.customise params[:types], params[:id]
  end

  def likes
    @posts = Post.where( :id => params[:ids] ).select([:id, :likes]).all
    render :json => @posts
  end

  def like
    @post = Post.find params[:id]
    @post.increment! :likes
    render :json => { id: @post.id, likes: @post.likes }
  end
  
  def dislike
    @post = Post.find params[:id]
    @post.decrement! :likes if @post.likes > 0
    render :json => { id: @post.id, likes: @post.likes }
  end
  
  def fetch
    Source.fetch
    redirect_to posts_path
  end

end
