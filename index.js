console.log("Starting App..")

setTimeout(() => {
  const {PrismaClient} = require('@prisma/client')
  const prisma = new PrismaClient()
  const Express = require("express")
  const App = Express()

  async function CreateKey(ApiKey) {
    return new Promise(async (Res, Rej) => {
      const Project = await prisma.project.findFirst({
        where: {
          api_key: ApiKey
        }
      })

      if(Project) {
        const Response = await prisma.license.create({
          data: {
            projectId: Project.id,
            lifetime: true
          }
        })
        Res(Response.id)
      } else {
        Res(false)
      }
    }) 
  }

  App.post("/sellix/:apikey/webhook", (req, res) => {
    if(req.headers["x-sellix-event"] === "product:dynamic") {
      const ApiKey = req.params.apikey
      console.log("Handling payment for", ApiKey)
      CreateKey(ApiKey).then((Key) => {
        if(Key === false) {
          console.log("Unauthorized!")
          return res.status(401)
        }
        console.log("Generated License")
        return res.send(Key)
      })
    }
  })

  const PORT = process.env.PORT || 3000
  App.listen(PORT)
}, 10000);