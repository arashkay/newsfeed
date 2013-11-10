class CreateTrashes < ActiveRecord::Migration
  def change
    create_table :trashes do |t|
      t.string :url

      t.timestamps
    end

    add_index :trashes, :url
  end
end
