const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title:{type: String},
    categories:[{type: mongoose.SchemaTypes.ObjectId, ref: 'Category'}],//数组为一对多关联关系。单个对象为一对一关联关系
    body:{type: String}
})

module.exports = mongoose.model('Article', schema)