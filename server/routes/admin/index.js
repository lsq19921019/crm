module.exports = app => {
    const express = require('express')
    const jwt = require('jsonwebtoken')
    const assert = require('http-assert')
    const AdminUser = require('../../models/AdminUser')

    const router = express.Router({
        mergeParams: true
    })
    const resourceMiddelware = require('../../middleWare/resource')
    const authMiddleware = require('../../middleWare/auth')
//创建资源
    router.post('/', async (req,res)=>{

        const model = await req.Model.create(req.body)
        res.send(model)
    });
//更新资源
    router.put('/:id', async (req,res)=>{
        const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
        res.send(model)
    });
//删除资源
    router.delete('/:id', async (req,res)=>{
        const model = await req.Model.findByIdAndDelete(req.params.id, req.body)
        res.send({
            success:true
        })
    });
//获取资源列表
    router.get('/', authMiddleware(),
    async (req,res)=>{
        const queryOptions = {}
        if(req.Model.modelName==='Category'){
            queryOptions.populate = 'parent'

        }
        const items = await req.Model.find().setOptions(queryOptions).limit(10)
        res.send(items)
    });
//编辑资源
    router.get('/:id', async (req,res)=>{
        const model = await req.Model.findById(req.params.id)
        res.send(model)
    });

    app.use('/admin/api/rest/:resource',authMiddleware() ,resourceMiddelware() ,router)

    const multer = require('multer')
    const upload = multer({dest: __dirname+'/../../uploads'})

    app.use('/admin/api/upload',authMiddleware() ,upload.single('file'), async (req, res)=>{
        const file = req.file
        file.url = `http://localhost:3000/uploads/${file.filename}`
        res.send(file)
    });
    
    app.use('/admin/api/login',async (req, res)=>{
        const {username, password} = req.body
        const user = await AdminUser.findOne({username}).select('+password')
        console.log(user);
        assert(user, 422, '用户不存在')

        // if(!user){
            
        //     return res.status(422).send({
        //         message:'用户不存在'
        //     });
        // }
        const isValid = require('bcryptjs').compareSync(password,user.password)

        assert(isValid, 422, '密码错误')
        // if(!isValid){
        //     return res.status(422).send({
        //         message:'密码错误'
        //     });
        // }

        const token = jwt.sign({id: user._id}, app.get('secret'))
        res.send({token})
    });
    
    app.use(async (err, req, res, next)=>{
        res.status(err.statusCode || 500).send({
            message: err.message
        })
    })
}
