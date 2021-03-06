import React, { Component } from 'react'

export const Label = ({ text, onX }) => {
  return (
    <div className='label'>
      <div className='label-inner'>
        <div className='label-button' onClick={ onX }><i className="im im-x-mark"></i></div>
        <div className='label-text'>{ text }</div>
      </div>
    </div>
  )
}

export default class TypeAhead extends Component {
  state = { input: '', selections: [], selected: [], selectionsDisplayed: false }

  componentDidMount = () => {
    this.setState({ selections: this.props.selections || [] })
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.check && !nextProps.check.length) this.setState({ selected: [], input: '' })
    this.setState({ selections: nextProps.selections || [] })
  }
  
  onChange = () => ev => {
    ev.preventDefault()
    const { input, selections, selected } = this.state
    let { value } = ev.target
    if (value[value.length - 1] == ',' && input.trim().length) {
      let sliced = value.slice(0, -1)

      if (selected.indexOf(sliced) !== -1) return this.setState({ input: value })
      else {
        this.setState({
          input: '',
          selections: selections.indexOf(sliced) !== -1 ? selections : [ ...selections, sliced ],
          selected: [ ...selected, sliced ]
        })
        return this.props.onUpdate([ ...selected, sliced ])
      }
    } else {
      this.setState({ input: value })
    }
    this.props.onUpdate([ ...selected, value ])
  }

  onSelect = name => e => {
    const { selected, selections } = this.state
    this.setState({
      input: '',
      selectionsDisplayed: selections.length == selected.length + 1 ? false : true,
      selected: [ ...selected, name ]
    })
    this.props.onUpdate([ ...selected, name ])
  }

  onDeselect = name => () => {
    this.setState({
      selected: this.state.selected.filter(select => select != name)
    })
  }

  toggleDropdown = () => {
    this.setState({
      selectionsDisplayed: !this.state.selectionsDisplayed
    })
  }

  clear = () => { this.setState({ selected: [], input: '' }) }

  onFocus = () => {
    this.input.focus()
    // document.addEventListener('click', this.onSelect(), false)
  }

  render = () => {
    const { input, selected, selectionsDisplayed } = this.state
    let { selections } = this.state
    let { label } = this.props
    const { onSelect, onChange, onDeselect, toggleDropdown, clear, onFocus } = this

    selections = selections
      .filter(select => selected.indexOf(select) == -1)
      .filter(select => select.match(new RegExp(input, 'gi')))

    return (
      <div className='typeahead-container' ref={ node => this.node = node }>
        { label ? <label>{ label }</label> : null }
        <div className='typeahead' onClick={ onFocus }>
          <div className='main'>
            <span className='selected'>
              {/* added items go here */}
              { selected.map(select => <Label key={ select } text={ select } onX={ onDeselect(select) } />) }
              <input
                ref={ (input) => { this.input = input } }
                value={ input }
                onChange={ onChange() }
                size={ input.length ? input.length : 1 } />
            </span>

            <span className='buttons'>
              <span onClick={ clear }><i className="im im-x-mark-circle" style={ { color: selected.length ? 'inherit' : 'transparent' } }></i></span>
              <span onClick={ toggleDropdown }>
                { selectionsDisplayed ? <i className="im im-angle-up-circle"></i> : <i className="im im-angle-down-circle"></i> }
              </span>
            </span>
          </div>

          { input.length || selectionsDisplayed ?
            <div className='selections'>
            { /* selections here */}
            { selections.map(select => <div key={ select } onClick={ onSelect(select) }>{ select }</div>) }
            </div> : null
          }
          
        </div>
      </div>
    )
  }
}