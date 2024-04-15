const knex = require("../database/knex")

class NotesController {
  async create(request, response) {
    const { title, description, tags, rating } = request.body
    const { user_id } = request.params

    const [note_id] = await knex("notesMovie").insert({
      title,
      description,
      rating,
      user_id
    })


    const tagsInsert = tags.map(name => {
      return {
        note_id,
        name,
        user_id
      }
    })

    await knex("tagsMovie").insert(tagsInsert)

    response.json()
  }

  async show(request, response) {
    const { id } = request.params

    const note = await knex("notesMovie").where({ id }).first()
    const tags = await knex("tagsMovie").where({ note_id: id }).orderBy("name")
    

    return response.json({
      ...note,
      tags
    })
  }

  async delete(request, response) {
    const { id } = request.params

    await knex("notesMovie").where({ id }).delete()

    return response.json()
  }

  async index(request, response) {
    const { title, user_id, tags } = request.query

    let notes

    if (tags) {
      const filterTags = tags.split(',').map(tag => tag.trim())

      notes = await knex("tagsMovie")
        .select([
          "notesMovie.id",
          "notesMovie.title",
          "notesMovie.user_id",
        ])
        .where("notesMovie.user_id", user_id)
        .whereLike("notesMovie.title", `%${title}%`)
        .whereIn("name", filterTags)
        .innerJoin("notesMovie", "notesMovie.id", "tagsMovie.note_id")
        .orderBy("notesMovie.title")
        
    } else {
      notes = await knex("notesMovie")
      .where({ user_id })
      .whereLike("title", `%${title}%`)
      .orderBy("title")
    }

    const userTags = await knex("tagsMovie").where({ user_id })
    const notesWhithTags = notes.map(note => {
      const noteTags = userTags.filter(tag => tag.note_id === note.id)

      return {
        ...note,
        tags: noteTags
      }
    })

    return response.json(notesWhithTags)
  }
}

module.exports = NotesController