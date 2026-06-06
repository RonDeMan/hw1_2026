import mongoose from 'mongoose'

export type Author = {
  name: string
  email: string
}

export type NoteType = {
  title: string
  author: Author | null
  content: string
  user?: mongoose.Types.ObjectId
}

export type userType = {
  name: string,
  email: string,
  username: string,
  passwordHash: string
}

const noteSchema = new mongoose.Schema<NoteType>({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    default: null,
  },
  content: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})
const Note = mongoose.model('Note', noteSchema)

export const getNotes = async ({ skip, limit }: { skip: number; limit: number }) => {
  const notes = await Note.find({}).skip(skip).limit(limit).sort({ _id: -1 })
  const totalCount = await Note.countDocuments({})
  return [notes, totalCount]
}

export const getNote = async (id: string) => {
  return await Note.findById(id)
}

export const addNote = async (noteData: NoteType) => {
  const note = new Note(noteData)
  return await note.save()
}

export const updateNote = async (id: string, noteData: NoteType) => {
    return await Note.findByIdAndUpdate(id, noteData, { new: true })
}

export const deleteNote = async (id: string) => {
  return await Note.findByIdAndDelete(id)
}

export const getithNote = async (index: number) => {
  const notes = await Note.find({})
    if (index < 0 || index >= notes.length) {
        return null
    }
    return notes[index]
}

export const updateithNote = async (index: number, noteData: NoteType) => {
    const notes = await Note.find({})
    if (index < 0 || index >= notes.length) {
        return null
    }
    const note = notes[index]
    note.title = noteData.title
    note.author = noteData.author
    note.content = noteData.content
    return await note.save()
}

export const deleteithNote = async (index: number) => {
    const notes = await Note.find({})
    if (index < 0 || index >= notes.length) {
        return null
    }
    const note = notes[index]
    return await Note.findByIdAndDelete(note._id)
}

export const filterNotes = async (query: string) => {
  // substring match, chronological order (which implies _id: 1)
  const notes = await Note.find({ content: { $regex: query, $options: 'i' } }).sort({ _id: 1 }).limit(10)
  return notes
}
