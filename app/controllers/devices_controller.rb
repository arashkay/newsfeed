class DevicesController < ApplicationController
  
  before_filter :detect_device!, :only => [:register]

  def register
    @device.regid = params[:device][:regid]
    render :json => @device.save
  end 

end
