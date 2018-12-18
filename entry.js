//Schema for Url Response Data Structure for Mongo

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const entriesSchema = new Schema({
  originalUrl: String,
  shortUrl: String
},{timestamps:true}); 

//collection and schema for mongoosemodel
//Entries is name of collection

const EntriesModel=mongoose.model('entry',entriesSchema);

//allows us to access in server.js
module.exports=EntriesModel;