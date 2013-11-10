# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20131110232637) do

  create_table "post_tags", :force => true do |t|
    t.integer  "post_id",    :null => false
    t.integer  "tag_id",     :null => false
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "post_tags", ["post_id"], :name => "post_tags_post_id_fk"
  add_index "post_tags", ["tag_id"], :name => "post_tags_tag_id_fk"

  create_table "posts", :force => true do |t|
    t.string   "title"
    t.integer  "source_id"
    t.text     "summary"
    t.string   "url"
    t.string   "image"
    t.datetime "created_at",                :null => false
    t.datetime "updated_at",                :null => false
    t.integer  "likes",      :default => 0
    t.text     "body"
  end

  add_index "posts", ["source_id"], :name => "posts_source_id_fk"

  create_table "sources", :force => true do |t|
    t.string   "name"
    t.string   "url"
    t.datetime "created_at",                     :null => false
    t.datetime "updated_at",                     :null => false
    t.text     "format"
    t.integer  "tag_id"
    t.integer  "category_id"
    t.boolean  "is_disabled", :default => false
  end

  add_index "sources", ["tag_id"], :name => "sources_tag_id_fk"

  create_table "tags", :force => true do |t|
    t.string   "name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
    t.integer  "type_id"
  end

  create_table "trashes", :force => true do |t|
    t.string   "url"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "trashes", ["url"], :name => "index_trashes_on_url"

  add_foreign_key "post_tags", "posts", :name => "post_tags_post_id_fk"
  add_foreign_key "post_tags", "tags", :name => "post_tags_tag_id_fk"

  add_foreign_key "posts", "sources", :name => "posts_source_id_fk"

  add_foreign_key "sources", "tags", :name => "sources_tag_id_fk"

end
