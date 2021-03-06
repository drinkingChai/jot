const conn = require('./conn')
const { models } = conn 
const machine = require('../machine')

const Thought = conn.define('thought', {
  text: {
    type: conn.Sequelize.TEXT,
    allowNull: false,
    validate: { notEmpty: true },
  },
  created_at: {
    type: conn.Sequelize.DATE
  }
}, {
  hooks: {
    afterCreate(instance, options) {
      return models.category.classifyThought(instance)
        .then(() => instance)
      // return instance
    },
    afterUpdate(instance, options) {
      /* leaving it off to not reclassify
      return instance.changed('text') ?
        models.category.classifyThought(instance)
          .then(() => instance) :
        instance */
      return instance
    }
  }
})

Thought.findWithinLimit = function(userId, minutes) {
  /*
    find the created and the one before that
    if the previous one was within 5 minutes, return the previous one
  */
  return this.findAll({
    where: { userId },
    order: [[ 'createdAt', 'DESC' ]],
    limit: 2
  })
  .then(thoughts =>
    thoughts.length > 1 && (new Date() - (new Date(thoughts[1].createdAt))) / 1000 / 60 < minutes ?
    thoughts[1] : null
  )
}


/* ================================================= */
/* ================= api wrappers  ================= */

Thought.storeAndCluster = function(content, userId) {
  Object.assign(content, { userId })

  return this.create(content)
    .then(newThought =>
      this.findWithinLimit(userId, 5)
        .then(thought => {
          /*
            if there is one, and it's in a cluster, append to that cluster
            if there is one, but not part of a cluster, place both in a cluster
          */
          if (thought && thought.clusterId) {
            return models.cluster.appendTo(thought.clusterId, newThought.id)
          } else if (thought) {
            return models.cluster.makeCluster({ userId }, [thought.id, newThought.id])
          }
        })
    )
  
}

Thought.getThoughts = function(userId) {
  return this.findAll({
    where: { userId },
    order: [[ 'createdAt', 'DESC' ]],
    include: [ models.category, models.cluster ] })
}

Thought.updateThought = function(id, content) {
  return this.findById(id)
    .then(thought => {
      Object.assign(thought, content)
      return thought.save()
    })
}

Thought.deleteThought = function(id) {
  return this.findById(id)
    .then(thought => {
      if (!thought) throw new Error('thought not found')

      return thought.clusterId ?
        Promise.all([
          thought,
          models.cluster.removeFrom(thought.clusterId, thought.id) ]) :
        Promise.all([ thought ])
    })
    .then(([ thought, ...rest ]) => thought.destroy()) 
}

Thought.removeCategory = function(id, categoryId) {
  return this.findById(id)
    .then(thought => {
      return models.category.findById(categoryId)
        .then(category => {
          return thought.removeCategories(category)
        })
    })
}

Thought.addCategory = function(id, category) {
  return this.findById(id)
    .then(thought => {
      return models.category._findOrCreate(category)
        .then(category => {
          return thought.addCategories(category)
        })
    })
}

module.exports = Thought
