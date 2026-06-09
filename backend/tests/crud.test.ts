import { beforeEach, describe, expect, jest as jestObject, test } from '@jest/globals'
import type { Request } from 'express'
import * as notesService from '../services/notesService'
import {
	createNote,
	deleteNoteById,
	deleteNoteByIndex,
	getNoteById,
	getNoteByIndex,
	getNotes,
	updateNoteById,
	updateNoteByIndex,
} from '../controllers/notesController'

jestObject.mock('../services/notesService.ts', () => ({
	addNote: jestObject.fn(),
	deleteNote: jestObject.fn(),
	deleteithNote: jestObject.fn(),
	getithNote: jestObject.fn(),
	getNote: jestObject.fn(),
	getNotes: jestObject.fn(),
	updateithNote: jestObject.fn(),
	updateNote: jestObject.fn(),
}))

type MockResponse = {
	status: ReturnType<typeof jestObject.fn>
	json: ReturnType<typeof jestObject.fn>
	end: ReturnType<typeof jestObject.fn>
	set: ReturnType<typeof jestObject.fn>
}

type MockedNotesService = {
	addNote: ReturnType<typeof jestObject.fn>
	deleteNote: ReturnType<typeof jestObject.fn>
	deleteithNote: ReturnType<typeof jestObject.fn>
	getithNote: ReturnType<typeof jestObject.fn>
	getNote: ReturnType<typeof jestObject.fn>
	getNotes: ReturnType<typeof jestObject.fn>
	updateithNote: ReturnType<typeof jestObject.fn>
	updateNote: ReturnType<typeof jestObject.fn>
}

const mockedNotesService = notesService as unknown as MockedNotesService

const createMockResponse = () => {
	const response = {
		status: jestObject.fn(),
		json: jestObject.fn(),
		end: jestObject.fn(),
		set: jestObject.fn(),
	} as MockResponse

	response.status.mockReturnValue(response)
	response.json.mockReturnValue(response)
	response.end.mockReturnValue(response)
	response.set.mockReturnValue(response)

	return response
}

describe('notes CRUD controllers', () => {
	beforeEach(() => {
		jestObject.clearAllMocks()
	})

	test('creates a note when content is present', async () => {
		const request = {
			body: {
				title: 'Test note',
				content: 'Test content',
				author: null,
			},
            user: { _id: 'mock_id', name: 'Mock User', email: 'mock@example.com' }
		} as unknown as Request
		const response = createMockResponse()
		const createdNote = { id: '1', ...request.body }

		mockedNotesService.addNote.mockResolvedValue(createdNote as never)

		await createNote(request, response as never)

		expect(mockedNotesService.addNote).toHaveBeenCalledWith(request.body)
		expect(response.json).toHaveBeenCalledWith(createdNote)
	})

	test('rejects creating a note without content', async () => {
		const request = {
			body: {
				title: 'Missing content',
			},
            user: { _id: 'mock_id', name: 'Mock User', email: 'mock@example.com' }
		} as unknown as Request
		const response = createMockResponse()

		await createNote(request, response as never)

		expect(mockedNotesService.addNote).not.toHaveBeenCalled()
		expect(response.status).toHaveBeenCalledWith(400)
		expect(response.json).toHaveBeenCalledWith({ error: 'content missing' })
	})

	test('returns a note by id when it exists', async () => {
		const request = {
			params: { id: '123' },
		} as unknown as Request
		const response = createMockResponse()
		const note = { id: '123', title: 'Existing note', content: 'Saved content' }

		mockedNotesService.getNote.mockResolvedValue(note as never)

		await getNoteById(request, response as never)

		expect(mockedNotesService.getNote).toHaveBeenCalledWith('123')
		expect(response.json).toHaveBeenCalledWith(note)
	})

	test('returns 404 when a note by id does not exist', async () => {
		const request = {
			params: { id: 'missing' },
		} as unknown as Request
		const response = createMockResponse()

		mockedNotesService.getNote.mockResolvedValue(null as never)

		await getNoteById(request, response as never)

		expect(response.status).toHaveBeenCalledWith(404)
		expect(response.end).toHaveBeenCalled()
	})

	test('updates a note by id when it exists', async () => {
		const request = {
			params: { id: '123' },
			body: {
				title: 'Updated title',
				content: 'Updated content',
				author: null,
			},
            user: { _id: 'mock_id', name: 'Mock User', email: 'mock@example.com' }
		} as unknown as Request
		const response = createMockResponse()
		const updatedNote = { id: '123', ...request.body }

		mockedNotesService.updateNote.mockResolvedValue(updatedNote as never)

		await updateNoteById(request, response as never)

		expect(mockedNotesService.updateNote).toHaveBeenCalledWith('123', request.body)
		expect(response.json).toHaveBeenCalledWith(updatedNote)
	})

	test('returns 204 after deleting a note by id', async () => {
		const request = {
			params: { id: '123' },
            user: { _id: 'mock_id', name: 'Mock User', email: 'mock@example.com' }
		} as unknown as Request
		const response = createMockResponse()

		mockedNotesService.deleteNote.mockResolvedValue({} as never)

		await deleteNoteById(request, response as never)

		expect(mockedNotesService.deleteNote).toHaveBeenCalledWith('123')
		expect(response.status).toHaveBeenCalledWith(204)
		expect(response.end).toHaveBeenCalled()
	})

	test('returns the note list and total count header', async () => {
		const request = {
			query: { _page: '1', _per_page: '10' },
		} as unknown as Request
		const response = createMockResponse()
		const notes = [{ id: '1', title: 'First', content: 'One' }]

		mockedNotesService.getNotes.mockResolvedValue([notes, 1] as never)

		await getNotes(request, response as never)

		expect(mockedNotesService.getNotes).toHaveBeenCalledWith(request.query)
		expect(response.set).toHaveBeenCalledWith('X-Total-Count', '1')
		expect(response.json).toHaveBeenCalledWith(notes)
	})

	test('returns a note by index when it exists', async () => {
		const request = {
			params: { i: '0' },
		} as unknown as Request
		const response = createMockResponse()
		const note = { id: '1', title: 'First', content: 'One' }

		mockedNotesService.getithNote.mockResolvedValue(note as never)

		await getNoteByIndex(request, response as never)

		expect(mockedNotesService.getithNote).toHaveBeenCalledWith(0)
		expect(response.json).toHaveBeenCalledWith(note)
	})

	test('updates a note by index when it exists', async () => {
		const request = {
			params: { i: '0' },
			body: {
				title: 'Edited note',
				content: 'Edited content',
				author: null,
			},
            user: { _id: 'mock_id', name: 'Mock User', email: 'mock@example.com' }
		} as unknown as Request
		const response = createMockResponse()
		const updatedNote = { id: '1', ...request.body }

		mockedNotesService.updateithNote.mockResolvedValue(updatedNote as never)

		await updateNoteByIndex(request, response as never)

		expect(mockedNotesService.updateithNote).toHaveBeenCalledWith(0, request.body)
		expect(response.json).toHaveBeenCalledWith(updatedNote)
	})

	test('returns 204 after deleting a note by index', async () => {
		const request = {
			params: { i: '0' },
            user: { _id: 'mock_id', name: 'Mock User', email: 'mock@example.com' }
		} as unknown as Request
		const response = createMockResponse()

		mockedNotesService.deleteithNote.mockResolvedValue({} as never)

		await deleteNoteByIndex(request, response as never)

		expect(mockedNotesService.deleteithNote).toHaveBeenCalledWith(0)
		expect(response.status).toHaveBeenCalledWith(204)
		expect(response.end).toHaveBeenCalled()
	})
})