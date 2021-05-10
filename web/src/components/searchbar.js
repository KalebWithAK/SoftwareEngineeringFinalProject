import React from 'react'

class Searchbar extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            searchString: '',
            err: null
        }
    }

    render() {
        return (
            <div className='searchContainer'>
                <input onChange={ this.handleSearchChange } />
                <button onClick={ () => this.props.search(this.state.searchString) }>Search</button>
            </div>
        )
    }

    handleSearchChange = (e) => {
        this.setState({ searchString: e.target.value })
    }
}

 export default Searchbar