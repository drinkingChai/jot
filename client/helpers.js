export function catFrequency (thoughts) {
  const frequencyCount = {}
  thoughts.forEach(thought => {
    thought.classifications.forEach(c => {
      const mapData = frequencyCount[c.label] ? frequencyCount[c.label] : []
      mapData.push(thought)
      frequencyCount[c.label] = mapData
    })
  })

  const frequencyMap = Object.keys(frequencyCount).map(key => ({ key, count: frequencyCount[key].length }))
  frequencyMap.sort((a, b) => b.count - a.count)
  return frequencyMap
}

export function catFrequencyOverTime (thoughts) {
  const frequencyCount = {}
  thoughts.forEach(thought => {
    thought.classifications.forEach(c => {
      const mapData = frequencyCount[c.label] ? frequencyCount[c.label] : []
      mapData.push(thought)
      frequencyCount[c.label] = mapData
    })
  })

  Object.keys(frequencyCount).forEach(key => {
    const dateMap = {}
    frequencyCount[key].forEach(thought => {
      const date = dateOnly(thought.created)
      dateMap[date] = dateMap[date] ? ++dateMap[date] : 1
    })
    frequencyCount[key].dateMap = Object.keys(dateMap).map(key => ({
      date: key,
      count: dateMap[key]
    }))
  })

  const frequencyMap = Object.keys(frequencyCount).map(key => ({
    key,
    count: frequencyCount[key].length,
    dateMap: frequencyCount[key].dateMap
  }))
  frequencyMap.sort((a, b) => b.count - a.count)

  return frequencyMap
}

export function thoughtsOverTime (thoughts) {
  // const byDate = thoughts.reduce((days, thought) => {
  //   const date = dateOnly(thought.created),
  //     fullDate = new Date(thought.created),
  //     onDate = days[date] || []

  //   onDate.push(`${fullDate.getHours()}:${fullDate.getMinutes()}:${fullDate.getSeconds()}`)
  //   days[date] = onDate
  //   return days
  // }, {})

  // return Object.keys(byDate)
  //   .map(k => ({
  //    date: k,
  //    times: byDate[k]
  //  }))

  return thoughts.reduce((times, thought) => ([ ...times, new Date(thought.created)]), [])
}

export function dateOnly (_date) {
  const date = new Date(_date)
  date.setHours(0, 0, 0, 0)
  return date
}

export function formatDate (_date) {
  const date = new Date(_date)
  return `${date.getMonth()}/${date.getDate()}/${date.getFullYear()} ${date.getHours() % 12}:${date.getMinutes()} ${date.getHours() % 12 > 0 ? 'PM' : 'AM' }`
}
