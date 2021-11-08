import React, { Component } from 'react';
import axios from 'axios';


class Fib extends Component {
    state = {
        seenIndexes: [],
        values: {},
        index: ''
    }

    componentDidMount() {
        console.log("mounted");
        this.fetchValues();
        this.fetchIndexes();
    }

    async fetchValues() {
        console.log("fetching values");
        const values = await axios.get('/api/values/current');
        console.log('values: ', values.data);
        this.setState({ values: values.data });
    }

    async fetchIndexes() {
        console.log("fetching indexes");
        const indexes = await axios.get('/api/values/all');
        console.log('indexes: ', indexes.data);
        this.setState({ seenIndexes: indexes.data });
    }

    renderSeenIndexes() {
        return this.state.seenIndexes.map(({ index }) => index).join(', ');
    }
    
    renderValues() {
        const entries = [];
        
        for (let key in this.state.values) {
            entries.push(
                <div key={key}>
                    Index {key} produced {this.state.values[key]}
                </div>
            );
        };

        return entries;
    }
    
    handleSubmit = async (event) => {
        event.preventDefault();

        await axios.post('/api/values', {
            index: this.state.index
        });
        this.setState({ index: '' });
    }
    
    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Enter an index:</label>
                    <input value={this.state.index}
                           onChange={event => this.setState({ index: event.target.value })} />
                    <button>Submit</button>
                </form>

                <h3>Seen Indices</h3>
                { this.renderSeenIndexes() }

                <h3>Calculations</h3>
                { this.renderValues() }
            </div>
        )
    }
}

export default Fib;