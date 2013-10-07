Newsfeed::Application.routes.draw do
  
  resources :sources, :only => [:index, :new, :create]
  
  resources :posts, :only => :index do
    collection do
      get :fetch
      post :likes
    end

    member do
      post :like
      post :dislike
    end
  end
   
  match '/:id' => 'posts#last' 
  root :to => 'posts#index'

end
