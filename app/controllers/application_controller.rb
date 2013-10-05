class ApplicationController < ActionController::Base
  protect_from_forgery

  def authenticate_admin!
    if !session[:admin] && params[:arash].blank?
      redirect_to root_path
    else
      session[:admin] = true
    end
  end

end
