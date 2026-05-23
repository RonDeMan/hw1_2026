import * as model from '../models/notes_model.ts'

export const getNote = (id: string) => {
  return model.getNote(id)
}

export const deleteNote = (id: string) => {
  return model.deleteNote(id)
}

export const addNote = (noteData: model.NoteType) => {
  return model.addNote(noteData)
}

export const getNotes = (queryParams: any) => {
  const page = parseInt(queryParams._page) || 1
  const perPage = parseInt(queryParams._per_page) || 10
  const skip = (page - 1) * perPage
  return model.getNotes({ skip, limit: perPage })
}

export const getithNote = (index: number) => {
  return model.getithNote(index)
}

export const updateithNote = (index: number, noteData: model.NoteType) => {
  return model.updateithNote(index, noteData)
}

export const deleteithNote = (index: number) => {
  return model.deleteithNote(index)
}

export const updateNote = (id: string, noteData: model.NoteType) => {
  return model.updateNote(id, noteData)
}