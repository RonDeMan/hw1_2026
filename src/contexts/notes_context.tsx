import React from 'react'
import axios from 'axios'
import type { NewNoteData, NoteData } from '../components/Note'
import type { NotesAction } from '../reducer_functions/notes_reducer'

export const initialNotes: NoteData[] = []

const API_URL = 'http://localhost:3001/notes'

export type NotesContextValue = {
	notes: NoteData[]
	dispatchNotes: React.Dispatch<NotesAction>
	deleteNote: (noteId: string) => Promise<void>
	updateNote: (note: NoteData) => Promise<void>
	addNote: (note: NewNoteData) => Promise<NoteData>
}

export const notes_context = React.createContext<NotesContextValue | null>(null)

export const deleteNoteRequest = async (noteId: string) => {
	await axios.delete(`${API_URL}/${noteId}`)
}

export const updateNoteRequest = async (note: NoteData) => {
	await axios.put(`${API_URL}/${note._id}`, note)
}

export const addNoteRequest = async (note: NewNoteData) => {
    
	const response = await axios.post(API_URL, note)
    console.log('addNoteRequest response:', response)
	return response.data as NoteData
}