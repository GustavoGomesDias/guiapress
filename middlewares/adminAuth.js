function adminAuth(req, res, next){
    // next => dar continuidade na requisição
    // Serve pra passar a requisição do middleware pra rota

    if(req.session.user != undefined){
        next();
    }else{
        res.redirect('/login');
    }
}

module.exports = adminAuth;