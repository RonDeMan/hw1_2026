import type { NoteData } from '../components/Note'

export type NotesAction =
  | { type: 'SET_NOTES'; payload: NoteData[] }
  | { type: 'ADD_NOTE'; payload: NoteData }
  | { type: 'REMOVE_NOTE'; payload: string }
  | { type: 'UPDATE_NOTE'; payload: NoteData }

export function notesReducer(state: NoteData[], action: NotesAction) {
  switch (action.type) {
    case 'SET_NOTES':
      return action.payload
    case 'ADD_NOTE':
      return [action.payload, ...state].slice(0, 10)
    case 'REMOVE_NOTE':
      return state.filter((note) => note._id !== action.payload)
    case 'UPDATE_NOTE':
      return state.map((note) => (note._id === action.payload._id ? action.payload : note))
    default:
      return state
  }
}