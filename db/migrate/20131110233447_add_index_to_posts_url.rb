class AddIndexToPostsUrl < ActiveRecord::Migration
  def change

    add_index :posts, :url
  end
end
