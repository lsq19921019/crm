<template>
    <div class="login-container">
        <el-card class="login-card" header="请先登录">
            <el-form @submit.native.prevent="login">
                <el-form-item label="用户名">
                    <el-input v-model="model.username"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" v-model="model.password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" native-type="submit">登陆</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>
<script>
export default {
    data(){
        return {
            model:{
                username:'',
                password:''
            },
        }
    },
    methods:{
        async login(){
            const res = await this.$http.post('login',this.model)
            localStorage.token = res.data.token
            console.log(res.data)
            this.$router.push('/')
            this.$message({
                type: 'success',
                message: "登陆成功"
            })
        }
    }
}
</script>
<style>
    .login-card{
        width: 25rem;
        margin: 10rem auto;
    }
    
</style>