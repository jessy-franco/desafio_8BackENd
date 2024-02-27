/* session */
/* app.get("/session", (req, res) => {
    if (req.session.counter) {
        req.session.counter++;
        res.send(`se ha visitado el sitio ${req.session.counter} veces`)
    }
    else {
        req.session.counter = 1;
        res.send("¡¡¡Bienv3nidx!!!")
    }
})
 */
/* Eliminar datos del session */

/* app.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (!err) res.send("Sesion cerrada!!!")
        else res.send({ status: "Error al cerrar sesión", body: err })
    })
}) */
/* login con session */

/* app.get("/login", (req, res) => {
    const { username, password } = req.query
    if (username !== 'Subtren' || password !== 'Erias') {
        return res.send('login failed')
    }
    req.session.user = username
    req.session.admin = true
    res.send('login success!')
})
function auth(req, res, next) {
    if (req.session?.user === 'Subtren' && req.session?.admin) {
        return next()
    }
    return res.status(401).send('error de autorización!')
}

app.get('/privado', auth, (req, res) => {
    res.send('si estas viendo esto es porque ya te logueaste!')
}) */
