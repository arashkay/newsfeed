Newsfeed::Application.routes.draw do
  
  resources :sources, :only => [:index, :new, :create, :edit, :update, :destroy]
  
  resources :posts, :only => :index do
    collection do
      get :fetch
      post :likes
      get :list
    end

    member do
      post :like
      post :dislike
    end
  end
   
  match '/:id' => 'posts#last' 
  root :to => 'posts#index'

end
