import React, { Component } from 'react'
import axios from 'axios'


export class Home extends Component {

    componentDidMount () {
        axios.get("http://api.repo.nypl.org/api/v1/items/search?q=prints+depicting+dance&publicDomainOnly=true", {
            headers: {
                "Authorization": "Token token=e9avdv82tzqy12ct"
            }
        })
        .then(resp => resp.json())
        .then(console.log)
    }
    render() {
        return (
            <div>
                <section className="home">
                    <div>
                        <h1>DanceConnect</h1>
                        <p>Meet other Dancers and Professionals in the field, create your Profile and Share your Story</p>
                    </div>
                </section>
            </div>
        )
    }
}

export default Home
