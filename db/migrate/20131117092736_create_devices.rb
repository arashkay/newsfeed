class CreateDevices < ActiveRecord::Migration
  def change
    create_table :devices do |t|
      t.string :did
      t.string :regid
      t.timestamp :last_check

      t.timestamps
    end

    add_index :devices, :did
  end
end
