class SourcesController < ApplicationController
  
  before_filter :authenticate_admin!
    
  def index
    @sources = Source.all
  end

  def new
    @source = Source.new_with_format
    @tags = Tag.all
  end

  def create
    @source = Source.new params[:source]
    @source.format = params[:format]
    if @source.save
      render :json => @source
    else
      render :json => @source.errors
    end
  end

  def edit
    @source = Source.find params[:id]
    @tags = Tag.all
    render :new
  end

  def update
    @source = Source.find params[:id]
    @source.format = params[:format]
    if @source.update_attributes params[:source] 
      render :json => @source
    else
      render :json => @source.errors
    end
  end

  def destroy
    #@source = Source.find params[:id]
    #render :json => @source.destroy
  end

end
