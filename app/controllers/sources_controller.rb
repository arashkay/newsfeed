class SourcesController < ApplicationController
  
  before_filter :authenticate_admin!
    
  def index
    @sources = Source.all
  end

  def new
    @source = Source.new
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

end
