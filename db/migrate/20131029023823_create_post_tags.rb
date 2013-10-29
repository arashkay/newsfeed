class CreatePostTags < ActiveRecord::Migration
  def change
    create_table :post_tags do |t|
      t.integer :post_id, :null => false
      t.integer :tag_id, :null => false

      t.timestamps
    end
    
    add_foreign_key :post_tags, :tags
    add_foreign_key :post_tags, :posts

  end
end
