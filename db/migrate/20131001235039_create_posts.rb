class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.string :title
      t.integer :source_id
      t.text :summary
      t.string :url
      t.string :image

      t.timestamps
    end
  end
end
