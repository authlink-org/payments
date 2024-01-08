const Express = require("express")
const App = Express()

App.get("/sellix/:apikey/webhook", (req, res) => {
  console.log(req.headers["x-sellix-event"])
  console.log(req)
  res.send("The Fuck")
})

const PORT = process.env.PORT || 3000
App.listen(PORT)