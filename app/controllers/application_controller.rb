class ApplicationController < ActionController::Base

  protect_from_forgery

  def authenticate_admin!
    if !session[:admin] && params[:arash].blank?
      redirect_to root_path
    else
      session[:admin] = true
    end
  end

  def detect_device!
    if params[:device].blank? || params[:device][:did].blank?
      @device = nil
    else
      @device = Device.find_or_create_by_did params[:device][:did]
    end
  end


end
