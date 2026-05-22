const mongoose = require('mongoose')


if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://HW_db_user:${password}@edgeprogramminghomework.edvwavc.mongodb.net/noteApp?appName=EdgeProgrammingHomework`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

type NoteType = {
  content: string
  important: boolean
}

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

// const note = new Note({
//   content: 'HTML is easy',
//   important: true,
// })

// note.save().then(() => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })

Note.find({}).then((result: NoteType[]) => {
  result.forEach((note: NoteType) => {
    console.log(note)
  })
  mongoose.connection.close()
})