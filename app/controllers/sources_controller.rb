class SourcesController < ApplicationController
   
  def index
    @sources = Source.all
  end

  def new
    @source = Source.new
  end

  def create
    @source = Source.new params[:source]
    @source.format = params[:format]
    debugger
    if @source.save
      render :json => @source
    else
      render :json => @source.errors
    end
  end

end
