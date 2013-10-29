class TagsController < ApplicationController

  before_filter :authenticate_admin!
  
  def index
    @tags = Tag.order('created_at DESC').all
    respond_to do |format|
      format.html
      format.json { render :json => @tags }
    end
  end

  def create
    @tag = Tag.new params[:tag]
    render :json => @tag.save
  end

end
