Newsfeed::Application.routes.draw do
  
  resources :sources, :only => [:index, :new, :create]
  
  resources :posts, :only => :index do
    collection do
      get :fetch
    end
  end
   
  root :to => 'posts#index'

end
