const app = require('./app')
const config = require('./utils/config')

const PORT = config.PORT
console.log(PORT)
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`)
})
