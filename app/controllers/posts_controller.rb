class PostsController < ApplicationController

  def index
    @posts = Post.all
  end
  
  def fetch
    Source.fetch
    redirect_to posts_path
  end

end
