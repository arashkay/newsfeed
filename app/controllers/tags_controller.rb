class TagsController < ApplicationController

  before_filter :authenticate_admin!
  
  def index
    @tags = Tag.order('created_at DESC').all
    respond_to do |format|
      format.html
      format.json { render :json => @tags }
    end
  end

  def new
    @tag = Tag.new
    render 'edit'
  end

  def create
    @tag = Tag.new params[:tag]
    @tag.save
    respond_to do |format|
      format.html { redirect_to tags_path }
      format.json { render :json => true }
    end
  end

  def edit
    @tag = Tag.find params[:id]
  end

  def update
    @tag = Tag.find params[:id]
    @tag.update_attributes params[:tag]
    redirect_to tags_path
  end

end
