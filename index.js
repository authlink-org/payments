const Express = require("express")
const App = Express()

console.log("Starting payments server")

const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

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

const Reply = CreateKey("aa689c5b-4002-4107-b766-374755509ecc").then((X) => {
  console.log(X)
})

App.post("/sellix/:apikey/webhook", (req, res) => {
  if(req.headers["x-sellix-event"] === "order:paid:product") {
    const ApiKey = req.params.apikey
    CreateKey(ApiKey).then((Key) => {
      if(Key === false) {
        return res.status(401)
      }

      return res.send(Key)
    })
  }

  return res.status(301)
})

const PORT = process.env.PORT || 3000
App.listen(PORT)