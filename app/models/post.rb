class Post < ActiveRecord::Base

  attr_accessible :image, :source_id, :summary, :title, :url

  default_scope order('created_at DESC')

end
