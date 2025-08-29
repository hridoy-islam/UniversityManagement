import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, Calendar, User } from "lucide-react"

interface Note {
  id: string
  title: string
  content: string
  category: "general" | "academic" | "personal" | "urgent"
  createdBy: string
  createdDate: string
  lastModified: string
}

interface NotePageProps {
  student: any
  onSave: (data: any) => void
}

const mockNotes: Note[] = [
  {
    id: "1",
    title: "Initial Interview Notes",
    content: "Student showed strong motivation and clear career goals. Excellent English proficiency.",
    category: "academic",
    createdBy: "Admin User",
    createdDate: "2024-01-15",
    lastModified: "2024-01-15",
  },
  {
    id: "2",
    title: "Document Review",
    content: "All required documents submitted. Degree certificate needs verification.",
    category: "general",
    createdBy: "Document Officer",
    createdDate: "2024-01-12",
    lastModified: "2024-01-14",
  },
]

export default function NotePage({ student, onSave }: NotePageProps) {
  const [notes, setNotes] = useState<Note[]>(mockNotes)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [noteForm, setNoteForm] = useState({
    title: "",
    content: "",
    category: "general" as Note["category"],
  })

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSaveNote = () => {
    if (editingNote) {
      // Update existing note
      setNotes((prev) =>
        prev.map((note) =>
          note.id === editingNote.id
            ? {
                ...note,
                ...noteForm,
                lastModified: new Date().toISOString().split("T")[0],
              }
            : note,
        ),
      )
    } else {
      // Create new note
      const newNote: Note = {
        id: Date.now().toString(),
        ...noteForm,
        createdBy: "Current User", // In real app, get from auth
        createdDate: new Date().toISOString().split("T")[0],
        lastModified: new Date().toISOString().split("T")[0],
      }
      setNotes((prev) => [newNote, ...prev])
    }

    setIsDialogOpen(false)
    setEditingNote(null)
    setNoteForm({ title: "", content: "", category: "general" })
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setNoteForm({
      title: note.title,
      content: note.content,
      category: note.category,
    })
    setIsDialogOpen(true)
  }

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId))
  }

  const getCategoryBadge = (category: string) => {
    const variants = {
      general: "bg-gray-100 text-gray-800",
      academic: "bg-blue-100 text-blue-800",
      personal: "bg-green-100 text-green-800",
      urgent: "bg-red-100 text-red-800",
    }
    return <Badge className={variants[category as keyof typeof variants]}>{category}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingNote(null)
                setNoteForm({ title: "", content: "", category: "general" })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingNote ? "Edit Note" : "Add New Note"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="note-title">Title</Label>
                <Input
                  id="note-title"
                  value={noteForm.title}
                  onChange={(e) => setNoteForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter note title"
                />
              </div>
              <div>
                <Label htmlFor="note-category">Category</Label>
                <select
                  id="note-category"
                  value={noteForm.category}
                  onChange={(e) => setNoteForm((prev) => ({ ...prev, category: e.target.value as Note["category"] }))}
                  className="w-full p-2 border border-input rounded-md"
                >
                  <option value="general">General</option>
                  <option value="academic">Academic</option>
                  <option value="personal">Personal</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <Label htmlFor="note-content">Content</Label>
                <Textarea
                  id="note-content"
                  value={noteForm.content}
                  onChange={(e) => setNoteForm((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter note content"
                  rows={8}
                />
              </div>
              <Button onClick={handleSaveNote} className="w-full">
                {editingNote ? "Update Note" : "Save Note"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Notes List */}
      <div className="grid gap-4">
        {filteredNotes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No notes found</p>
            </CardContent>
          </Card>
        ) : (
          filteredNotes.map((note) => (
            <Card key={note.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{note.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {note.createdBy}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {note.createdDate}
                      </div>
                      {getCategoryBadge(note.category)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEditNote(note)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{note.content}</p>
                {note.lastModified !== note.createdDate && (
                  <p className="text-xs text-muted-foreground mt-2">Last modified: {note.lastModified}</p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
